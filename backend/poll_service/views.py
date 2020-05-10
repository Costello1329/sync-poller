import datetime
import pytz
from rest_framework.response import Response
from rest_framework.views import APIView
import itertools

# Create your views here.
from main_function import response_processing
from main_function.request_validation import validate_request
from main_function.response_processing import get_reject_response, get_unauthorized_response, get_success_response
from main_function.sessions_storage import get_user
from manage_service.models import UserGuid, Poll, Question, PollProblemBlock, AnswersOption
from poll_service.req_schema import req_schema
from poll_service.res_schema import res_schema

epoch = datetime.datetime.utcfromtimestamp(0)


def unix_time_millis(dt):
    return round((dt - epoch).total_seconds() * 1000)


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        session = request.data["session"]
        poll = request.data["poll"]
        user_guid = get_user(session)
        if user_guid is None:
            get_unauthorized_response()
        user = UserGuid.objects.filter(guid=user_guid)
        if not user or user[0].poll.guid != poll:
            get_reject_response()
        poll_db = Poll.objects.filter(guid=poll)[0]
        current_question = Question.objects.filter(poll=poll_db, index=poll_db.current_question)[0]
        now = unix_time_millis(datetime.datetime.utcnow())
        question_start_time = unix_time_millis(datetime.datetime.utcfromtimestamp(current_question.date_start.timestamp()))
        question_end_time = unix_time_millis(datetime.datetime.utcfromtimestamp(current_question.date_end.timestamp()))
        if question_start_time > now:
            body = {
                "status": "before",
                "startTime": question_start_time - now
            }
            return response_processing.validate_response(body, res_schema)
        elif question_end_time < now and poll_db.count_question == current_question.index + 1:
            body = {
                "status": "after"
            }
            return response_processing.validate_response(body, res_schema)
        elif question_start_time <= now < question_end_time:
            poll_problem_blocks = PollProblemBlock.objects.filter(questions=current_question)
            poll_problem_array = []
            for poll_problem_block in poll_problem_blocks:
                poll_problem_array.append({
                    "type": poll_problem_block.type,
                    "text": poll_problem_block.text
                })
            if current_question.type is ["selectOne", "selectMultiple"]:
                answer_option_list = []
                answers = AnswersOption.objects.filter(question=current_question)
                for answer in answers:
                    answer_option_list.append(answer.text)
                solution = {
                    "type": current_question.type,
                    "labels": answer_option_list
                }
            else:
                solution = {
                    "type": current_question.type
                }
            body = {
                "status": "open",
                "question": {
                    "startTine": now - question_start_time,
                    "endTime": question_end_time - now,
                    "title": current_question.title,
                    "guid": current_question.guid,
                    "problem": poll_problem_array,
                    "solution": solution
                }
            }
            return response_processing.validate_response(body, res_schema)
        else:
            poll.current_question = current_question.index + 1
            poll.save()
            self.post(request)
