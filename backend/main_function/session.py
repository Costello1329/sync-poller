import uuid

import redis as redis


class InvalidData(Exception):
    def __init__(self, message):
        self.message = message


class SessionsStorage:
    sessions: redis.Redis

    def __init__(self):
        self.sessions = redis.Redis(host='localhost', port=6379, db=0)

    def create_session(self, token: str, session_guid):
        self.sessions.mset({str(token): str(session_guid)})

    def check_session(self, token: str):
        if self.sessions.exists(str(token)) == 0:
            return False
        else:
            return True

    def delete_session(self, token: str):
        if not self.check_session(token):
            return
        self.sessions.delete(str(token))

    def get_session_guid(self, token: str):
        if not self.check_session(token):
            return None
        session_guid = self.sessions.get(str(token)).decode("utf-8")
        return session_guid


class UsersStorage:
    users_storage: redis.Redis

    def __init__(self):
        self.users_storage = redis.Redis(host='127.0.0.1', port=6379, db=1)

    def check_user(self, session_guid):
        if self.users_storage.exists(str(session_guid)) == 0:
            return False
        else:
            return True

    def create_user(self, session_guid: str, user_token: str):
        self.users_storage.mset({str(session_guid): str(user_token)})

    def delete_user(self, session_guid: str):
        if not self.check_user(session_guid):
            return
        self.users_storage.delete(str(session_guid))

    def get_user_token(self, session_guid):
        if not self.check_user(session_guid):
            return None
        user_token = self.users_storage.get(str(session_guid)).decode("utf-8")
        return user_token


def create_new_session(token: str):
    sessions = SessionsStorage()
    sessions_user = UsersStorage()
    sessions_guid = str(uuid.uuid4())
    if sessions.check_session(token):
        sessions_user.delete_user(sessions.get_session_guid(token))
    sessions.create_session(token, sessions_guid)
    sessions_user.create_user(sessions_guid, token)
    return sessions_guid


def delete_session(token: str):
    sessions = SessionsStorage()
    sessions_user = UsersStorage()
    sessions_user.delete_user(sessions.get_session_guid(token))
    sessions.delete_session(token)


def delete_session_with_session_guid(session_guid: str):
    sessions = SessionsStorage()
    sessions_user = UsersStorage()
    sessions.delete_session(sessions_user.get_user_token(session_guid))
    sessions_user.delete_user(session_guid)


def validate_session(session_guid: str):
    sessions_user = UsersStorage()
    return sessions_user.check_user(session_guid)


def get_user_token_for_session_guid(session_guid: str):
    sessions_user = UsersStorage()
    return sessions_user.get_user_token(session_guid)
