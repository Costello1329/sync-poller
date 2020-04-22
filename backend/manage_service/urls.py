from django.urls import path
from .views import UpdateView, GetView

app_name = "manage_service"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('update', UpdateView.as_view()),
    path('get', GetView.as_view()),
]
