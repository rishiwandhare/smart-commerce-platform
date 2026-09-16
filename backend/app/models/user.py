from typing import Optional

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import UserRole


class User(BaseModel):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    role: Mapped[str] = mapped_column(String(32), default=UserRole.CUSTOMER.value, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    stores = relationship("Store", back_populates="owner")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("PriceAlert", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="customer")
