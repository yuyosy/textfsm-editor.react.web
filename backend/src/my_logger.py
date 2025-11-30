import logging
import sys

from src.config import get_settings


def setup_logger(name: str = "textfsm-editor-backend") -> logging.Logger:
    """Configure and return the application logger using settings from config."""
    logger = logging.getLogger(name)

    # Avoid adding handlers multiple times
    if logger.handlers:
        return logger

    settings = get_settings()

    # Set log level from settings
    logger.setLevel(getattr(logging, settings.log_level, logging.INFO))

    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)

    # Create formatter using settings
    formatter = logging.Formatter(
        fmt=settings.log_format,
        datefmt=settings.log_date_format,
    )
    handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(handler)

    return logger


logger = setup_logger()
