# API Specification & Endpoints (Design Draft)

## Base URL
`/api`

## Core Endpoints Overview

### Health & Diagnostics
- `GET /api/health`: Service readiness status.

### Products & Search (Planned)
- `GET /api/products/search?q={query}`: Search canonical product catalog.
- `GET /api/products/{id}`: Detailed product info with aggregated retailer offers.
- `GET /api/products/{id}/price-history`: Historical price points for trend graphing.

### Retailers (Planned)
- `GET /api/retailers`: List active integrated retailers.
- `GET /api/offers/{id}/redirect`: Outbound affiliate link handler redirecting to retailer product URL.
