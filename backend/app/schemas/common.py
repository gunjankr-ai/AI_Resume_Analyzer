from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")

class ResponseEnvelope(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[Any] = None
