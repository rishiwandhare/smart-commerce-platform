from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import require_roles
from app.database.connection import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.analytics import ShopkeeperAnalytics
from app.schemas.engagement import OrderRead, OrderStatusUpdate
from app.schemas.product import InventoryUpdate, ProductDetail, ShopkeeperProductCreate, ShopkeeperProductUpdate
from app.schemas.store import StoreCreate, StoreRead
from app.services.analytics_service import shopkeeper_analytics
from app.services.order_service import list_store_orders, update_order_status
from app.services.product_service import (
    NotFoundError,
    PermissionError_,
    compare_offers_for_product,
    create_shopkeeper_product,
    get_product,
    update_inventory,
    update_shopkeeper_product,
)
from app.services.store_service import create_store, list_stores

router = APIRouter(prefix="/shopkeeper", tags=["Shopkeeper"])


def _product_detail(db: Session, product) -> ProductDetail:
    return ProductDetail(
        id=product.id,
        title=product.title,
        slug=product.slug,
        brand=product.brand,
        model_number=product.model_number,
        upc=product.upc,
        ean=product.ean,
        description=product.description,
        category_id=product.category_id,
        image_url=product.image_url,
        variants=product.variants,
        offers=compare_offers_for_product(db, product.id),
        created_at=product.created_at,
    )


@router.post("/stores", response_model=StoreRead, status_code=201)
def register_shop(
    payload: StoreCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    return create_store(db, current_user.id, payload.model_dump())


@router.get("/stores", response_model=list[StoreRead])
def my_stores(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    return [store for store in list_stores(db, active_only=False) if store.owner_id == current_user.id]


@router.post("/products", response_model=ProductDetail, status_code=201)
def create_product(
    payload: ShopkeeperProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    try:
        product = create_shopkeeper_product(db, current_user.id, payload)
    except PermissionError_ as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    return _product_detail(db, product)


@router.put("/products/{product_id}", response_model=ProductDetail)
def edit_product(
    product_id: int,
    payload: ShopkeeperProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    try:
        product = update_shopkeeper_product(db, current_user.id, product_id, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except PermissionError_ as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    return _product_detail(db, product)


@router.put("/inventory/{inventory_id}")
def edit_inventory(
    inventory_id: int,
    payload: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    try:
        inventory = update_inventory(db, current_user.id, inventory_id, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except PermissionError_ as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    return {
        "id": inventory.id,
        "offer_id": inventory.offer_id,
        "quantity": inventory.quantity,
        "stock_status": inventory.stock_status,
    }


@router.get("/orders", response_model=list[OrderRead])
def shop_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    return list_store_orders(db, current_user.id)


@router.put("/orders/{order_id}", response_model=OrderRead)
def shop_update_order(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    try:
        return update_order_status(db, current_user.id, order_id, payload.status)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get("/analytics", response_model=list[ShopkeeperAnalytics])
def analytics(
    store_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SHOPKEEPER, UserRole.ADMIN)),
):
    try:
        return shopkeeper_analytics(db, current_user.id, store_id)
    except PermissionError_ as exc:
        raise HTTPException(status_code=404, detail=str(exc))
