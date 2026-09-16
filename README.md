# Price Comparator Platform (`smart-commerce-platform`)

A production-ready e-commerce price comparison platform that enables users to search for products, aggregates listings from permitted retailer APIs and feeds, matches equivalent products using AI/ML entity resolution, compares real-time prices, and seamlessly redirects shoppers to official retailer offer pages.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Backend** | Python 3.11 + FastAPI + Pydantic |
| **Database** | PostgreSQL 15 + SQLAlchemy |
| **Data Processing** | Python + Pandas |
| **AI / ML** | Python (Deduplication, Price Forecasting, Recommenders) |
| **API Protocol** | REST (JSON) |
| **Containerization** | Docker & Docker Compose |

---

## Directory Structure

```text
smart-commerce-platform/
├── frontend/                     # React + Vite client web application
│   ├── public/                   # Static assets and favicons
│   └── src/
│       ├── assets/               # Media, styling tokens, and images
│       ├── components/           # Reusable UI component library
│       ├── context/              # React Context state management
│       ├── hooks/                # Custom React lifecycle/data hooks
│       ├── pages/                # Route views (Search, Compare, Product Detail)
│       ├── services/             # Backend API client integrations
│       ├── utils/                # Frontend helper utilities
│       ├── App.jsx               # Main application component
│       ├── App.css               # App-level styling
│       ├── index.css             # Global typography and theme tokens
│       └── main.jsx              # React DOM entrypoint
│   ├── index.html                # Web root document
│   ├── package.json              # NPM dependencies & scripts
│   └── vite.config.js            # Vite bundler configuration
├── backend/                      # Python FastAPI REST backend
│   ├── app/
│   │   ├── api/                  # API routers & endpoint definitions
│   │   │   └── routes/           # Versioned endpoint modules (e.g., health)
│   │   ├── core/                 # App configuration & environment settings
│   │   ├── database/             # SQLAlchemy engine & session factory
│   │   ├── models/               # SQLAlchemy ORM database models
│   │   ├── schemas/              # Pydantic request/response validation
│   │   ├── scrapers/             # Ingestion pipelines for permitted feeds
│   │   ├── services/             # Core business & aggregation services
│   │   └── main.py               # FastAPI application entrypoint
│   ├── tests/                    # Backend unit & endpoint tests
│   └── requirements.txt          # Python pip dependencies
├── ai/                           # AI & machine learning modules
│   ├── product_matching/         # Cross-retailer entity resolution & deduplication
│   ├── price_prediction/         # Price trend analysis & forecasting
│   └── recommendation/           # Alternative product and offer recommendations
├── data/                         # Data pipeline storage (ETL stages)
│   ├── raw/                      # Unprocessed partner feeds / API snapshots
│   ├── processed/                # Normalized, validated datasets
│   └── product_data/             # Catalog caches and taxonomies
├── database/                     # Relational database definitions
│   ├── schema.sql                # PostgreSQL DDL table definitions & indexes
│   └── seed.sql                  # Initial database seeding script
├── tests/                        # System-wide test suites
│   ├── integration/              # Multi-component workflow tests
│   └── e2e/                      # Browser-level end-to-end test specifications
├── docs/                         # Architecture, API, and DB documentation
│   ├── architecture/             # High-level architecture and system design
│   ├── api/                      # REST API endpoint specifications
│   └── database/                 # ERD and relational data model guides
├── deployment/                   # Containerization & orchestration
│   ├── Dockerfile                # Backend container image build
│   ├── Dockerfile.frontend       # Frontend production image build (Nginx)
│   ├── docker-compose.yml        # Multi-service local/production stack
│   └── .dockerignore             # Docker build context exclusions
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git tracking ignore rules
├── LICENSE                       # MIT License
└── README.md                     # Project documentation
```

---

## Getting Started

### 1. Environment Configuration
Copy the sample environment variables:
```bash
cp .env.example .env
```

### 2. Running with Docker Compose (Recommended)
Launch the database, FastAPI backend, and React frontend concurrently:
```bash
docker compose -f deployment/docker-compose.yml up --build
```
- Frontend: `http://localhost:80` (or `http://localhost:5173` in local dev mode)
- Backend API: `http://localhost:8000`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`

### 3. Local Development Setup

#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Project Roadmap & Guidelines
1. **Permitted Ingestion Only**: Scrapers and feeds must only target legally permitted partner APIs and authorized data sources.
2. **Product Matching**: AI pipelines resolve disparate retailer listings to single master canonical items via UPC/EAN matching and title NLP similarity.
3. **Price Comparison & Outbound Redirection**: Clean redirection preserving retailer referrers.
