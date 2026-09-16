from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session, joinedload

from app.models.catalog import Category, Product, ProductVariant
from app.models.offer import Inventory, Offer, Price, PriceHistory
from app.models.store import Store
from app.schemas.product import OfferCompareRead
from app.schemas.store import StoreRead
from app.services.pricing import compute_discount_percent, compute_final_price, derive_stock_status, slugify


class NotFoundError(Exception):
    pass


class PermissionError_(Exception):
    pass


def _unique_slug(db: Session, title: str) -> str:
    base = slugify(title)
    slug = base
    n = 1
    while db.query(Product).filter(Product.slug == slug).first():
        n += 1
        slug = f"{base}-{n}"
    return slug


def list_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.name.asc()).all()


def create_category(db: Session, name: str, parent_id: Optional[int] = None) -> Category:
    category = Category(name=name, slug=slugify(name), parent_id=parent_id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_product(db: Session, product_id: int) -> Product:
    product = (
        db.query(Product)
        .options(
            joinedload(Product.variants),
            joinedload(Product.offers).joinedload(Offer.store),
            joinedload(Product.offers).joinedload(Offer.price),
            joinedload(Product.offers).joinedload(Offer.inventory),
        )
        .filter(Product.id == product_id)
        .first()
    )
    if product is None:
        raise NotFoundError("Product not found")
    return product


def list_products(db: Session, skip: int = 0, limit: int = 50, category_id: Optional[int] = None) -> list[Product]:
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    return query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()


def serialize_offer(offer: Offer) -> OfferCompareRead | None:
    if offer.price is None or offer.inventory is None or offer.store is None:
        return None
    price: Price = offer.price
    inventory: Inventory = offer.inventory
    final_price = compute_final_price(price.sale_price, price.delivery_cost)
    return OfferCompareRead(
        offer_id=offer.id,
        store=StoreRead.model_validate(offer.store),
        variant_id=offer.variant_id,
        title=offer.title,
        list_price=price.list_price,
        sale_price=price.sale_price,
        discount_percent=price.discount_percent,
        delivery_cost=price.delivery_cost,
        final_price=final_price,
        currency=price.currency,
        stock_status=inventory.stock_status,
        quantity=inventory.quantity,
        buy_now_url=offer.product_url,
        is_active=offer.is_active,
    )


def compare_offers_for_product(db: Session, product_id: int, in_stock_only: bool = False) -> list[OfferCompareRead]:
    product = get_product(db, product_id)
    compared: list[OfferCompareRead] = []
    for offer in product.offers:
        if not offer.is_active:
            continue
        item = serialize_offer(offer)
        if item is None:
            continue
        if in_stock_only and item.quantity <= 0:
            continue
        compared.append(item)
    compared.sort(key=lambda offer: offer.final_price)
    return compared


def record_price_history(db: Session, offer: Offer) -> None:
    if offer.price is None:
        return
    final_price = compute_final_price(offer.price.sale_price, offer.price.delivery_cost)
    db.add(
        PriceHistory(
            offer_id=offer.id,
            list_price=offer.price.list_price,
            sale_price=offer.price.sale_price,
            delivery_cost=offer.price.delivery_cost,
            final_price=final_price,
            currency=offer.price.currency,
        )
    )


def upsert_listing_price(
    db: Session,
    offer: Offer,
    list_price: Decimal,
    sale_price: Decimal,
    delivery_cost: Optional[Decimal],
    currency: str = "INR",
) -> None:
    discount = compute_discount_percent(list_price, sale_price)
    if offer.price is None:
        offer.price = Price(
            list_price=list_price,
            sale_price=sale_price,
            discount_percent=discount,
            delivery_cost=delivery_cost,
            currency=currency,
        )
        db.add(offer.price)
    else:
        offer.price.list_price = list_price
        offer.price.sale_price = sale_price
        offer.price.discount_percent = discount
        offer.price.delivery_cost = delivery_cost
        offer.price.currency = currency
    record_price_history(db, offer)


def create_shopkeeper_product(db: Session, owner_id: int, payload) -> Product:
    store = db.get(Store, payload.store_id)
    if store is None or store.owner_id != owner_id:
        raise PermissionError_("You can only add products to your own store")
    product = Product(
        title=payload.title,
        slug=_unique_slug(db, payload.title),
        brand=payload.brand,
        description=payload.description,
        category_id=payload.category_id,
        image_url=payload.image_url,
        upc=payload.upc,
        created_by_store_id=store.id,
    )
    variant = ProductVariant(sku=payload.sku, title=payload.title, attributes=payload.variant_attributes)
    offer = Offer(
        store_id=store.id,
        seller_sku=payload.sku,
        title=payload.title,
        product_url=payload.product_url,
    )
    inventory = Inventory(
        quantity=payload.quantity,
        stock_status=derive_stock_status(payload.quantity),
    )
    product.variants.append(variant)
    offer.variant = variant
    offer.inventory = inventory
    product.offers.append(offer)
    db.add(product)
    db.flush()
    upsert_listing_price(db, offer, payload.list_price, payload.sale_price, payload.delivery_cost)
    db.commit()
    return get_product(db, product.id)


def update_shopkeeper_product(db: Session, owner_id: int, product_id: int, payload) -> Product:
    product = get_product(db, product_id)
    owned_offers = [offer for offer in product.offers if offer.store and offer.store.owner_id == owner_id]
    if not owned_offers:
        raise PermissionError_("You do not own an offer for this product")
    for field in ("title", "brand", "description", "category_id", "image_url"):
        value = getattr(payload, field)
        if value is not None:
            setattr(product, field, value)
    offer = owned_offers[0]
    if payload.product_url:
        offer.product_url = payload.product_url
    if payload.list_price or payload.sale_price or payload.delivery_cost is not None:
        list_price = payload.list_price or offer.price.list_price
        sale_price = payload.sale_price or offer.price.sale_price
        delivery_cost = offer.price.delivery_cost if payload.delivery_cost is None else payload.delivery_cost
        upsert_listing_price(db, offer, list_price, sale_price, delivery_cost)
    db.commit()
    return get_product(db, product.id)


def update_inventory(db: Session, owner_id: int, inventory_id: int, payload) -> Inventory:
    inventory = db.get(Inventory, inventory_id)
    if inventory is None:
        raise NotFoundError("Inventory not found")
    if inventory.offer.store.owner_id != owner_id:
        raise PermissionError_("You can only update your own inventory")
    if payload.quantity is not None:
        inventory.quantity = payload.quantity
        inventory.stock_status = derive_stock_status(payload.quantity, payload.stock_status)
    elif payload.stock_status is not None:
        inventory.stock_status = payload.stock_status.value
    db.commit()
    db.refresh(inventory)
    return inventory
