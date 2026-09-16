from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.models.catalog import Product
from app.models.offer import Offer
from app.schemas.product import ComparisonResult, ProductDetail, ProductSummary
from app.services.pricing import compute_final_price, ilike
from app.services.product_service import compare_offers_for_product


def search_products(db: Session, query: str, limit: int = 20) -> list[Product]:
    term = query.strip()
    if not term:
        return []
    return (
        db.query(Product)
        .options(
            joinedload(Product.variants),
            joinedload(Product.offers).joinedload(Offer.price),
            joinedload(Product.offers).joinedload(Offer.inventory),
            joinedload(Product.offers).joinedload(Offer.store),
        )
        .filter(
            or_(
                ilike(Product.title, term),
                ilike(Product.brand, term),
                ilike(Product.description, term),
                ilike(Product.model_number, term),
            )
        )
        .limit(limit)
        .all()
    )


def summarize_product(product: Product) -> ProductSummary:
    finals = []
    active_offers = 0
    for offer in product.offers:
        if not offer.is_active or offer.price is None:
            continue
        active_offers += 1
        finals.append(compute_final_price(offer.price.sale_price, offer.price.delivery_cost))
    return ProductSummary(
        id=product.id,
        title=product.title,
        slug=product.slug,
        brand=product.brand,
        image_url=product.image_url,
        category_id=product.category_id,
        lowest_final_price=min(finals) if finals else None,
        offer_count=active_offers,
    )


def compare_search(db: Session, query: str, product_id: int | None = None) -> ComparisonResult:
    products = search_products(db, query) if query else []
    summaries = [summarize_product(product) for product in products]
    selected = None
    compared = []
    target_id = product_id
    if target_id is None and products:
        target_id = products[0].id
    if target_id:
        compared = compare_offers_for_product(db, target_id)
        product = next((item for item in products if item.id == target_id), None)
        if product is None:
            from app.services.product_service import get_product

            product = get_product(db, target_id)
        selected = ProductDetail(
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
            offers=compared,
            created_at=product.created_at,
        )
    return ComparisonResult(
        query=query,
        products=summaries,
        selected_product=selected,
        compared_offers=compared,
    )
