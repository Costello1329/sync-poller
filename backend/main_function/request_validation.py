from .response_processing import get_reject_response
from jsonschema import validate, ValidationError
from manage_service.models import UserGuid
from . import sessions_storage
# from .sessions_storage import session_exists


def validate_request(schema):
    def request_dec(func):
        def request_handler(self, request):
            request_data = request.data
            try:
                validate(instance=request_data, schema=schema)
                # TODO: Create another decorator.
                # if request.data.get("session") is not None:
                #     if not validate_session(request.data.get("session")):
                #         return get_response_reject(request.data.get("session"))
                return func(self, request)
            except ValidationError:
                return get_reject_response()
        return request_handler
    return request_dec


def validate_poll(poll_guid: str, session_guid: str):
    user_guid = sessions_storage.get_user(session_guid)
    user_guid_db = UserGuid.objects.filter(guid=user_guid)
    if not user_guid_db:
        return False
    user_guid_db = user_guid_db[0]
    return user_guid_db.poll.guid == poll_guid
