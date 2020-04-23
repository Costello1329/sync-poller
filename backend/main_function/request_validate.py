from jsonschema import validate, ValidationError

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
