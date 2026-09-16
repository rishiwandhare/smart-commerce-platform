from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_roles
from app.database.connection import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.store import StoreCreate, StoreRead, StoreUpdate
from app.services.store_service import create_store, get_store, list_stores, nearby_stores

router = APIRouter(prefix="/stores", tags=["Stores"])


@router.get("", response_model=list[StoreRead])
def get_stores(db: Session = Depends(get_db)):
    return list_stores(db)


@router.get("/nearby", response_model=list[StoreRead])
def get_nearby_stores(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(default=15, gt=0, le=100),
    db: Session = Depends(get_db),
):
    rows = nearby_stores(db, lat, lng, radius_km)
    results = []
    for store, distance in rows:
        payload = StoreRead.model_validate(store)
        payload.distance_km = distance
        results.append(payload)
    return results


@router.get("/{store_id}", response_model=StoreRead)
def get_store_detail(store_id: int, db: Session = Depends(get_db)):
    store = get_store(db, store_id)
    if store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.post("", response_model=StoreRead, status_code=201)
def post_store(
    payload: StoreCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    return create_store(db, current_user.id, payload.model_dump())
