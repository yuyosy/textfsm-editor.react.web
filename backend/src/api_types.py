from typing import Any, Optional

from pydantic import BaseModel


class TextFSMParseInput(BaseModel):
    template_string: str
    data_string: str


class TextFSMParseResult(BaseModel):
    message: str
    header: list[str]
    results: list[dict[str, Any]]


class TextFSMParseError(BaseModel):
    reason: str
    message: str


class TextFSMParseRequestData(BaseModel):
    template_string: str
    data_string: str


class TextFSMParseAPIRequest(BaseModel):
    data: TextFSMParseRequestData


class TextFSMParseAPIError(BaseModel):
    status: str
    reason: str
    message: str


class TextFSMParseAPIResponse(BaseModel):
    ok: bool
    status: str
    code: int
    data: Optional[TextFSMParseResult] = None
    errors: Optional[list[TextFSMParseAPIError]] = None


class TemplateInfo(BaseModel):
    template: str
    hostname: str
    platform: str
    command_raw: str
    command_regex: str
