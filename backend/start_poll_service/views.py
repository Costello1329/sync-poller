from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView

from main_function.response_processing import get_success_response
from poll_service.tasks import create_poll_context


class UserView(APIView):
    def post(self, request):
        poll_guid = request.data["poll"]
        create_poll_context(poll_guid)
        return get_success_response({})