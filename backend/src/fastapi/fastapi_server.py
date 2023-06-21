import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from backend.textfsm_parse import parse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Request(BaseModel):
    target_data: str
    template_data: str


@app.post("/textfsm-parse")
def textfsm_parse(request: Request):
    try:
        request_body = request.dict()
        response_body = parse(request_body)
    except Exception as e:
        response_body = {
            "ok": False,
            "message": type(e).__name__,
            "message_detail": str(e),
        }
    content = jsonable_encoder(response_body)
    return JSONResponse(content=content)


# python fastapi_server.py
if __name__ == "__main__":
    uvicorn.run(app)
