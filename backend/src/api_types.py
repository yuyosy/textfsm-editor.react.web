from pydantic import BaseModel
from typing import List
from pydantic import BaseModel
from typing import List, Optional

from src.parse import ParseResult


class RequestData(BaseModel):
    template_string: str
    data_string: str


class APIRequest(BaseModel):
    data: RequestData


class APIError(BaseModel):
    status: str
    reason: str
    message: str


class APIResponse(BaseModel):
    ok: bool
    status: str
    code: int
    data: Optional[ParseResult] = None
    errors: Optional[List[APIError]] = None
