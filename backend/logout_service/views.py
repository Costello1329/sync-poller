from rest_framework.views import APIView

from main_function import response_processing, sessions_storage
from main_function.request_validation import validate_request
from manage_service.models import Tokens
from .req_schema import req_schema
from .res_schema import res_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        session_guid = request.data['session']
        sessions_storage.logout_user(session_guid)
        return response_processing.send_response({}, res_schema)
