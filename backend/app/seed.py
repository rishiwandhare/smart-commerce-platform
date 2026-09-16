from decimal import Decimal
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.database.connection import SessionLocal
from app.models.catalog import Category, Product, ProductMatch, ProductVariant
from app.models.enums import StockStatus, UserRole
from app.models.offer import Inventory, Offer, Price, PriceHistory
from app.models.store import Store
from app.models.user import User
from app.services.pricing import compute_discount_percent, compute_final_price, slugify


def _get_or_create_user(db: Session, email: str, password: str, full_name: str, role: UserRole) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        role=role.value,
        is_active=True,
    )
    db.add(user)
    db.flush()
    return user


def _get_or_create_category(db: Session, name: str, parent: Category | None = None) -> Category:
    slug = slugify(name)
    category = db.query(Category).filter(Category.slug == slug).first()
    if category:
        return category
    category = Category(name=name, slug=slug, parent_id=parent.id if parent else None)
    db.add(category)
    db.flush()
    return category


def _get_or_create_store(db: Session, owner: User, **kwargs) -> Store:
    slug = slugify(kwargs["name"])
    store = db.query(Store).filter(Store.slug == slug).first()
    if store:
        return store
    store = Store(owner_id=owner.id, slug=slug, **kwargs)
    db.add(store)
    db.flush()
    return store


def _add_listing(
    db: Session,
    product: Product,
    store: Store,
    sku: str,
    url: str,
    list_price: Decimal,
    sale_price: Decimal,
    delivery_cost: Decimal | None,
    quantity: int,
    history_points: list[Decimal],
) -> Offer:
    existing = db.query(Offer).filter(Offer.store_id == store.id, Offer.seller_sku == sku).first()
    if existing:
        return existing
    variant = ProductVariant(product_id=product.id, sku=sku, title=product.title, attributes={"seller": store.name})
    offer = Offer(
        product_id=product.id,
        store_id=store.id,
        seller_sku=sku,
        title=f"{product.title} at {store.name}",
        product_url=url,
        currency="INR",
        is_active=True,
        variant=variant,
    )
    stock = StockStatus.OUT_OF_STOCK.value if quantity <= 0 else (
        StockStatus.LOW_STOCK.value if quantity <= 5 else StockStatus.IN_STOCK.value
    )
    offer.inventory = Inventory(quantity=quantity, stock_status=stock)
    offer.price = Price(
        list_price=list_price,
        sale_price=sale_price,
        discount_percent=compute_discount_percent(list_price, sale_price),
        delivery_cost=delivery_cost,
        currency="INR",
    )
    db.add(offer)
    db.flush()
    now = datetime.now(timezone.utc)
    for index, historical in enumerate(history_points):
        db.add(
            PriceHistory(
                offer_id=offer.id,
                list_price=list_price,
                sale_price=historical,
                delivery_cost=delivery_cost,
                final_price=compute_final_price(historical, delivery_cost),
                currency="INR",
                recorded_at=now - timedelta(days=len(history_points) - index),
            )
        )
    db.add(
        PriceHistory(
            offer_id=offer.id,
            list_price=list_price,
            sale_price=sale_price,
            delivery_cost=delivery_cost,
            final_price=compute_final_price(sale_price, delivery_cost),
            currency="INR",
        )
    )
    return offer


def seed_database(db: Session | None = None) -> None:
    owns_session = db is None
    db = db or SessionLocal()
    try:
        admin = _get_or_create_user(
            db, settings.SEED_ADMIN_EMAIL, settings.SEED_ADMIN_PASSWORD, "Platform Admin", UserRole.ADMIN
        )
        shopkeeper = _get_or_create_user(
            db,
            settings.SEED_SHOPKEEPER_EMAIL,
            settings.SEED_SHOPKEEPER_PASSWORD,
            "Local Shopkeeper",
            UserRole.SHOPKEEPER,
        )
        _get_or_create_user(
            db, settings.SEED_CUSTOMER_EMAIL, settings.SEED_CUSTOMER_PASSWORD, "Sample Customer", UserRole.CUSTOMER
        )

        electronics = _get_or_create_category(db, "Electronics")
        phones = _get_or_create_category(db, "Smartphones", electronics)
        audio = _get_or_create_category(db, "Audio", electronics)

        city_mart = _get_or_create_store(
            db,
            shopkeeper,
            name="City Mart Electronics",
            description="Neighborhood electronics store with pickup counter",
            domain="citymart.local",
            phone="9800000001",
            address="12 MG Road",
            city="Bengaluru",
            latitude=12.9716,
            longitude=77.5946,
            is_online=False,
        )
        pixel_hub = _get_or_create_store(
            db,
            shopkeeper,
            name="Pixel Hub Online",
            description="Authorized local marketplace seller",
            domain="pixelhub.local",
            phone="9800000002",
            address="88 Indiranagar",
            city="Bengaluru",
            latitude=12.9784,
            longitude=77.6408,
            is_online=True,
        )
        value_store = _get_or_create_store(
            db,
            admin,
            name="Value Store",
            description="Budget electronics retailer",
            domain="valuestore.local",
            phone="9800000003",
            address="5 Koramangala",
            city="Bengaluru",
            latitude=12.9352,
            longitude=77.6245,
            is_online=True,
        )

        phone = db.query(Product).filter(Product.slug == "nova-phone-15").first()
        if phone is None:
            phone = Product(
                title="Nova Phone 15 128GB",
                slug="nova-phone-15",
                brand="Nova",
                model_number="NP15-128",
                upc="8901234567890",
                description="Flagship smartphone used for local price comparison demos.",
                category_id=phones.id,
                image_url="https://example.local/images/nova-phone-15.png",
            )
            db.add(phone)
            db.flush()

        buds = db.query(Product).filter(Product.slug == "pulse-buds-pro").first()
        if buds is None:
            buds = Product(
                title="Pulse Buds Pro",
                slug="pulse-buds-pro",
                brand="Pulse",
                model_number="PBP-01",
                description="Wireless earbuds with ANC.",
                category_id=audio.id,
                image_url="https://example.local/images/pulse-buds.png",
            )
            db.add(buds)
            db.flush()

        _add_listing(
            db,
            phone,
            city_mart,
            "CM-NP15",
            "https://citymart.local/products/nova-phone-15",
            Decimal("79999.00"),
            Decimal("74999.00"),
            Decimal("0.00"),
            8,
            [Decimal("77999.00"), Decimal("76999.00"), Decimal("75999.00")],
        )
        _add_listing(
            db,
            phone,
            pixel_hub,
            "PH-NP15",
            "https://pixelhub.local/p/nova-phone-15",
            Decimal("79999.00"),
            Decimal("73990.00"),
            Decimal("149.00"),
            15,
            [Decimal("75990.00"), Decimal("74990.00"), Decimal("74490.00")],
        )
        _add_listing(
            db,
            phone,
            value_store,
            "VS-NP15",
            "https://valuestore.local/nova-phone-15",
            Decimal("78999.00"),
            Decimal("72999.00"),
            Decimal("199.00"),
            3,
            [Decimal("74999.00"), Decimal("73999.00")],
        )
        _add_listing(
            db,
            buds,
            city_mart,
            "CM-PBP",
            "https://citymart.local/products/pulse-buds-pro",
            Decimal("12999.00"),
            Decimal("10999.00"),
            Decimal("0.00"),
            20,
            [Decimal("11999.00"), Decimal("11499.00")],
        )
        _add_listing(
            db,
            buds,
            pixel_hub,
            "PH-PBP",
            "https://pixelhub.local/p/pulse-buds-pro",
            Decimal("12999.00"),
            Decimal("9999.00"),
            Decimal("79.00"),
            0,
            [Decimal("10999.00"), Decimal("10499.00")],
        )

        existing_match = (
            db.query(ProductMatch)
            .filter(
                ProductMatch.canonical_product_id == phone.id,
                ProductMatch.matched_product_id == phone.id,
            )
            .first()
        )
        if existing_match is None:
            db.add(
                ProductMatch(
                    canonical_product_id=phone.id,
                    matched_product_id=phone.id,
                    confidence=1.0,
                    source="seed",
                )
            )
        db.commit()
    finally:
        if owns_session:
            db.close()


if __name__ == "__main__":
    seed_database()
    print("Seed data loaded.")
