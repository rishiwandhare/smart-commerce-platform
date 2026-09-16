from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import StockStatus


class Offer(BaseModel):
    __tablename__ = "offers"
    __table_args__ = (UniqueConstraint("store_id", "seller_sku", name="uq_store_seller_sku"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    variant_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("product_variants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id", ondelete="CASCADE"), index=True)
    seller_sku: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    product_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False, index=True)

    product = relationship("Product", back_populates="offers")
    variant = relationship("ProductVariant", back_populates="offers")
    store = relationship("Store", back_populates="offers")
    price = relationship("Price", back_populates="offer", uselist=False, cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="offer", uselist=False, cascade="all, delete-orphan")
    history = relationship("PriceHistory", back_populates="offer", cascade="all, delete-orphan")


class Price(BaseModel):
    __tablename__ = "prices"
    __table_args__ = (UniqueConstraint("offer_id", name="uq_price_offer"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    offer_id: Mapped[int] = mapped_column(ForeignKey("offers.id", ondelete="CASCADE"), index=True)
    list_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    sale_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    discount_percent: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    delivery_cost: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)

    offer = relationship("Offer", back_populates="price")


class PriceHistory(BaseModel):
    __tablename__ = "price_history"

    id: Mapped[int] = mapped_column(primary_key=True)
    offer_id: Mapped[int] = mapped_column(ForeignKey("offers.id", ondelete="CASCADE"), index=True)
    list_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    sale_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    delivery_cost: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    final_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    offer = relationship("Offer", back_populates="history")


class Inventory(BaseModel):
    __tablename__ = "inventory"
    __table_args__ = (UniqueConstraint("offer_id", name="uq_inventory_offer"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    offer_id: Mapped[int] = mapped_column(ForeignKey("offers.id", ondelete="CASCADE"), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    stock_status: Mapped[str] = mapped_column(String(32), default=StockStatus.IN_STOCK.value, index=True)

    offer = relationship("Offer", back_populates="inventory")
