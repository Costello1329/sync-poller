from django.db import models
from django.dispatch import receiver
from main_function.sessions_storage import logout_user


# Create your models here.

class Polls(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    description = models.CharField(max_length=62)
    datetime = models.DateTimeField()
    active = models.BooleanField(default=True)


class Tokens(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    poll = models.ForeignKey('manage_service.Polls', related_name="tokens_to_poll", on_delete=models.CASCADE,
                             db_index=True)


@receiver(models.signals.pre_delete, sender=Tokens, dispatch_uid='token_delete_signal')
def delete_tokens_session(sender, instance, using, **kwargs):
    logout_user(instance.guid)


class PeopleAnswer(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    token = models.ForeignKey('manage_service.Tokens', related_name="people_answer_to_tokens", db_index=True,
                              on_delete=models.CASCADE)
    correct = models.BooleanField(null=True)
    data = models.TextField(null=True)


class Questions(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    description = models.CharField(max_length=62)
    poll = models.ForeignKey('manage_service.Polls', related_name="questions_to_poll", on_delete=models.CASCADE,
                             db_index=True)
    datetime = models.DateTimeField(db_index=True)


class AnswerOptions(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    description = models.CharField(max_length=62)
    questions = models.ForeignKey('manage_service.Questions', related_name="answer_options_to_questions",
                                  on_delete=models.CASCADE,
                                  db_index=True)
