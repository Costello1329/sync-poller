from enum import Enum

from rest_framework.response import Response

k_cookie_expiration_time = 2 * 7 * 24 * 60 * 60  # (2 weeks in seconds)


class ResponseErrorType(Enum):
    Contract = "contract"
    Validation = "validation"
    Internal = "internal"


def get_response_error_string_by_type(error_type):
    if error_type == ResponseErrorType.Contract:
        return "contract"

    if error_type == ResponseErrorType.Validation:
        return "validation"

    if error_type == ResponseErrorType.Internal:
        return "internal"


def setup_cors_response_headers(res):
    res["Access-Control-Allow-Origin"] = "http://127.0.0.1:1329"
    res["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    res["Access-Control-Allow-Headers"] = \
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    res["Access-Control-Allow-Credentials"] = "true"
    return res


def get_response_success(body, session_guid):
    res = setup_cors_response_headers(Response(body, status=200, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=k_cookie_expiration_time)

    return res


def get_response_reject(session_guid):
    res = setup_cors_response_headers(Response(status=401, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value="", expires=0)

    return res


def get_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(body, status=status_code, content_type="application/json"))
