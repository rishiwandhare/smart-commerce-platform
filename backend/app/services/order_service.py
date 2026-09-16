from decimal import Decimal

from sqlalchemy.orm import Session, joinedload

from app.models.enums import FulfillmentType, OrderStatus, StockStatus
from app.models.offer import Offer
from app.models.order import Order, OrderItem
from app.models.store import Store
from app.schemas.engagement import OrderCreate
from app.services.pricing import compute_final_price, offer_is_purchasable
from app.services.product_service import NotFoundError, PermissionError_


def create_order(db: Session, customer_id: int, payload: OrderCreate) -> Order:
    store = db.get(Store, payload.store_id)
    if store is None or not store.is_active:
        raise NotFoundError("Store not found")
    subtotal = Decimal("0.00")
    delivery_total = Decimal("0.00")
    items: list[OrderItem] = []
    for line in payload.items:
        offer = (
            db.query(Offer)
            .options(joinedload(Offer.price), joinedload(Offer.inventory), joinedload(Offer.store))
            .filter(Offer.id == line.offer_id)
            .first()
        )
        if offer is None or offer.store_id != store.id:
            raise NotFoundError("Offer not found for this store")
        if not offer_is_purchasable(offer):
            raise PermissionError_("Offer is not currently available")
        if offer.inventory.quantity < line.quantity:
            raise PermissionError_("Insufficient stock")
        unit_price = offer.price.sale_price
        delivery = offer.price.delivery_cost or Decimal("0.00")
        if payload.fulfillment_type == FulfillmentType.PICKUP:
            delivery = Decimal("0.00")
        line_total = (unit_price * line.quantity) + delivery
        subtotal += unit_price * line.quantity
        delivery_total += delivery
        offer.inventory.quantity -= line.quantity
        if offer.inventory.quantity <= 0:
            offer.inventory.stock_status = StockStatus.OUT_OF_STOCK.value
        items.append(
            OrderItem(
                product_id=offer.product_id,
                offer_id=offer.id,
                quantity=line.quantity,
                unit_price=unit_price,
                delivery_cost=delivery,
                line_total=line_total,
            )
        )
    order = Order(
        customer_id=customer_id,
        store_id=store.id,
        fulfillment_type=payload.fulfillment_type.value,
        notes=payload.notes,
        subtotal=subtotal,
        delivery_cost=delivery_total,
        total=subtotal + delivery_total,
        currency="INR",
        items=items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order.id)
        .first()
    )


def list_customer_orders(db: Session, customer_id: int) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.customer_id == customer_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def list_store_orders(db: Session, owner_id: int) -> list[Order]:
    return (
        db.query(Order)
        .join(Store, Store.id == Order.store_id)
        .options(joinedload(Order.items))
        .filter(Store.owner_id == owner_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def update_order_status(db: Session, owner_id: int, order_id: int, status: OrderStatus) -> Order:
    order = (
        db.query(Order)
        .join(Store, Store.id == Order.store_id)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id, Store.owner_id == owner_id)
        .first()
    )
    if order is None:
        raise NotFoundError("Order not found")
    order.status = status.value
    db.commit()
    db.refresh(order)
    return order
