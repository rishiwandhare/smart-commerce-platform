# Database Data Model

## Entity relationship overview

```
users 1──* stores
users 1──* wishlist  *──1 products
users 1──* price_alerts *──1 products
users 1──* orders *──1 stores
orders 1──* order_items *──1 offers
categories 1──* products
products 1──* product_variants
products 1──* offers *──1 stores
products 1──* product_matches (canonical ↔ matched)
offers 1──1 prices
offers 1──1 inventory
offers 1──* price_history
```

A canonical **product** can have many **offers** (one per seller/store). Current commercial terms live in **prices**; every price change is appended to **price_history**. **inventory** tracks stock independently of price. **product_matches** links equivalent catalog rows for comparison.

## Tables

| Table | Purpose |
| --- | --- |
| `users` | Customers, shopkeepers, admins (email unique, hashed password, role) |
| `stores` | Physical/online shops with optional lat/lng for nearby search |
| `categories` | Hierarchical taxonomy |
| `products` | Canonical catalog items |
| `product_variants` | SKU/attribute variations |
| `offers` | Seller listings + original product URL (Buy Now) |
| `prices` | Current list/sale/delivery amounts |
| `price_history` | Historical sale/final prices |
| `inventory` | Quantity and stock status per offer |
| `wishlist` | Customer saved products |
| `price_alerts` | Target-price notifications |
| `orders` / `order_items` | Local pickup/delivery orders |
| `product_matches` | Entity-resolution links |

Schema is owned by Alembic (`backend/alembic/versions/001_initial.py`).
