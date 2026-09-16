from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.engagement import WishlistCreate, WishlistRead
from app.services.engagement_service import add_wishlist_item, list_wishlist, remove_wishlist_item
from app.services.product_service import NotFoundError

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=list[WishlistRead])
def get_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return list_wishlist(db, current_user.id)


@router.post("", response_model=WishlistRead, status_code=201)
def post_wishlist(
    payload: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return add_wishlist_item(db, current_user.id, payload.product_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.delete("/{product_id}", status_code=204)
def delete_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        remove_wishlist_item(db, current_user.id, product_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
