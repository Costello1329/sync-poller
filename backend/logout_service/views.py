from rest_framework.views import APIView
from rest_framework.response import Response
from main_function import response_processing, sessions_storage
from main_function.request_validation import validate_request
from .req_schema import req_schema
from .res_schema import res_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        session_guid = request.data['session']
        sessions_storage.logout_user(session_guid)
        return response_processing.validate_response({}, res_schema)

    def options(self, request, *args, **kwargs):
        return response_processing.setup_cors_response_headers(Response(status=204))
