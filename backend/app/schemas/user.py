from datetime import datetime
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import UserRole

T = TypeVar("T")


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    message: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=32)
    address: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.CUSTOMER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(ORMModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str]
    role: UserRole
    is_active: bool
    address: Optional[str]
    created_at: datetime


class UserUpdateAdmin(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None
    full_name: Optional[str] = None


class AuthResponse(TokenResponse):
    user: UserRead
