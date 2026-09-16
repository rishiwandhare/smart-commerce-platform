"""Alembic metadata import surface for all ORM tables."""

from app.database.connection import Base
from app.models import (  # noqa: F401
    Category,
    Inventory,
    Offer,
    Order,
    OrderItem,
    Price,
    PriceAlert,
    PriceHistory,
    Product,
    ProductMatch,
    ProductVariant,
    Store,
    User,
    WishlistItem,
)

__all__ = ["Base"]
