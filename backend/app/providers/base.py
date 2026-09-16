from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class NormalizedOffer(BaseModel):
    """Canonical offer payload returned by any authorized retailer provider."""

    external_id: str
    title: str
    brand: Optional[str] = None
    upc: Optional[str] = None
    ean: Optional[str] = None
    product_url: str
    list_price: Decimal
    sale_price: Decimal
    delivery_cost: Optional[Decimal] = None
    currency: str = "INR"
    quantity: int = 0
    store_name: str
    image_url: Optional[str] = None
    raw_payload: dict = Field(default_factory=dict)


class RetailerProvider(ABC):
    """
    Interface for future permitted retailer APIs, affiliate feeds, or partner catalogs.

    Implementations must only call authorized data sources. Unauthorized scraping
    is not supported by this architecture.
    """

    name: str

    @abstractmethod
    async def search_products(self, query: str) -> list[NormalizedOffer]:
        raise NotImplementedError

    @abstractmethod
    async def fetch_offer(self, external_id: str) -> Optional[NormalizedOffer]:
        raise NotImplementedError


class ProviderRegistry:
    def __init__(self) -> None:
        self._providers: dict[str, RetailerProvider] = {}

    def register(self, provider: RetailerProvider) -> None:
        self._providers[provider.name] = provider

    def get(self, name: str) -> RetailerProvider:
        return self._providers[name]

    def all(self) -> list[RetailerProvider]:
        return list(self._providers.values())
