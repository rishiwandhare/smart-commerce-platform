-- ==============================================================================
-- Price Comparator Platform - Relational Database Schema (PostgreSQL)
-- ==============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Retailers Table
-- Stores authorized retailers, domains, and feed/API ingestion metadata
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS retailers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL,
    affiliate_partner_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. Categories Table
-- Hierarchical product taxonomy
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. Canonical Products Table
-- Master catalog item after entity resolution / deduplication
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    brand VARCHAR(255),
    model_number VARCHAR(255),
    upc VARCHAR(50) UNIQUE,
    ean VARCHAR(50) UNIQUE,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. Product Offers / Listings Table
-- Specific retailer listings linked to the master product
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_offers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    retailer_id INTEGER NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    retailer_sku VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    product_url TEXT NOT NULL,
    current_price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    availability VARCHAR(50) DEFAULT 'in_stock', -- in_stock, out_of_stock, preorder
    rating NUMERIC(3, 2),
    reviews_count INTEGER DEFAULT 0,
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_retailer_product_sku UNIQUE (retailer_id, retailer_sku)
);

-- ------------------------------------------------------------------------------
-- 5. Price History Table
-- Time-series tracking for trend analysis and price drop alerts
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_history (
    id BIGSERIAL PRIMARY KEY,
    offer_id INTEGER NOT NULL REFERENCES product_offers(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_upc_ean ON products(upc, ean);

CREATE INDEX IF NOT EXISTS idx_offers_product ON product_offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_retailer ON product_offers(retailer_id);
CREATE INDEX IF NOT EXISTS idx_offers_price ON product_offers(current_price);
CREATE INDEX IF NOT EXISTS idx_offers_availability ON product_offers(availability);

CREATE INDEX IF NOT EXISTS idx_price_history_offer_date ON price_history(offer_id, recorded_at);
