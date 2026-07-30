import os
from functools import lru_cache
from pathlib import Path


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self) -> None:
        self.mode: str = os.getenv("MODE", "development")

        # Path settings
        self.public_dir: Path = Path(os.getenv("PUBLIC_DIR", "./public"))
        self.static_dir: Path = Path(
            os.getenv("STATIC_DIR", f"{self.public_dir}/static")
        )
        self.assets_dir: Path = Path(
            os.getenv("ASSETS_DIR", f"{self.static_dir}/assets")
        )

        # Security settings
        # Default to false for local Python backend usage
        # Set ENABLE_HTTPS_REDIRECT=true for production with reverse proxy (e.g., nginx)
        self.enable_https_redirect: bool = (
            os.getenv("ENABLE_HTTPS_REDIRECT", "false").lower() == "true"
        )
        self.allowed_hosts: list[str] = os.getenv(
            "ALLOWED_HOSTS", "localhost:5173,localhost:8000,localhost"
        ).split(",")
        self.cors_origins: list[str] = os.getenv(
            "CORS_ALLOWED_ORIGINS", "http://localhost:5173"
        ).split(",")

        # API limits
        self.max_template_length: int = int(os.getenv("MAX_TEMPLATE_LENGTH", "10000"))
        self.max_data_length: int = int(os.getenv("MAX_DATA_LENGTH", "100000"))

        # Logging settings
        self.log_level: str = os.getenv("LOG_LEVEL", "INFO").upper()
        self.log_format: str = os.getenv(
            "LOG_FORMAT",
            "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
        )
        self.log_date_format: str = os.getenv("LOG_DATE_FORMAT", "%Y-%m-%d %H:%M:%S")

        # API documentation settings
        self.docs_enabled: bool = (
            os.getenv("DOCS_ENABLED", "true").lower() == "true"
        )

        # Application metadata
        self.app_title: str = "TextFSM Editor API"
        self.app_version: str = "1.1.0"
        self.app_description: str = "API for parsing text using TextFSM templates"

    @property
    def is_development(self) -> bool:
        return self.mode == "development"

    @property
    def is_production(self) -> bool:
        return self.mode == "production"

    def validate_paths(self) -> list[str]:
        """Validate that required directories exist. Returns list of warnings."""
        warnings: list[str] = []
        if not self.public_dir.exists():
            warnings.append(f"Public directory does not exist: {self.public_dir}")
        return warnings


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
