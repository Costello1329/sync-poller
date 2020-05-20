import datetime
import pytz
from rest_framework.response import Response
from rest_framework.views import APIView
import itertools

# Create your views here.
from main_function import response_processing
from main_function.celary_controle_storage import QuestionNodeStorage, QuestionStartTimeStorage
from main_function.request_validation import validate_request
from main_function.response_processing import get_reject_response, get_unauthorized_response, get_success_response
from main_function.sessions_storage import get_user
from manage_service.models import UserGuid, Poll, Question, PollProblemBlock, AnswersOption, NodeQuestions
from poll_service.req_schema import req_schema
from poll_service.res_schema import res_schema

epoch = datetime.datetime.utcfromtimestamp(0)


def unix_time_millis(dt):
    return round((dt - epoch).total_seconds() * 1000)


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        session = request.data["session"]
        poll_guid = request.data["poll"]
        user_guid = get_user(session)
        if user_guid is None:
            get_unauthorized_response()
        user = UserGuid.objects.filter(guid=user_guid)
        if not user or user[0].poll.guid != poll_guid:
            get_reject_response()
        node_storage = QuestionNodeStorage()
        node_guid = node_storage.get_node(poll_guid)
        print(node_guid)
        poll = Poll.objects.filter(guid=poll_guid)[0]
        now = unix_time_millis(datetime.datetime.utcnow())
        poll_start_time = unix_time_millis(
            datetime.datetime.utcfromtimestamp(poll.date_start.timestamp()))
        if node_guid == "":
            body = {
                "status": "before",
                "startTime": poll_start_time - now
            }
            print("before")
            return response_processing.validate_response(body, res_schema)
        if node_guid == "end":
            body = {
                "status": "after"
            }
            print("after")
            return response_processing.validate_response(body, res_schema)
        node = NodeQuestions.objects.filter(guid=node_guid)[0]
        current_question = node.question
        if True:
            poll_problem_block = current_question.first_poll_problem_block
            poll_problem_array = []
            while poll_problem_block is not None and poll_problem_block != poll_problem_block.next_poll:
                poll_problem_array.append({
                    "type": poll_problem_block.type,
                    "text": poll_problem_block.text
                })
                poll_problem_block = poll_problem_block.next_poll
            if current_question.type == "selectOne" or current_question.type == "selectMultiple":
                answer_option_dict = {}
                answers = AnswersOption.objects.filter(question=current_question)
                for answer in answers:
                    answer_option_dict.update({answer.guid: answer.label})
                solution = {
                    "type": current_question.type,
                    "labels": answer_option_dict
                }
            else:
                solution = {
                    "type": current_question.type
                }
            question_start_time = unix_time_millis(
                datetime.datetime.utcfromtimestamp(float(QuestionStartTimeStorage().get_timestamp(poll_guid))))
            question_end_time = unix_time_millis(
                datetime.timedelta(seconds=node.duration) + datetime.datetime.utcfromtimestamp(
                    float(QuestionStartTimeStorage().get_timestamp(poll_guid))))
            print("body")
            body = {
                "status": "open",
                "question": {
                    "startTime": question_start_time - now,
                    "endTime": question_end_time - now,
                    "title": current_question.title,
                    "guid": current_question.guid,
                    "problem": poll_problem_array,
                    "solution": solution
                }
            }
            return response_processing.validate_response(body, res_schema)
