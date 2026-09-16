from decimal import Decimal
from typing import Optional

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import FulfillmentType, OrderStatus


class Order(BaseModel):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), index=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id", ondelete="RESTRICT"), index=True)
    status: Mapped[str] = mapped_column(String(32), default=OrderStatus.PENDING.value, index=True)
    fulfillment_type: Mapped[str] = mapped_column(String(32), default=FulfillmentType.PICKUP.value)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    delivery_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)

    customer = relationship("User", back_populates="orders")
    store = relationship("Store", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(BaseModel):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="RESTRICT"), index=True)
    offer_id: Mapped[int] = mapped_column(ForeignKey("offers.id", ondelete="RESTRICT"), index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    delivery_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    line_total: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
    offer = relationship("Offer")
