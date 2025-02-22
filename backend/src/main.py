import os
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from src.api import router as api_router

mode = os.getenv("MODE", "development")
# Define paths for static files
public_dir = Path(os.getenv("PUBLIC_DIR", "./public"))
static_dir = Path(os.getenv("STATIC_DIR", f"{public_dir}/static"))
assets_dir = Path(os.getenv("ASSETS_DIR", f"{static_dir}/assets"))

# Retrieve allowed hosts and CORS origins from environment variables
allowed_hosts = os.getenv("ALLOWED_HOSTS", "localhost:5173").split(",")
cors_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")

print(mode)

# Root
app = FastAPI()

# Add TrustedHostMiddleware in production only to avoid "Invalid host header" error in development
if mode != "development" and "*" not in allowed_hosts:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

if mode != "development":
    from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

    app.add_middleware(HTTPSRedirectMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000, compresslevel=5)

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
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Index file not found."},
        )


app.include_router(api_router, prefix="/api")
