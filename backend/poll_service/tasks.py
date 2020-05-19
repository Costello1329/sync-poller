from __future__ import absolute_import, unicode_literals

import uuid

from celery import shared_task

from main_function.celary_controle_storage import TaskStorage, QuestionNodeStorage, QuestionStartTimeStorage
from manage_service.models import Poll, NodeQuestions
import datetime


@shared_task
def add(x, y):
    return x + y


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)


@shared_task
def update_poll_context(poll_guid, task_guid):
    task_storage = TaskStorage()
    if not task_storage.check_actual_task(task_guid, poll_guid):
        return
    node_storage = QuestionNodeStorage()
    node_guid = node_storage.get_node(poll_guid)
    time_storage = QuestionStartTimeStorage()
    if node_guid == "":
        poll = Poll.objects.filter(guid=poll_guid)[0]
        node = poll.first_node
        node_storage.change_node(node.guid, poll_guid)
        time_storage.change_timestamp(datetime.datetime.utcnow().timestamp(), poll_guid)
        update_poll_context.apply_async((poll_guid, task_guid), countdown=node.duration)
    else:
        node = NodeQuestions.objects.filter(guid=node_guid)[0].next_node
        node_storage.change_node(node.guid, poll_guid)
        update_poll_context.apply_async((poll_guid, task_guid), countdown=node.duration)


def create_poll_context(poll_guid):
    task_storage = TaskStorage()
    task_guid = str(uuid.uuid4())
    task_storage.start_task(task_guid, poll_guid)
    node_storage = QuestionNodeStorage()
    node_storage.change_node("", poll_guid)
    node_storage.node_storage.save()
    poll = Poll.objects.filter(guid=poll_guid)[0]
    update_poll_context.apply_async((poll_guid, task_guid), etc=poll.date_start)
