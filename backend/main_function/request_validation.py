from jsonschema import validate, ValidationError
from .response_processing import get_reject_response


def validate_request(schema):
    def request_dec(func):
        def request_handler(self, request):
            request_data = request.data
            try:
                validate(instance=request_data, schema=schema)
                return func(self, request)
            except ValidationError:
                return get_reject_response
        return request_handler
    return request_dec
