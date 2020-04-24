from rest_framework.views import APIView

from main_function import http_response, session
from main_function.request_validate import validate_request
from manage_service.models import Tokens
from .req_schema import req_schema
from .res_schema import res_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        session_guid = request.data['session']
        session.delete_session_with_session_guid(session_guid)
        return http_response.get_response_success({}, session_guid, res_schema)
