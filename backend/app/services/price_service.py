from sqlalchemy.orm import Session

from app.models.offer import Offer, PriceHistory
from app.services.product_service import NotFoundError, compare_offers_for_product


def list_price_history(db: Session, product_id: int, offer_id: int | None = None) -> list[PriceHistory]:
    query = (
        db.query(PriceHistory)
        .join(Offer, Offer.id == PriceHistory.offer_id)
        .filter(Offer.product_id == product_id)
        .order_by(PriceHistory.recorded_at.asc())
    )
    if offer_id:
        query = query.filter(PriceHistory.offer_id == offer_id)
    rows = query.all()
    if not rows and db.get(Offer, offer_id) is None and offer_id:
        raise NotFoundError("Offer not found")
    return rows


def current_best_price(db: Session, product_id: int):
    offers = compare_offers_for_product(db, product_id, in_stock_only=True)
    if not offers:
        offers = compare_offers_for_product(db, product_id)
    return offers[0] if offers else None
