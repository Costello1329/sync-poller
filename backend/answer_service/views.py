from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView

from answer_service import res_schema
from answer_service.req_schema import req_schema
from main_function import response_processing
from main_function.request_validation import validate_request
from main_function.response_processing \
    import get_unauthorized_response, get_reject_response, get_empty_success_response
from main_function.sessions_storage import get_user
from manage_service.models import UserGuid, Poll, PeopleAnswer, Question


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        session = request.data["session"]
        poll = request.data["poll"]
        answer = request.data["answer"]
        question = answer['guid']
        question_db = Question.objects.filter(guid=question)[0]
        data = answer['data']
        user_guid = get_user(session)
        if user_guid is None:
            get_unauthorized_response()
        user = UserGuid.objects.filter(guid=user_guid)
        if not user or user[0].poll.guid != poll:
            get_reject_response()
        user = user[0]
        if data["type"] == "checkbox":
            data_answer = data["data"]
            data_db = ""
            for i in data_answer:
                data_db += str(i) + '; '
            data_db = data_db[:-2]
            PeopleAnswer.objects.create(token=user, question=question_db, data=data_db)
            body = {}
            return get_empty_success_response()
        if data["type"] == "radio" or data["type"] == "textField":
            data_answer = str(data["data"])
            PeopleAnswer.objects.create(token=user, question=question_db, data=data_answer)
            return get_empty_success_response()
        return get_reject_response()
