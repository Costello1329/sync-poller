from jsonschema import validate, ValidationError

from manage_service.models import Tokens
from . import session
from .http_response import get_response_error, get_response_reject, ResponseErrorType
from .session import validate_session


def validate_request(schema):
    def request_dec(func):
        def request_handler(self, request):
            request_data = request.data
            try:
                validate(instance=request_data, schema=schema)
                if request.data.get("session") is not None:
                    if not validate_session(request.data.get("session")):
                        return get_response_reject(request.data.get("session"))
                return func(self, request)
            except ValidationError:
                return get_response_error(ResponseErrorType.Contract, 400)

        return request_handler

    return request_dec


def validate_poll(poll_guid: str, session_guid: str):
    user_token = session.get_user_token_for_session_guid(session_guid)
    token_db = Tokens.objects.filter(guid=user_token)
    if not token_db:
        return False
    token_db = token_db[0]
    return token_db.pool.guid == poll_guid
