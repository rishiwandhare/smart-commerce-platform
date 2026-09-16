from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field

from app.models.enums import FulfillmentType, OrderStatus
from app.schemas.user import ORMModel


class WishlistCreate(BaseModel):
    product_id: int


class WishlistRead(ORMModel):
    id: int
    product_id: int
    user_id: int


class AlertCreate(BaseModel):
    product_id: int
    target_price: Decimal = Field(gt=0)
    currency: str = "INR"


class AlertRead(ORMModel):
    id: int
    product_id: int
    user_id: int
    target_price: Decimal
    currency: str
    is_active: bool
    is_triggered: bool = False
    current_best_price: Optional[Decimal] = None


class OrderItemCreate(BaseModel):
    offer_id: int
    quantity: int = Field(ge=1)


class OrderCreate(BaseModel):
    store_id: int
    items: list[OrderItemCreate] = Field(min_length=1)
    fulfillment_type: FulfillmentType = FulfillmentType.PICKUP
    notes: Optional[str] = None


class OrderItemRead(ORMModel):
    id: int
    product_id: int
    offer_id: int
    quantity: int
    unit_price: Decimal
    delivery_cost: Decimal
    line_total: Decimal


class OrderRead(ORMModel):
    id: int
    customer_id: int
    store_id: int
    status: OrderStatus
    fulfillment_type: FulfillmentType
    notes: Optional[str]
    subtotal: Decimal
    delivery_cost: Decimal
    total: Decimal
    currency: str
    items: list[OrderItemRead]


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
