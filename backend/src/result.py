from typing import Generic, Optional, TypeVar


T = TypeVar("T")
E = TypeVar("E")


class Result(Generic[T, E]):
    @property
    def value(self) -> Optional[T]:
        raise NotImplementedError("Subclasses should implement this!")

    @property
    def error(self) -> Optional[E]:
        raise NotImplementedError("Subclasses should implement this!")

    def is_ok(self) -> bool:
        raise NotImplementedError

    def is_err(self) -> bool:
        raise NotImplementedError


class Ok(Result[T, E]):
    def __init__(self, value: T):
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


class Err(Result[T, E]):
    def __init__(self, error: E):
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
