from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: int
    filename: str
    file_type: str
    status: str
    created_at: datetime


class GenerateActionRequest(BaseModel):
    action: Literal["summary", "quiz"]


class GeneratedContentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    document_id: int
    action_type: str
    content: str
    created_at: datetime
