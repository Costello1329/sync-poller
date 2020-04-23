from jsonschema import validate, ValidationError
from .http_response import get_response_error,ResponseErrorType


def validate_request(schema):
    def request_dec(func):
        def request_handler(self, request):
            request_data = request.data
            try:
                validate(instance=request_data, schema=schema)
                return func(self, request)
            except ValidationError:
                try:
                    session_guid = request.COOKIES["session"]
                except KeyError:
                    session_guid = None
                return get_response_error(ResponseErrorType.Contract,400)
        return request_handler

    return request_dec
