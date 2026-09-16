from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl

from app.schemas.user import ORMModel


class StoreCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    domain: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=32)
    address: Optional[str] = None
    city: Optional[str] = Field(default=None, max_length=128)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    is_online: bool = True


class StoreUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_online: Optional[bool] = None
    is_active: Optional[bool] = None


class StoreRead(ORMModel):
    id: int
    owner_id: Optional[int]
    name: str
    slug: str
    description: Optional[str]
    domain: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    city: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    is_online: bool
    is_active: bool
    created_at: datetime
    distance_km: Optional[float] = None
