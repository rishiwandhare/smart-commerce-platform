from datetime import datetime
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator

from app.models.enums import StockStatus
from app.schemas.store import StoreRead
from app.schemas.user import ORMModel


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    parent_id: Optional[int] = None


class CategoryRead(ORMModel):
    id: int
    name: str
    slug: str
    parent_id: Optional[int]
    created_at: datetime


class VariantRead(ORMModel):
    id: int
    sku: str
    title: Optional[str]
    attributes: Optional[dict[str, Any]]
    upc: Optional[str]


class ProductCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    brand: Optional[str] = None
    model_number: Optional[str] = None
    upc: Optional[str] = None
    ean: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    brand: Optional[str] = None
    model_number: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None


class ProductSummary(ORMModel):
    id: int
    title: str
    slug: str
    brand: Optional[str]
    image_url: Optional[str]
    category_id: Optional[int]
    lowest_final_price: Optional[Decimal] = None
    offer_count: int = 0


class OfferCompareRead(ORMModel):
    offer_id: int
    store: StoreRead
    variant_id: Optional[int] = None
    title: str
    list_price: Decimal
    sale_price: Decimal
    discount_percent: Optional[Decimal]
    delivery_cost: Optional[Decimal]
    final_price: Decimal
    currency: str
    stock_status: StockStatus
    quantity: int
    buy_now_url: str
    is_active: bool


class ProductDetail(ORMModel):
    id: int
    title: str
    slug: str
    brand: Optional[str]
    model_number: Optional[str]
    upc: Optional[str]
    ean: Optional[str]
    description: Optional[str]
    category_id: Optional[int]
    image_url: Optional[str]
    variants: list[VariantRead] = []
    offers: list[OfferCompareRead] = []
    created_at: datetime


class ComparisonResult(BaseModel):
    query: Optional[str] = None
    products: list[ProductSummary]
    selected_product: Optional[ProductDetail] = None
    compared_offers: list[OfferCompareRead] = []


class PriceHistoryPoint(ORMModel):
    offer_id: int
    sale_price: Decimal
    delivery_cost: Optional[Decimal]
    final_price: Decimal
    currency: str
    recorded_at: datetime


class ShopkeeperProductCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    store_id: int
    brand: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    upc: Optional[str] = None
    sku: str = Field(min_length=1, max_length=128)
    product_url: str = Field(min_length=1)
    list_price: Decimal = Field(gt=0)
    sale_price: Decimal = Field(gt=0)
    delivery_cost: Optional[Decimal] = Field(default=None, ge=0)
    quantity: int = Field(ge=0)
    variant_attributes: Optional[dict[str, Any]] = None

    @field_validator("sale_price")
    @classmethod
    def sale_not_above_list(cls, value: Decimal, info):  # type: ignore[no-untyped-def]
        list_price = info.data.get("list_price")
        if list_price is not None and value > list_price:
            raise ValueError("sale_price cannot exceed list_price")
        return value


class ShopkeeperProductUpdate(BaseModel):
    title: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    product_url: Optional[str] = None
    list_price: Optional[Decimal] = Field(default=None, gt=0)
    sale_price: Optional[Decimal] = Field(default=None, gt=0)
    delivery_cost: Optional[Decimal] = Field(default=None, ge=0)


class InventoryUpdate(BaseModel):
    quantity: Optional[int] = Field(default=None, ge=0)
    stock_status: Optional[StockStatus] = None
