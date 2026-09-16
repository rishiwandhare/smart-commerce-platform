# System Architecture Overview

## Objective
The Price Comparator Platform is an AI-enhanced e-commerce price comparison system that aggregates product offerings from permitted retailer feeds and APIs, matches identical products across different retailer catalogs, tracks price trends, and provides outbound redirection to retailer offer pages.

## Architectural Layers

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
│       - Product Search UI                              │
│       - Real-time Price Comparisons & Offer Cards      │
│       - Outbound Retailer Referral Handling            │
└─────────────────────────┬──────────────────────────────┘
                          │ REST API
┌─────────────────────────▼──────────────────────────────┐
│                  Backend (Python FastAPI)              │
│       - Search & Comparison REST Endpoints             │
│       - Catalog & Offer Query Services                 │
│       - Feed Ingestion & Scraper Pipeline              │
└─────────────────┬───────────────────┬──────────────────┘
                  │                   │
         SQLAlchemy / asyncpg       Data Transfer / Features
                  │                   │
┌─────────────────▼────────┐ ┌────────▼──────────────────┐
│   Database (PostgreSQL)  │ │      AI / Data Pipeline   │
│  - Retailers             │ │  - Product Matching (NLP) │
│  - Canonical Products    │ │  - Price Forecasting     │
│  - Product Offers        │ │  - Pandas ETL Pipelines   │
│  - Price History         │ │                           │
└──────────────────────────┘ └───────────────────────────┘
```

## Security & Permitted Data Gathering
- Data ingestion is restricted to permitted retailer APIs, licensed feeds, and compliance-checked endpoints.
- Authentication and rate-limiting modules will be added in subsequent phases.
