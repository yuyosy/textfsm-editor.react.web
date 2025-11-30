from io import StringIO

from textfsm import TextFSM, TextFSMError, TextFSMTemplateError

from src.api_types import TextFSMParseError, TextFSMParseInput, TextFSMParseResult
from src.result import Err, Ok, Result


def parse_text(
    input_data: TextFSMParseInput,
) -> Result[TextFSMParseResult, TextFSMParseError]:
    try:
        template_io = StringIO(input_data.template_string)
        fsm = TextFSM(template_io)
        results = fsm.ParseTextToDicts(input_data.data_string)
        header: list[str] = fsm.header
        return Ok(
            TextFSMParseResult(message="Success!", header=header, results=results)
        )
    except (TextFSMError, TextFSMTemplateError) as e:
        return Err(TextFSMParseError(reason=type(e).__name__, message=str(e)))
