from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.product import ComparisonResult
from app.services.comparison_service import compare_search

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=ComparisonResult)
def search(
    q: str = Query(..., min_length=1),
    product_id: int | None = None,
    db: Session = Depends(get_db),
):
    return compare_search(db, q, product_id)
