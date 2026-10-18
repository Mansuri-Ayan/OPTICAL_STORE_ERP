# Schema: user.py — kept only for login purposes
from pydantic import BaseModel, Field


class UserLogin(BaseModel):
    email: str = Field(
        ...,
        max_length=255,
        examples=["admin@optical.store"],
        description="The admin's registered email address",
    )
    password: str = Field(
        ...,
        min_length=6,
        examples=["Admin@123"],
        description="Plain-text password (will be verified against bcrypt hash)",
    )
    role: str | None = Field(
        default=None,
        description="Optional role filter (e.g. admin, manager, worker, optician)",
    )


class AuthMeResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    store_id: int | None = Field(default=None, description="Assigned store branch ID if staff member")
    store_name: str | None = Field(default=None, description="Store or business name for display")

    model_config = {"from_attributes": True}

