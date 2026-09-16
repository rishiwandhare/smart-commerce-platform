from datetime import datetime
from typing import Any, Optional

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.database.connection import Base
from app.models.base import BaseModel


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    parent_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    parent = relationship("Category", remote_side=[id], backref="children")
    products = relationship("Product", back_populates="category")


class Product(BaseModel):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(500), unique=True, index=True, nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    model_number: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    upc: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)
    ean: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by_store_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("stores.id", ondelete="SET NULL"),
        nullable=True,
    )

    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="product")
    matches_as_canonical = relationship(
        "ProductMatch",
        foreign_keys="ProductMatch.canonical_product_id",
        back_populates="canonical_product",
    )


class ProductVariant(BaseModel):
    __tablename__ = "product_variants"
    __table_args__ = (UniqueConstraint("product_id", "sku", name="uq_variant_product_sku"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    sku: Mapped[str] = mapped_column(String(128), nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    attributes: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    upc: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    product = relationship("Product", back_populates="variants")
    offers = relationship("Offer", back_populates="variant")


class ProductMatch(BaseModel):
    __tablename__ = "product_matches"
    __table_args__ = (
        UniqueConstraint("canonical_product_id", "matched_product_id", name="uq_product_match_pair"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    canonical_product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        index=True,
    )
    matched_product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        index=True,
    )
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    source: Mapped[str] = mapped_column(String(64), default="manual", nullable=False)

    canonical_product = relationship(
        "Product",
        foreign_keys=[canonical_product_id],
        back_populates="matches_as_canonical",
    )
    matched_product = relationship("Product", foreign_keys=[matched_product_id])
