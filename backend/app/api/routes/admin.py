from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import require_roles
from app.database.connection import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.analytics import AdminReport
from app.schemas.product import OfferCompareRead, ProductSummary
from app.schemas.store import StoreRead, StoreUpdate
from app.schemas.user import UserRead, UserUpdateAdmin
from app.services.admin_service import admin_report, list_offers, list_users, update_user
from app.services.comparison_service import summarize_product
from app.services.product_service import NotFoundError, list_products, serialize_offer
from app.services.store_service import get_store, list_stores

router = APIRouter(prefix="/admin", tags=["Admin"])
admin_only = require_roles(UserRole.ADMIN)


@router.get("/users", response_model=list[UserRead])
def get_users(db: Session = Depends(get_db), _: User = Depends(admin_only)):
    return list_users(db)


@router.patch("/users/{user_id}", response_model=UserRead)
def patch_user(
    user_id: int,
    payload: UserUpdateAdmin,
    db: Session = Depends(get_db),
    _: User = Depends(admin_only),
):
    try:
        return update_user(db, user_id, **payload.model_dump(exclude_unset=True))
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get("/stores", response_model=list[StoreRead])
def get_admin_stores(db: Session = Depends(get_db), _: User = Depends(admin_only)):
    return list_stores(db, active_only=False)


@router.patch("/stores/{store_id}", response_model=StoreRead)
def patch_store(
    store_id: int,
    payload: StoreUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(admin_only),
):
    store = get_store(db, store_id)
    if store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(store, key, value)
    db.commit()
    db.refresh(store)
    return store


@router.get("/products", response_model=list[ProductSummary])
def get_admin_products(db: Session = Depends(get_db), _: User = Depends(admin_only)):
    return [summarize_product(product) for product in list_products(db, limit=200)]


@router.get("/offers", response_model=list[OfferCompareRead])
def get_admin_offers(db: Session = Depends(get_db), _: User = Depends(admin_only)):
    results = []
    for offer in list_offers(db):
        item = serialize_offer(offer)
        if item:
            results.append(item)
    return results


@router.get("/reports", response_model=AdminReport)
def get_reports(db: Session = Depends(get_db), _: User = Depends(admin_only)):
    return admin_report(db)
