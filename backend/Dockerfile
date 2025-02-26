# ==========================
# Base stage
# ==========================
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS base

# Install the project into `/app`
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

# Then, add the rest of the project source code and install it
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# ==========================
# Development stage
# ==========================
FROM base AS development

# Reset the entrypoint, don't invoke `uv`
ENTRYPOINT []

# Run the FastAPI application by default
# --reload option that is useful during development
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ==========================
# Production stage
# ==========================
FROM base AS production

# Create necessary directories
RUN mkdir -p /app/public/static

# Copy static files
COPY public/ntc-templates-info.json /app/public/

# Install the project's dependencies without development dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Reset the entrypoint, don't invoke `uv`
ENTRYPOINT []

# Run the FastAPI application by default
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

