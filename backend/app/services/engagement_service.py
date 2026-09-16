from sqlalchemy.orm import Session

from app.models.engagement import PriceAlert, WishlistItem
from app.models.catalog import Product
from app.services.price_service import current_best_price
from app.services.product_service import NotFoundError


def add_wishlist_item(db: Session, user_id: int, product_id: int) -> WishlistItem:
    if db.get(Product, product_id) is None:
        raise NotFoundError("Product not found")
    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id)
        .first()
    )
    if existing:
        return existing
    item = WishlistItem(user_id=user_id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_wishlist_item(db: Session, user_id: int, product_id: int) -> None:
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id)
        .first()
    )
    if item is None:
        raise NotFoundError("Wishlist item not found")
    db.delete(item)
    db.commit()


def list_wishlist(db: Session, user_id: int) -> list[WishlistItem]:
    return db.query(WishlistItem).filter(WishlistItem.user_id == user_id).all()


def create_alert(db: Session, user_id: int, product_id: int, target_price, currency: str) -> PriceAlert:
    if db.get(Product, product_id) is None:
        raise NotFoundError("Product not found")
    existing = (
        db.query(PriceAlert)
        .filter(PriceAlert.user_id == user_id, PriceAlert.product_id == product_id)
        .first()
    )
    if existing:
        existing.target_price = target_price
        existing.currency = currency
        existing.is_active = True
        db.commit()
        db.refresh(existing)
        return existing
    alert = PriceAlert(
        user_id=user_id,
        product_id=product_id,
        target_price=target_price,
        currency=currency,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def list_alerts(db: Session, user_id: int) -> list[dict]:
    alerts = db.query(PriceAlert).filter(PriceAlert.user_id == user_id).all()
    results = []
    for alert in alerts:
        best = current_best_price(db, alert.product_id)
        current = best.final_price if best else None
        results.append(
            {
                "id": alert.id,
                "product_id": alert.product_id,
                "user_id": alert.user_id,
                "target_price": alert.target_price,
                "currency": alert.currency,
                "is_active": alert.is_active,
                "is_triggered": bool(current is not None and current <= alert.target_price),
                "current_best_price": current,
            }
        )
    return results
