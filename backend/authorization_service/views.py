from rest_framework.views import APIView

from main_function import response_processing
from main_function.request_validation import validate_request
from main_function.sessions_storage import authorize_user
from manage_service.models import Tokens
from .req_schema import req_schema
from .res_schema import res_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        user = request.data["user"]
        token_db = Tokens.objects.filter(guid=user)
        if token_db:
            body = {
                "authorized": True,
                "session": authorize_user(user)
            }
        else:
            body = {
                "authorized": False
            }
        return response_processing.send_response(body, res_schema)
