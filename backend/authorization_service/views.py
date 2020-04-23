from rest_framework.views import APIView

from main_function import http_response
from main_function.json_validate import validate_request
from .req_schema import req_schema


class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        return http_response.get_response_success({"xy": 1}, None)
