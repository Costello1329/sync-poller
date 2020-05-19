import uuid
import redis as redis


# storage dict{poll_guid : task_guid}


class TaskStorage:
    task_storage: redis.Redis

    def __init__(self):
        self.task_storage = redis.Redis(host='localhost', port=6379, db=2)

    def poll_exist(self, poll_guid):
        return bool(self.task_storage.exists(str(poll_guid)))

    def check_actual_task(self, task_guid, poll_guid):
        if not self.poll_exist(poll_guid):
            return False
        return self.task_storage.get(str(poll_guid)).decode("utf-8") == task_guid

    def start_task(self, task_guid, poll_guid):
        self.task_storage.mset({str(poll_guid): str(task_guid)})


# storage dict{poll_guid : question_node_guid }
class QuestionNodeStorage:
    node_storage: redis.Redis

    def __init__(self):
        self.node_storage = redis.Redis(host='localhost', port=6379, db=3)

    def poll_exist(self, poll_guid):
        return bool(self.node_storage.exists(str(poll_guid)))

    def change_node(self, question_node_guid, poll_guid):
        self.node_storage.mset({str(poll_guid): str(question_node_guid)})

    def get_node(self, poll_guid):
        if not self.poll_exist(poll_guid):
            return None
        return self.node_storage.get(str(poll_guid)).decode("utf-8")


# storage dict{poll_guid : current_question_start_time }
class QuestionStartTimeStorage:
    time_storage: redis.Redis

    def __init__(self):
        self.time_storage = redis.Redis(host='localhost', port=6379, db=4)

    def poll_exist(self, poll_guid):
        return bool(self.time_storage.exists(str(poll_guid)))

    def change_timestamp(self, timestamp, poll_guid):
        self.time_storage.mset({str(poll_guid): str(timestamp)})

    def get_timestamp(self, poll_guid):
        if not self.poll_exist(poll_guid):
            return None
        return self.time_storage.get(str(poll_guid)).decode("utf-8")
