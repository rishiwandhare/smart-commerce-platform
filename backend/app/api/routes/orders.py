from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.engagement import OrderCreate, OrderRead
from app.services.order_service import create_order, list_customer_orders
from app.services.product_service import NotFoundError, PermissionError_

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=list[OrderRead])
def get_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return list_customer_orders(db, current_user.id)


@router.post("", response_model=OrderRead, status_code=201)
def post_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_order(db, current_user.id, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except PermissionError_ as exc:
        raise HTTPException(status_code=400, detail=str(exc))
