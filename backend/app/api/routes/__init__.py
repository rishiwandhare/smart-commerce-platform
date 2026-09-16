from fastapi import APIRouter

from app.api.routes import (
    admin,
    alerts,
    auth,
    health,
    orders,
    prices,
    products,
    search,
    shopkeeper,
    stores,
    wishlist,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(search.router)
api_router.include_router(prices.router)
api_router.include_router(stores.router)
api_router.include_router(wishlist.router)
api_router.include_router(alerts.router)
api_router.include_router(orders.router)
api_router.include_router(shopkeeper.router)
api_router.include_router(admin.router)
