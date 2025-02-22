import os
from pathlib import Path

import ntc_templates
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse, JSONResponse

from src.api_types import (
    TemplateInfo,
    TextFSMParseAPIError,
    TextFSMParseAPIRequest,
    TextFSMParseAPIResponse,
    TextFSMParseInput,
)
from src.myLogger import myLogger
from src.parse import parse_text

router = APIRouter()


@router.post("/parse", response_model=TextFSMParseAPIResponse)
async def parse(request: TextFSMParseAPIRequest):
    MAX_TEMPLATE_LENGTH = int(os.getenv("MAX_TEMPLATE_LENGTH", "10000"))
    MAX_DATA_LENGTH = int(os.getenv("MAX_DATA_LENGTH", "100000"))
    if (
        len(request.data.template_string) > MAX_TEMPLATE_LENGTH
        or len(request.data.data_string) > MAX_DATA_LENGTH
    ):
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Payload too large",
        )
    try:
        result = parse_text(
            TextFSMParseInput(
                template_string=request.data.template_string,
                data_string=request.data.data_string,
            )
        )
    except Exception as err:
        myLogger.error(f"Error parsing text: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
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
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Internal Server Error",
    )


@router.get("/ntc-templates", response_model=list[TemplateInfo])
async def get_ntc_templates():
    public_dir = Path(os.getenv("PUBLIC_DIR", "./public"))
    try:
        return FileResponse(
            public_dir.joinpath("ntc-templates-info.json"),
            media_type="application/json",
        )
    except Exception as err:
        myLogger.error(f"Error getting NTC templates: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )


@router.get("/ntc-templates/{template_name}")
async def get_ntc_template(template_name: str):
    try:
        base_templates_path = (
            Path(ntc_templates.__file__).parent.joinpath("templates").resolve()
        )
        template_path = base_templates_path.joinpath(template_name).resolve()
        if not str(template_path).startswith(str(base_templates_path)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden path"
            )
        if not template_path.exists():
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": "Template not found.",
                    "template_name": template_name,
                },
            )
        return FileResponse(
            template_path,
            media_type="text/plain",
        )
    except Exception as err:
        myLogger.error(f"Error getting NTC template: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error",
        )
