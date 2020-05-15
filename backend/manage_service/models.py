from django.db import models
from django.dispatch import receiver
from main_function.sessions_storage import logout_user
from django.contrib import admin


# Create your models here.

class Poll(models.Model):
    guid = models.CharField(primary_key=True, max_length=36)
    description = models.CharField(max_length=62)
    date_start = models.DateTimeField()
    active = models.BooleanField(default=True)


class UserGuid(models.Model):
    guid = models.CharField(primary_key=True, max_length=36)
    poll = models.ForeignKey('manage_service.Poll', related_name="tokens_to_poll", on_delete=models.CASCADE,
                             db_index=True)


@receiver(models.signals.pre_delete, sender=UserGuid, dispatch_uid='token_delete_signal')
def delete_tokens_session(sender, instance, using, **kwargs):
    logout_user(instance.guid)


class PeopleAnswer(models.Model):
    token = models.ForeignKey('manage_service.UserGuid', related_name="people_answer_to_tokens", db_index=True,
                              on_delete=models.CASCADE)
    question = models.ForeignKey('manage_service.Question', related_name="people_answer_to_questions", db_index=True,
                                 on_delete=models.CASCADE)
    data = models.TextField(null=True)


@admin.register(PeopleAnswer)
class PeopleAnswerAdmin(admin.ModelAdmin):
    list_display = ("token", "question", "data")
    list_filter = ("token", "question")


class Question(models.Model):
    def __str__(self):
        return self.title

    guid = models.CharField(primary_key=True, max_length=36)
    index = models.IntegerField(db_index=True)
    title = models.CharField(max_length=62)
    type = models.CharField(max_length=62)
    text = models.CharField(max_length=128)
    poll = models.ForeignKey('manage_service.Poll', related_name="questions_to_poll", on_delete=models.CASCADE,
                             db_index=True)
    date_start = models.DateTimeField(db_index=True)
    date_end = models.DateTimeField(db_index=True)


class PollProblemBlock(models.Model):
    type = models.CharField(max_length=36)
    text = models.TextField()
    questions = models.ForeignKey('manage_service.Question', related_name="PollProblemBlock_to_questions",
                                  on_delete=models.CASCADE,
                                  db_index=True)


class AnswersOption(models.Model):
    question = models.ForeignKey('manage_service.Question', related_name="answer_options_to_questions",
                                 on_delete=models.CASCADE,
                                 db_index=True)
    label = models.TextField()
