from decimal import Decimal
from math import asin, cos, radians, sin, sqrt
from typing import Optional

from sqlalchemy.orm import Session, joinedload

from app.models.store import Store
from app.services.pricing import slugify


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * radius * asin(sqrt(a))


def create_store(db: Session, owner_id: int, data: dict) -> Store:
    base_slug = slugify(data["name"])
    slug = base_slug
    suffix = 1
    while db.query(Store).filter(Store.slug == slug).first():
        suffix += 1
        slug = f"{base_slug}-{suffix}"
    store = Store(owner_id=owner_id, slug=slug, **data)
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


def list_stores(db: Session, active_only: bool = True) -> list[Store]:
    query = db.query(Store)
    if active_only:
        query = query.filter(Store.is_active.is_(True))
    return query.order_by(Store.name.asc()).all()


def nearby_stores(
    db: Session,
    latitude: float,
    longitude: float,
    radius_km: float = 15.0,
) -> list[tuple[Store, float]]:
    stores = (
        db.query(Store)
        .filter(
            Store.is_active.is_(True),
            Store.latitude.isnot(None),
            Store.longitude.isnot(None),
        )
        .all()
    )
    ranked: list[tuple[Store, float]] = []
    for store in stores:
        distance = haversine_km(latitude, longitude, store.latitude, store.longitude)
        if distance <= radius_km:
            ranked.append((store, round(distance, 2)))
    ranked.sort(key=lambda item: item[1])
    return ranked


def get_store(db: Session, store_id: int) -> Optional[Store]:
    return db.get(Store, store_id)
