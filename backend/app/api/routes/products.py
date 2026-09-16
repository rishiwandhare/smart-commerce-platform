from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.product import (
    CategoryCreate,
    CategoryRead,
    OfferCompareRead,
    PriceHistoryPoint,
    ProductDetail,
    ProductSummary,
)
from app.services.comparison_service import summarize_product
from app.services.price_service import list_price_history
from app.services.product_service import (
    NotFoundError,
    compare_offers_for_product,
    create_category,
    get_product,
    list_categories,
    list_products,
)
from app.services.recommendation_service import recommend_products

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[ProductSummary])
def get_products(
    skip: int = 0,
    limit: int = Query(default=50, le=100),
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return [summarize_product(product) for product in list_products(db, skip, limit, category_id)]


@router.get("/categories", response_model=list[CategoryRead])
def get_categories(db: Session = Depends(get_db)):
    return list_categories(db)


@router.post("/categories", response_model=CategoryRead, status_code=201)
def post_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, payload.name, payload.parent_id)


@router.get("/{product_id}", response_model=ProductDetail)
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    try:
        product = get_product(db, product_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    offers = compare_offers_for_product(db, product_id)
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
        offers=offers,
        created_at=product.created_at,
    )


@router.get("/{product_id}/offers", response_model=list[OfferCompareRead])
def get_product_offers(product_id: int, db: Session = Depends(get_db)):
    try:
        return compare_offers_for_product(db, product_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get("/{product_id}/price-history", response_model=list[PriceHistoryPoint])
def get_product_price_history(
    product_id: int,
    offer_id: Optional[int] = None,
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


@router.get("/{product_id}/recommendations", response_model=list[ProductSummary])
def get_recommendations(product_id: int, db: Session = Depends(get_db)):
    return recommend_products(db, product_id)
