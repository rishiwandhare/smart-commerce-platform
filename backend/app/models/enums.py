from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "customer"
    SHOPKEEPER = "shopkeeper"
    ADMIN = "admin"


class StockStatus(str, Enum):
    IN_STOCK = "in_stock"
    LOW_STOCK = "low_stock"
    OUT_OF_STOCK = "out_of_stock"
    PREORDER = "preorder"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    READY_FOR_PICKUP = "ready_for_pickup"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class FulfillmentType(str, Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"
