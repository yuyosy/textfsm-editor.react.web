from io import StringIO

from textfsm import TextFSM


def parse(request_body={}):
    textfsm = None
    ok = False
    message = ""
    message_detail = ""
    headers = []
    results = []

    template_data = request_body.get("template_data", "")
    if template_data:
        pass
        try:
            textfsm = TextFSM(template=StringIO(template_data))
            headers = textfsm.header
        except Exception as e:
            message = type(e).__name__
            message_detail = str(e)

        if textfsm:
            try:
                parsed = textfsm.ParseText(request_body.get("target_data", ""))
                results = [dict(zip(headers, item)) for item in parsed]
                message = "Success!"
                ok = True
            except Exception as e:
                message = type(e).__name__
                message_detail = str(e)

    return {
        "ok": ok,
        "message": message,
        "message_detail": message_detail,
        "headers": headers,
        "results": results,
    }
