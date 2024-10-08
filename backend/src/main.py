from fastapi import FastAPI
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

from src.parse import ParseInput, parse_text
from src.api_types import APIRequest, APIError, APIResponse

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


@app.post("/parse", response_model=APIResponse)
async def parse(request: APIRequest):
    result = parse_text(
        ParseInput(
            template_string=request.data.template_string,
            data_string=request.data.data_string,
        )
    )

    if result.is_ok() and result.value:
        return APIResponse(
            ok=True,
            status="OK",
            code=200,
            data=result.value,
        )
    elif result.is_err() and result.error:
        return APIResponse(
            ok=False,
            status="Bad Request",
            code=400,
            errors=[
                APIError(
                    status="ParseError",
                    reason=result.error.reason,
                    message=result.error.message,
                )
            ],
        )
