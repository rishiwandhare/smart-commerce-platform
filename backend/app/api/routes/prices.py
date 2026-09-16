from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.product import OfferCompareRead, PriceHistoryPoint
from app.services.price_service import list_price_history
from app.services.product_service import NotFoundError, compare_offers_for_product

router = APIRouter(prefix="/prices", tags=["Prices"])


@router.get("/compare/{product_id}", response_model=list[OfferCompareRead])
def compare_prices(product_id: int, db: Session = Depends(get_db)):
    try:
        return compare_offers_for_product(db, product_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get("/history/{product_id}", response_model=list[PriceHistoryPoint])
def price_history(
    product_id: int,
    offer_id: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
):
    try:
        rows = list_price_history(db, product_id, offer_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    return [
        PriceHistoryPoint(
            offer_id=row.offer_id,
            sale_price=row.sale_price,
            delivery_cost=row.delivery_cost,
            final_price=row.final_price,
            currency=row.currency,
            recorded_at=row.recorded_at,
        )
        for row in rows
    ]
