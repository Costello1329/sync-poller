from jsonschema import validate, ValidationError
from rest_framework.response import Response


def send_response(body, schema):
    try:
        validate(instance=body, schema=schema)
    except ValidationError:
        return get_reject_response()
    return get_success_response()


def setup_cors_response_headers(res):
    # TODO: put origin inside the config.
    res["Access-Control-Allow-Origin"] = "http://127.0.0.1:1329"
    res["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    res["Access-Control-Allow-Headers"] = \
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    res["Access-Control-Allow-Credentials"] = "true"
    return res


def get_success_response():
    return setup_cors_response_headers(Response(body, status=200, content_type="application/json"))


def get_error_response(status_code):
    return setup_cors_response_headers(Response(status=status_code, content_type="application/json"))


def get_reject_response():
    return get_error_response(400)


def get_unauthorized_response():
    return get_error_response(401)
