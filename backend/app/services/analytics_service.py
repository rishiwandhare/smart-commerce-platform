from decimal import Decimal

import pandas as pd
from sqlalchemy.orm import Session

from app.models.enums import StockStatus
from app.models.offer import Inventory, Offer, Price
from app.models.order import Order, OrderItem
from app.models.store import Store
from app.schemas.analytics import ShopkeeperAnalytics
from app.services.product_service import PermissionError_


def shopkeeper_analytics(db: Session, owner_id: int, store_id: int | None = None) -> list[ShopkeeperAnalytics]:
    query = db.query(Store).filter(Store.owner_id == owner_id)
    if store_id:
        query = query.filter(Store.id == store_id)
    stores = query.all()
    if not stores:
        raise PermissionError_("No stores found for this shopkeeper")

    results: list[ShopkeeperAnalytics] = []
    for store in stores:
        offers = db.query(Offer).filter(Offer.store_id == store.id).all()
        offer_ids = [offer.id for offer in offers]
        prices = db.query(Price).filter(Price.offer_id.in_(offer_ids)).all() if offer_ids else []
        inventories = db.query(Inventory).filter(Inventory.offer_id.in_(offer_ids)).all() if offer_ids else []
        orders = db.query(Order).filter(Order.store_id == store.id).all()
        items = (
            db.query(OrderItem).join(Order, Order.id == OrderItem.order_id).filter(Order.store_id == store.id).all()
        )

        price_df = pd.DataFrame([{"sale_price": float(row.sale_price)} for row in prices])
        item_df = pd.DataFrame(
            [{"quantity": row.quantity, "line_total": float(row.line_total)} for row in items]
        )
        inv_df = pd.DataFrame([{"stock_status": row.stock_status} for row in inventories])

        revenue = float(item_df["line_total"].sum()) if not item_df.empty else 0.0
        units = int(item_df["quantity"].sum()) if not item_df.empty else 0
        avg_price = float(price_df["sale_price"].mean()) if not price_df.empty else None
        low_stock = (
            int((inv_df["stock_status"] == StockStatus.LOW_STOCK.value).sum()) if not inv_df.empty else 0
        )
        results.append(
            ShopkeeperAnalytics(
                store_id=store.id,
                store_name=store.name,
                offer_count=len(offers),
                order_count=len(orders),
                units_sold=units,
                revenue=round(revenue, 2),
                average_sale_price=round(avg_price, 2) if avg_price is not None else None,
                low_stock_count=low_stock,
            )
        )
    return results
