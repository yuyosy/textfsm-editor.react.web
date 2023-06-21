import json

from response import set_response_data
from textfsm_parse import parse


def lambda_handler(event, context):
    try:
        request_body = json.loads(event["body"])
        response_body = parse(request_body)
    except Exception as e:
        response_body = {
            "ok": False,
            "message": type(e).__name__,
            "message_detail": str(e),
        }

    return set_response_data(response_body)
