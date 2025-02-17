import os
from datetime import datetime
from logging import StreamHandler, getLogger
from pathlib import Path
from typing import Literal

import ntc_templates
from fastapi import APIRouter, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from src.api_types import (
    TemplateInfo,
    TextFSMParseAPIError,
    TextFSMParseAPIRequest,
    TextFSMParseAPIResponse,
    TextFSMParseInput,
)
from src.parse import parse_text

mode = os.getenv("MODE", "development")
# Define paths for static files
public_dir = Path(os.getenv("PUBLIC_DIR", "./public"))
static_dir = Path(os.getenv("STATIC_DIR", f"{public_dir}/static"))
assets_dir = Path(os.getenv("ASSETS_DIR", f"{static_dir}/assets"))


app = FastAPI()
api = APIRouter(prefix="/api")

app.add_middleware(GZipMiddleware, minimum_size=1000, compresslevel=5)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory=static_dir), name="static")
app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.get("/", include_in_schema=False)
async def root():
    if mode == "development":
        return {
            "mode": mode,
            "message": "This Path is the entry point in production mode.",
            "datetime": datetime.now().isoformat(),
        }

    index_file = static_dir.joinpath("index.html")
    if index_file.exists():
        return FileResponse(index_file)
    else:
        JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": f"{static_dir.joinpath("index.html")} is not exist."},
        )


@api.post("/parse", response_model=TextFSMParseAPIResponse)
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


@api.get("/ntc-templates", response_model=list[TemplateInfo])
async def get_ntc_templates():
    try:
        return FileResponse(
            public_dir.joinpath("ntc-templates-info.json"),
            media_type="application/json",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@api.get("/ntc-templates/{template_name}")
async def get_ntc_template(template_name: str):
    try:
        templates_foler_path = Path(ntc_templates.__file__).parent.joinpath("templates")
        template_path = templates_foler_path.joinpath(template_name)
        if not template_path.exists():
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": f"Template not found.",
                    "template_name": template_name,
                },
            )
        return FileResponse(
            template_path,
            media_type="text/plain",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


app.include_router(api)
