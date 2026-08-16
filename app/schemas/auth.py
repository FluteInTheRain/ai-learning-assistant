import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import TrackPreference


class SignupRequest(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    password: str = Field(min_length=10, max_length=72)
    track_preference: TrackPreference

    @field_validator("full_name", mode="before")
    @classmethod
    def strip_full_name(cls, value: str) -> str:
        return value.strip() if isinstance(value, str) else value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserOut(BaseModel):
    id: uuid.UUID
    full_name: str
    email: EmailStr
    track_preference: TrackPreference
    created_at: datetime

    model_config = {"from_attributes": True}


class SignupResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"
