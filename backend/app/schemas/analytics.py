from pydantic import BaseModel


class AdminReport(BaseModel):
    user_count: int
    store_count: int
    product_count: int
    offer_count: int
    order_count: int
    active_alert_count: int
    average_offer_price: float | None = None


class ShopkeeperAnalytics(BaseModel):
    store_id: int
    store_name: str
    offer_count: int
    order_count: int
    units_sold: int
    revenue: float
    average_sale_price: float | None = None
    low_stock_count: int
