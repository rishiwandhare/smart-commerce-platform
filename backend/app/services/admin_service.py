from sqlalchemy.orm import Session, joinedload

from app.models.catalog import Product
from app.models.engagement import PriceAlert
from app.models.offer import Offer, Price
from app.models.order import Order
from app.models.store import Store
from app.models.user import User
from app.schemas.analytics import AdminReport
from app.services.product_service import NotFoundError


def list_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.created_at.desc()).all()


def update_user(db: Session, user_id: int, **fields) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise NotFoundError("User not found")
    for key, value in fields.items():
        if value is not None:
            setattr(user, key, value.value if hasattr(value, "value") else value)
    db.commit()
    db.refresh(user)
    return user


def list_offers(db: Session) -> list[Offer]:
    return (
        db.query(Offer)
        .options(joinedload(Offer.store), joinedload(Offer.price), joinedload(Offer.inventory))
        .order_by(Offer.updated_at.desc())
        .all()
    )


def admin_report(db: Session) -> AdminReport:
    prices = db.query(Price.sale_price).all()
    avg = float(sum(row[0] for row in prices) / len(prices)) if prices else None
    return AdminReport(
        user_count=db.query(User).count(),
        store_count=db.query(Store).count(),
        product_count=db.query(Product).count(),
        offer_count=db.query(Offer).count(),
        order_count=db.query(Order).count(),
        active_alert_count=db.query(PriceAlert).filter(PriceAlert.is_active.is_(True)).count(),
        average_offer_price=round(avg, 2) if avg is not None else None,
    )
