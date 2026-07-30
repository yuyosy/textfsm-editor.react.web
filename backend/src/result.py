from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")
E = TypeVar("E")


class Result(ABC, Generic[T, E]):
    """Abstract base class for Result type (Ok or Err)."""

    @property
    @abstractmethod
    def value(self) -> T | None:
        """Return the success value, or None if this is an Err."""
        ...

    @property
    @abstractmethod
    def error(self) -> E | None:
        """Return the error value, or None if this is an Ok."""
        ...

    @abstractmethod
    def is_ok(self) -> bool:
        """Return True if this is an Ok result."""
        ...

    @abstractmethod
    def is_err(self) -> bool:
        """Return True if this is an Err result."""
        ...


class Ok(Result[T, E]):
    """Represents a successful result containing a value."""

    def __init__(self, value: T) -> None:
        self._value = value

    @property
    def value(self) -> T:
        return self._value

    @property
    def error(self) -> None:
        return None

    def is_ok(self) -> bool:
        return True

    def is_err(self) -> bool:
        return False

    def __repr__(self) -> str:
        return f"Ok({self._value!r})"


class Err(Result[T, E]):
    """Represents a failed result containing an error."""

    def __init__(self, error: E) -> None:
        self._error = error

    @property
    def value(self) -> None:
        return None

    @property
    def error(self) -> E:
        return self._error

    def is_ok(self) -> bool:
        return False

    def is_err(self) -> bool:
        return True

    def __repr__(self) -> str:
        return f"Err({self._error!r})"
