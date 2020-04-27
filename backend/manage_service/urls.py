from django.urls import path
from .views import UpdateView, GetView

app_name = "manage_service"

urlpatterns = [
    path('update', UpdateView.as_view()),
    path('get', GetView.as_view()),
]
