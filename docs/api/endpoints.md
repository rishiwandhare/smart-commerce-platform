# API Specification

Base URL: `/api`

Interactive docs: `/docs`

Authenticated routes expect `Authorization: Bearer <jwt>`.

## Health
- `GET /api/health`
- `GET /api/health/db`

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Products
- `GET /api/products`
- `GET /api/products/categories`
- `POST /api/products/categories`
- `GET /api/products/{id}`
- `GET /api/products/{id}/offers`
- `GET /api/products/{id}/price-history`
- `GET /api/products/{id}/recommendations`

## Search & prices
- `GET /api/search?q=`
- `GET /api/prices/compare/{product_id}`
- `GET /api/prices/history/{product_id}`

Offer payloads include `sale_price`, `delivery_cost`, `final_price`, `stock_status`, `quantity`, and `buy_now_url`. Offers are sorted by computed `final_price` (sale + delivery when present). No seller is hard-coded as cheapest.

## Stores
- `GET /api/stores`
- `GET /api/stores/nearby?lat=&lng=&radius_km=`
- `GET /api/stores/{id}`
- `POST /api/stores` (shopkeeper/admin)

## Customer
- `GET|POST /api/wishlist`
- `DELETE /api/wishlist/{product_id}`
- `GET|POST /api/alerts`
- `GET|POST /api/orders`

## Shopkeeper
- `POST|GET /api/shopkeeper/stores`
- `POST /api/shopkeeper/products`
- `PUT /api/shopkeeper/products/{id}`
- `PUT /api/shopkeeper/inventory/{id}`
- `GET /api/shopkeeper/orders`
- `PUT /api/shopkeeper/orders/{id}`
- `GET /api/shopkeeper/analytics`

## Admin
- `GET /api/admin/users`
- `PATCH /api/admin/users/{id}`
- `GET /api/admin/stores`
- `PATCH /api/admin/stores/{id}`
- `GET /api/admin/products`
- `GET /api/admin/offers`
- `GET /api/admin/reports`
