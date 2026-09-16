import re
from decimal import Decimal
from typing import Optional

from sqlalchemy import func

from app.models.enums import StockStatus
from app.models.offer import Inventory, Offer, Price


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "item"


def compute_discount_percent(list_price: Decimal, sale_price: Decimal) -> Optional[Decimal]:
    if list_price <= 0 or sale_price >= list_price:
        return Decimal("0.00")
    return ((list_price - sale_price) / list_price * Decimal("100")).quantize(Decimal("0.01"))


def compute_final_price(sale_price: Decimal, delivery_cost: Optional[Decimal]) -> Decimal:
    extra = delivery_cost if delivery_cost is not None else Decimal("0.00")
    return (sale_price + extra).quantize(Decimal("0.01"))


def derive_stock_status(quantity: int, requested: Optional[StockStatus] = None) -> str:
    if requested:
        return requested.value
    if quantity <= 0:
        return StockStatus.OUT_OF_STOCK.value
    if quantity <= 5:
        return StockStatus.LOW_STOCK.value
    return StockStatus.IN_STOCK.value


def ilike(column, term: str):
    return func.lower(column).like(f"%{term.lower()}%")


def offer_is_purchasable(offer: Offer) -> bool:
    inventory: Inventory | None = offer.inventory
    if not offer.is_active or offer.price is None or inventory is None:
        return False
    return inventory.stock_status != StockStatus.OUT_OF_STOCK.value and inventory.quantity > 0
