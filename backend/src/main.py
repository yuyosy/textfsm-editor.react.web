import os
import re
from datetime import datetime
from pathlib import Path
from typing import Annotated

import ntc_templates
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.api_types import (
    TemplateInfo,
    TextFSMParseAPIError,
    TextFSMParseAPIRequest,
    TextFSMParseAPIResponse,
    TextFSMParseInput,
)
from src.parse import parse_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_files_dir = os.getenv("STATIC_FILES_DIR", "./static")
if os.path.exists(static_files_dir):
    app.mount("/", StaticFiles(directory=static_files_dir, html=True), name="static")


@app.get("/")
def hello_world():
    return {"message": "OK", "datetime": datetime.now().isoformat()}


@app.post("/api/parse", response_model=TextFSMParseAPIResponse)
async def parse(request: TextFSMParseAPIRequest):
    result = parse_text(
        TextFSMParseInput(
            template_string=request.data.template_string,
            data_string=request.data.data_string,
        )
    )

    if result.is_ok() and result.value:
        return TextFSMParseAPIResponse(
            ok=True,
            status="OK",
            code=status.HTTP_200_OK,
            data=result.value,
        )
    elif result.is_err() and result.error:
        return TextFSMParseAPIResponse(
            ok=False,
            status="Bad Request",
            code=status.HTTP_400_BAD_REQUEST,
            errors=[
                TextFSMParseAPIError(
                    status="ParseError",
                    reason=result.error.reason,
                    message=result.error.message,
                )
            ],
        )
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unknown error"
    )


class FilterParams(BaseModel):
    template: str = Field(default="")
    platform: str = Field(default="")
    command: str = Field(default="")
    condition: str = Field(default="and")


@app.get("/api/ntc-templates", response_model=list[TemplateInfo])
async def get_ntc_templates(query: Annotated[FilterParams, Query()]):
    try:
        ntc_templates_dir = Path(ntc_templates.__file__).parent
        template_dir = ntc_templates_dir.joinpath("templates")
        template_index = template_dir.joinpath("index")
        with template_index.open("r", encoding="utf-8") as f:
            csv_dict_list = csv_to_list(f.read())

        if not any([query.template, query.platform, query.command]):
            return csv_dict_list

        conditions = []
        if query.template:
            conditions.append(lambda item: query.template in item.template)
        if query.platform:
            conditions.append(lambda item: query.platform in item.platform)
        if query.command:
            conditions.append(lambda item: regex_search(item.command, query.command))

        filtered_list = []
        for item in csv_dict_list:
            if query.condition == "and":
                if all(condition(item) for condition in conditions):
                    filtered_list.append(item)
            else:  # "or"
                if any(condition(item) for condition in conditions):
                    filtered_list.append(item)

        return filtered_list

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


def regex_search(regex: str, text: str) -> bool:
    """
    Convert [[...]] to (...)?

    refer to ntc_templates/templates/index
    abc[[xyz]] is expanded to abc(x(y(z)?)?)?
    default regexp inside [[]] is not supported
    """

    def convert_bracket(match):
        chars = match.group(1)
        result = chars[-1]
        for char in reversed(chars[:-1]):
            result = f"{char}({result})?"
        return f"({result})?"

    converted = re.sub(r"\[\[([^\]]+)\]\]", convert_bracket, regex)

    try:
        return bool(re.search(converted, text))
    except re.error:
        return False


def csv_to_list(
    buf: str, header: bool = True, separator: str = ","
) -> list[TemplateInfo]:
    """
    Convert a CSV string to a list of TemplateInfo objects.
    """
    csv_dict_list: list[TemplateInfo] = []
    header_keys: list[str] = []
    for line in buf.splitlines():
        if line.startswith("#"):
            continue
        line = line.strip()
        if not line:
            continue
        if header and not header_keys:
            header_keys = [entry.strip().lower() for entry in line.split(separator)]
        else:
            line_values = [entry.strip().lower() for entry in line.split(separator)]
            csv_dict_list.append(TemplateInfo(**dict(zip(header_keys, line_values))))
    return csv_dict_list
