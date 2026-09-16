"""Authorized retailer provider package. No scraping implementations."""

from app.providers.base import NormalizedOffer, ProviderRegistry, RetailerProvider

registry = ProviderRegistry()

__all__ = ["NormalizedOffer", "ProviderRegistry", "RetailerProvider", "registry"]
