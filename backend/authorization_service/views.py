from rest_framework.views import APIView

from main_function import http_response, session
from main_function.request_validate import validate_request
from manage_service.models import Tokens
from .req_schema import req_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        user_token = request.data["user"]
        token_db = Tokens.objects.filter(guid=user_token)
        if token_db:
            session_guid = session.create_new_session(user_token)
            body = {
                "authorized": True,
                "session": session_guid
            }
        else:
            session_guid = None
            body = {
                "authorized": False
            }
        return http_response.get_response_success(body, session_guid)
