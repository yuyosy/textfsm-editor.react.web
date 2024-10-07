from pydantic import BaseModel
from typing import List


class ParseResult(BaseModel):
    message: str
    headers: List[str]
    results: List[object]


class APIError(BaseModel):
    status: str
    code: int
    reason: str
    message: str


class APIResponseData(BaseModel):
    parse_result: ParseResult


class APIResponse(BaseModel):
    ok: bool
    status: str
    code: int
    data: APIResponseData
    errors: List[APIError]
