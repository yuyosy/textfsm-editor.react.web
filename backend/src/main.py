from fastapi import FastAPI, HTTPException, status
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

from src.parse import parse_text
from src.api_types import (
    TextFSMParseAPIRequest,
    TextFSMParseAPIError,
    TextFSMParseAPIResponse,
    TextFSMParseInput,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello_world():
    return {"message": "OK", "datetime": datetime.now().isoformat()}


@app.post("/parse", response_model=TextFSMParseAPIResponse)
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
