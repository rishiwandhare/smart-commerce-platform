"""initial comparison platform schema

Revision ID: 001_initial
Revises:
Create Date: 2026-09-16
"""

from alembic import op
import sqlalchemy as sa

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("role", sa.String(32), nullable=False, server_default="customer"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_role", "users", ["role"])

    op.create_table(
        "stores",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("domain", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("city", sa.String(128), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("is_online", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_stores_owner_id", "stores", ["owner_id"])
    op.create_index("ix_stores_city", "stores", ["city"])
    op.create_index("ix_stores_is_active", "stores", ["is_active"])

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("slug"),
    )

    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("slug", sa.String(500), nullable=False),
        sa.Column("brand", sa.String(255), nullable=True),
        sa.Column("model_number", sa.String(255), nullable=True),
        sa.Column("upc", sa.String(50), nullable=True),
        sa.Column("ean", sa.String(50), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("created_by_store_id", sa.Integer(), sa.ForeignKey("stores.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("slug"),
        sa.UniqueConstraint("upc"),
        sa.UniqueConstraint("ean"),
    )
    op.create_index("ix_products_title", "products", ["title"])
    op.create_index("ix_products_brand", "products", ["brand"])
    op.create_index("ix_products_category_id", "products", ["category_id"])

    op.create_table(
        "product_variants",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sku", sa.String(128), nullable=False),
        sa.Column("title", sa.String(255), nullable=True),
        sa.Column("attributes", sa.JSON(), nullable=True),
        sa.Column("upc", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("product_id", "sku", name="uq_variant_product_sku"),
    )

    op.create_table(
        "product_matches",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("canonical_product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("matched_product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False, server_default="1"),
        sa.Column("source", sa.String(64), nullable=False, server_default="manual"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("canonical_product_id", "matched_product_id", name="uq_product_match_pair"),
    )

    op.create_table(
        "offers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True),
        sa.Column("store_id", sa.Integer(), sa.ForeignKey("stores.id", ondelete="CASCADE"), nullable=False),
        sa.Column("seller_sku", sa.String(255), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("product_url", sa.String(1000), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="INR"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("store_id", "seller_sku", name="uq_store_seller_sku"),
    )
    op.create_index("ix_offers_product_id", "offers", ["product_id"])
    op.create_index("ix_offers_store_id", "offers", ["store_id"])
    op.create_index("ix_offers_is_active", "offers", ["is_active"])

    op.create_table(
        "prices",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("offer_id", sa.Integer(), sa.ForeignKey("offers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("list_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("sale_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("discount_percent", sa.Numeric(5, 2), nullable=True),
        sa.Column("delivery_cost", sa.Numeric(12, 2), nullable=True),
        sa.Column("currency", sa.String(3), nullable=False, server_default="INR"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("offer_id", name="uq_price_offer"),
    )

    op.create_table(
        "price_history",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("offer_id", sa.Integer(), sa.ForeignKey("offers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("list_price", sa.Numeric(12, 2), nullable=True),
        sa.Column("sale_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("delivery_cost", sa.Numeric(12, 2), nullable=True),
        sa.Column("final_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="INR"),
        sa.Column("recorded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_price_history_offer_id", "price_history", ["offer_id"])
    op.create_index("ix_price_history_recorded_at", "price_history", ["recorded_at"])

    op.create_table(
        "inventory",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("offer_id", sa.Integer(), sa.ForeignKey("offers.id", ondelete="CASCADE"), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("stock_status", sa.String(32), nullable=False, server_default="in_stock"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("offer_id", name="uq_inventory_offer"),
    )
    op.create_index("ix_inventory_stock_status", "inventory", ["stock_status"])

    op.create_table(
        "wishlist",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),
    )

    op.create_table(
        "price_alerts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("target_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="INR"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "product_id", name="uq_alert_user_product"),
    )

    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("customer_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("store_id", sa.Integer(), sa.ForeignKey("stores.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="pending"),
        sa.Column("fulfillment_type", sa.String(32), nullable=False, server_default="pickup"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("subtotal", sa.Numeric(12, 2), nullable=False),
        sa.Column("delivery_cost", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("total", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="INR"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_orders_customer_id", "orders", ["customer_id"])
    op.create_index("ix_orders_store_id", "orders", ["store_id"])
    op.create_index("ix_orders_status", "orders", ["status"])

    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("offer_id", sa.Integer(), sa.ForeignKey("offers.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("delivery_cost", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("line_total", sa.Numeric(12, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("price_alerts")
    op.drop_table("wishlist")
    op.drop_table("inventory")
    op.drop_table("price_history")
    op.drop_table("prices")
    op.drop_table("offers")
    op.drop_table("product_matches")
    op.drop_table("product_variants")
    op.drop_table("products")
    op.drop_table("categories")
    op.drop_table("stores")
    op.drop_table("users")
