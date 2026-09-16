# Price Comparator Backend

FastAPI service for product search, multi-seller price comparison, local store pickup orders, shopkeeper catalog management, and admin reporting.

Buy Now is a redirect to `buy_now_url` on each offer. This service does not scrape retailers; `app/providers/base.py` is the extension point for permitted APIs and affiliate feeds.

## Setup

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # or cp .env.example .env
```

Start PostgreSQL (Docker example):

```bash
docker compose -f ../deployment/docker-compose.yml up -d database
```

Apply schema and sample data:

```bash
alembic upgrade head
python -m app.seed
```

Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

- Swagger UI: http://localhost:8000/docs
- Health: http://localhost:8000/api/health
- DB check: http://localhost:8000/api/health/db

## Tests

```bash
pytest -q
```

Tests use an isolated in-memory SQLite database and do not require PostgreSQL.

## Environment variables

See `.env.example`. Required for a real run:

- `DATABASE_URL`
- `SECRET_KEY`
- `BACKEND_CORS_ORIGINS`

## Frontend

Point the React app at `VITE_API_BASE_URL=http://localhost:8000/api`. Send `Authorization: Bearer <access_token>` on protected routes. CORS is enabled for `http://localhost:5173` and `http://localhost:3000`.
