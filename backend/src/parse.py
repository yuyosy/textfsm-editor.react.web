from io import StringIO
from typing import Any
from pydantic import BaseModel
from textfsm import TextFSM

from src.result import Err, Ok, Result


class ParseInput(BaseModel):
    template_string: str
    data_string: str


class ParseResult(BaseModel):
    message: str
    header: list[str]
    results: list[dict[str, Any]]


class ParseError(BaseModel):
    reason: str
    message: str


def parse_text(input_data: ParseInput) -> Result[ParseResult, ParseError]:
    try:
        template_io = StringIO(input_data.template_string)
        fsm = TextFSM(template_io)
        parsed = fsm.ParseText(input_data.data_string)
        header: list[str] = fsm.header
        results = [dict(zip(header, item)) for item in parsed]
        return Ok(ParseResult(message="Success!", header=header, results=results))
    except Exception as e:
        return Err(ParseError(reason=type(e).__name__, message=str(e)))
