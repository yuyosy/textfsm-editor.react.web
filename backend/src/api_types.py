from pydantic import BaseModel, field_validator, validator
from typing import Any, List
from pydantic import BaseModel
from typing import List, Optional


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
    errors: Optional[List[TextFSMParseAPIError]] = None
