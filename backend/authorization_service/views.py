from django.shortcuts import render
from jsonschema import validate
# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView
from main_function import http_response, json_validate
from main_function.json_validate import validate_request
from .req_schema import req_schema


# Create your views here.
class UserView(APIView):
    @validate_request(req_schema)
    def post(self, request):
        return http_response.get_response_success({"xy": 1}, None)
