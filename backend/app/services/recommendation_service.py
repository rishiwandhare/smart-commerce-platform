from sqlalchemy.orm import Session

from app.models.catalog import Product
from app.services.comparison_service import summarize_product


def recommend_products(db: Session, product_id: int, limit: int = 5) -> list:
    product = db.get(Product, product_id)
    if product is None:
        return []
    query = db.query(Product).filter(Product.id != product_id)
    if product.category_id:
        query = query.filter(Product.category_id == product.category_id)
    elif product.brand:
        query = query.filter(Product.brand == product.brand)
    products = query.limit(limit).all()
    return [summarize_product(item) for item in products]
