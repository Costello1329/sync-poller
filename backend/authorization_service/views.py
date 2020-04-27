from rest_framework.views import APIView
from main_function import response_processing
from rest_framework.response import Response
from main_function.request_validation import validate_request
from main_function.sessions_storage import authorize_user
from manage_service.models import UserGuid
from .req_schema import req_schema
from .res_schema import res_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        user_guid = request.data["user"]
        user_guid_db = UserGuid.objects.filter(guid=user_guid)
        if user_guid_db:
            body = {
                "authorized": True,
                "session": authorize_user(user_guid)
            }
        else:
            body = {
                "authorized": False
            }
        return response_processing.validate_response(body, res_schema)

    def options(self, request, *args, **kwargs):
        return response_processing.setup_cors_response_headers(Response(status=204))
