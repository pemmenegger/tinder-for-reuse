from typing import Generic, List, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SearchResponse(BaseModel, Generic[T]):
    results: List[T]
