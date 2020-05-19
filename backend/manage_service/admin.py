from django.contrib import admin

from manage_service.models import UserGuid, Poll, AnswersOption, Question, PollProblemBlock, PeopleAnswer, NodeQuestions

admin.site.register(UserGuid)
admin.site.register(Poll)
admin.site.register(PollProblemBlock)
admin.site.register(AnswersOption)
admin.site.register(Question)
admin.site.register(NodeQuestions)
