from django.urls import path

from .views import UserView

app_name = "manage_service"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('', UserView.as_view()),
]
