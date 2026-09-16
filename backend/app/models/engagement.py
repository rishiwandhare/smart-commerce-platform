from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, ForeignKey, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class WishlistItem(BaseModel):
    __tablename__ = "wishlist"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)

    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product")


class PriceAlert(BaseModel):
    __tablename__ = "price_alerts"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_alert_user_product"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    target_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)

    user = relationship("User", back_populates="alerts")
    product = relationship("Product")
