from django.db import models


# Create your models here.

class Pools(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    description = models.CharField(max_length=62)
    datetime = models.DateTimeField()
    active = models.BooleanField(default=True)


class Tokens(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    poll = models.ForeignKey('Pool', related_name="tokens_to_poll", on_delete=models.CASCADE, db_index=True)


class PeopleAnswer(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    token = models.ForeignKey('Tokens', related_name="people_answer_to_tokens", on_delete=models.CASCADE, db_index=True)
    correct = models.BooleanField(null=True)
    data = models.TextField(null=True)


class Questions(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    description = models.CharField(max_length=62)
    poll = models.ForeignKey('Pool', related_name="questions_to_poll", on_delete=models.CASCADE, db_index=True)
    datetime = models.DateTimeField(db_index=True)


class AnswerOptions(models.Model):
    guid = models.CharField(primary_key=True, max_length=42)
    description = models.CharField(max_length=62)
    questions = models.ForeignKey('Questions', related_name="answer_options_to_questions", on_delete=models.CASCADE,
                                  db_index=True)
