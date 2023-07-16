import argparse

import uvicorn
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from backend.textfsm_parse import parse


class Request(BaseModel):
    target_data: str
    template_data: str


# python fastapi_server.py
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--debug", action="store_true")
    args = parser.parse_args()

    app = FastAPI()
    if args.debug:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    @app.get("/server-info")
    async def read_item():
        return vars(args)

    @app.post("/textfsm-parse")
    def textfsm_parse(request: Request):
        try:
            request_body = request.dict()  # type: ignore
            response_body = parse(request_body)
        except Exception as e:
            response_body = {
                "ok": False,
                "message": type(e).__name__,
                "message_detail": str(e),
            }
        content = jsonable_encoder(response_body)
        return JSONResponse(content=content)

    app.mount("/", StaticFiles(directory="public", html=True), name="public")

    uvicorn.run(app)
