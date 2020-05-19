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
    first_node = models.OneToOneField('manage_service.NodeQuestions', on_delete=models.CASCADE)


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

    answer = models.ForeignKey('manage_service.AnswersOption', related_name="people_answer_to_answer", null=True,
                               on_delete=models.CASCADE)


@admin.register(PeopleAnswer)
class PeopleAnswerAdmin(admin.ModelAdmin):
    list_display = ("token", "question", "data")
    list_filter = ("token", "question")


class NodeQuestions(models.Model):
    guid = models.CharField(primary_key=True, max_length=36)
    questions = models.ForeignKey('manage_service.Question', related_name="_to_questions",
                                  on_delete=models.CASCADE,
                                  db_index=True, null=True, blank=True)
    next_node = models.OneToOneField('manage_service.NodeQuestions', on_delete=models.CASCADE,
                                     related_name="NodeQuestions_next", null=True, blank=True)
    prev_node = models.OneToOneField('manage_service.NodeQuestions', on_delete=models.CASCADE,
                                     related_name="NodeQuestions_prev", null=True, blank=True)
    duration = models.IntegerField()


class Question(models.Model):
    def __str__(self):
        return self.title

    guid = models.CharField(primary_key=True, max_length=36)
    title = models.CharField(max_length=62)
    type = models.CharField(max_length=62)
    first_poll_problem_block = models.OneToOneField('manage_service.PollProblemBlock', on_delete=models.CASCADE,
                                                    null=True, blank=True)


class PollProblemBlock(models.Model):
    type = models.CharField(max_length=36)
    text = models.TextField()
    next_poll = models.OneToOneField('manage_service.PollProblemBlock', on_delete=models.CASCADE,
                                     related_name="PollProblem_next", null=True, blank=True)
    prev_poll = models.OneToOneField('manage_service.PollProblemBlock', on_delete=models.CASCADE,
                                     related_name="PollProblem_prev", null=True, blank=True)


class AnswersOption(models.Model):
    guid = models.CharField(primary_key=True, max_length=36)
    question = models.ForeignKey('manage_service.Question', related_name="answer_options_to_questions",
                                 on_delete=models.CASCADE,
                                 db_index=True)
    label = models.TextField()
