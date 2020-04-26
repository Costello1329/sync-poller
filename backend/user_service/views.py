from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView

from main_function import http_response, session
from main_function.request_validate import validate_request,validate_poll
from manage_service.models import Tokens
from .req_schema import req_schema
from .res_schema import res_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        session_guid = request.data["session"]
        poll_guid = request.data["poll"]
        if not validate_poll(poll_guid, session_guid):
            return http_response.get_response_reject(session_guid)
        user_token = session.get_user_token_for_session_guid(session_guid)

        if user_token is None:
            body = {
                "gotUser": False
            }
        else:
            body = {
                "gotUser": True,
                "role": "student",
                "userGuid": user_token
            }
        return http_response.get_response_success(body, session_guid, res_schema)
