# Database Data Model Documentation

## Entity Relationship Overview

The PostgreSQL database follows a 3NF normalized schema designed for high-throughput lookups and temporal price tracking.

### Tables

1. **`retailers`**: Registered stores/platforms with credentials and domain configs.
2. **`categories`**: Taxonomy tree allowing multi-level product categorisation.
3. **`products`**: Master canonical catalog entries resulting from deduplication/matching.
4. **`product_offers`**: Real-time listings per retailer (1-to-many relationship with `products` and `retailers`). Contains live price, stock status, and outbound URLs.
5. **`price_history`**: Time-series log of historical prices linked to each `product_offer`.
