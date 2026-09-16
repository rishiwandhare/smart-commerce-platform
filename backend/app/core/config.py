from typing import List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    PROJECT_NAME: str = "Price Comparator Platform"
    API_V1_STR: str = "/api"

    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/price_comparator"

    SECRET_KEY: str = "change-me-in-development-only"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    SEED_ON_STARTUP: bool = False
    SEED_ADMIN_EMAIL: str = "admin@local.dev"
    SEED_ADMIN_PASSWORD: str = "AdminPass123!"
    SEED_SHOPKEEPER_EMAIL: str = "shopkeeper@local.dev"
    SEED_SHOPKEEPER_PASSWORD: str = "ShopPass123!"
    SEED_CUSTOMER_EMAIL: str = "customer@local.dev"
    SEED_CUSTOMER_PASSWORD: str = "CustPass123!"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Union[str, List[str]]) -> List[str]:
        if isinstance(value, list):
            return value
        raw = value.strip()
        if raw.startswith("["):
            import json

            parsed = json.loads(raw)
            return [str(item) for item in parsed]
        return [item.strip() for item in raw.split(",") if item.strip()]


settings = Settings()
