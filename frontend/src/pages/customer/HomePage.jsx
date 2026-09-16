import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { storeService } from '../../services/storeService';
import { ProductCard } from '../../components/products/ProductCard';
import {
  IconSearch,
  IconTrendingDown,
  IconStore,
  IconShieldCheck,
  IconZap,
  IconArrowRight,
  IconLayers
} from '../../components/common/Icons';

export function HomePage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [topDrops, setTopDrops] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [drops, all, stores] = await Promise.all([
          productService.getTopPriceDrops(),
          productService.getProducts(),
          storeService.getNearbyStores({ maxDistanceMiles: 10 })
        ]);
        setTopDrops(drops);
        setFeaturedProducts(all);
        setNearbyStores(stores);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('search');
    }
  };

  const quickCategories = [
    { label: 'Smartphones', category: 'smartphones', icon: '📱' },
    { label: 'Laptops', category: 'laptops', icon: '💻' },
    { label: 'Headphones', category: 'audio', icon: '🎧' },
    { label: 'Smart 4K TVs', category: 'tv', icon: '📺' },
    { label: 'Gaming Consoles', category: 'gaming', icon: '🎮' }
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section
        className="home-hero"
        style={{
          textAlign: 'center',
          maxWidth: '850px',
          margin: '0 auto 4.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}
      >
        <div
          className="badge badge-primary"
          style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
        >
          <IconZap size={14} /> AI-Powered Real-Time Price Comparison
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-inverse)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'var(--text-inverse)'
          }}
        >
          Compare Prices. Shop Smarter.
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#c7d2fe', maxWidth: '620px', lineHeight: 1.6 }}>
            Compare current prices, delivery costs, stock and pickup options across online and local sellers before you buy.
        </p>

        {/* Hero Search Box */}
        <form
          onSubmit={handleHeroSearch}
          style={{
            width: '100%',
            maxWidth: '680px',
            position: 'relative',
            marginTop: '0.5rem'
          }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Search products by model, brand, or UPC (e.g. MacBook Pro M3, Sony XM5)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '1rem 7.5rem 1rem 3.25rem',
              fontSize: '1.0625rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-glass-card)',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--primary)'
            }}
          >
            <IconSearch size={22} />
          </span>
          <button
            type="submit"
            className="btn btn-cta"
            style={{
              position: 'absolute',
              right: '6px',
              top: '6px',
              bottom: '6px',
              borderRadius: 'var(--radius-full)',
              padding: '0 1.5rem'
            }}
          >
              Search Products
          </button>
        </form>

        {/* Quick Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '0.5rem' }}>
          {quickCategories.map((c) => (
            <button
              key={c.category}
              onClick={() => onNavigate(`search?category=${c.category}`)}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '0.8125rem' }}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="home-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Start with a category</span>
            <h2>Popular categories</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('search')}>View catalog <IconArrowRight size={16} /></button>
        </div>
        <div className="category-grid">
          {quickCategories.map((category) => (
            <button className="category-tile glass-card" key={category.category} onClick={() => onNavigate(`search?category=${category.category}`)}>
              <span className="category-icon">{category.icon}</span>
              <strong>{category.label}</strong>
              <span>Compare offers</span>
            </button>
          ))}
        </div>
      </section>

      {/* Best Price Opportunities */}
      <section className="home-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Lowest available offers</span>
            <h2>Best price opportunities</h2>
          </div>
          <span className="demo-note">Demo catalog data</span>
        </div>
        <div className="product-grid compact-grid">
          {featuredProducts.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} onNavigate={onNavigate} />)}
        </div>
      </section>

      {/* Top Price Drops Today Banner */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Biggest Price Drops Today
              </h2>
              <span className="badge badge-success">
                <IconTrendingDown size={14} /> Flash Deals
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              Products that dropped significantly below their 90-day average price across retailers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('search?sortBy=biggest_drop')}
            className="btn btn-outline btn-sm"
          >
            View All Deals <IconArrowRight size={16} />
          </button>
        </div>

        <div className="grid-products">
          {topDrops.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Nearby Stores */}
      <section className="home-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Local availability</span>
            <h2>Nearby stores with pickup</h2>
          </div>
          <span className="demo-note">No personal location used</span>
        </div>
        <div className="store-preview-grid">
          {nearbyStores.slice(0, 3).map((store) => (
            <article className="store-preview glass-card" key={store.id}>
              <div className="store-preview-icon"><IconStore size={20} /></div>
              <div><h3>{store.name}</h3><p>{store.distanceMiles} miles away · {store.hours}</p></div>
              <strong className={store.hasItem ? 'success-text' : 'muted-copy'}>{store.hasItem ? `${store.stockCount} in stock` : 'Check availability'}</strong>
              <span>{store.hasItem ? 'Pickup available' : 'Online comparison only'}</span>
            </article>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="home-section">
        <div className="section-heading-row">
          <div><span className="eyebrow">For your next comparison</span><h2>Recommended products</h2></div>
          <span className="demo-note">Based on demo browsing signals</span>
        </div>
        <div className="grid-products">
          {featuredProducts.slice(3, 7).map((product) => <ProductCard key={product.id} product={product} onNavigate={onNavigate} />)}
        </div>
      </section>

      {/* How It Works - 3 Step Visual */}
      <section
        className="glass-card"
        style={{
          padding: '3rem 2rem',
          marginBottom: '4.5rem',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          How Our Price Comparison Platform Works
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 2.5rem', fontSize: '0.9375rem' }}>
          We continuously ingest authorized feeds, match identical products, and route you to verified sellers.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <IconSearch size={22} />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              1. Search Any Product
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Type a product name, model number, or brand. Our engine queries multi-retailer databases in milliseconds.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-cyan-light)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <IconLayers size={22} />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              2. AI Matches & Compares
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Entity resolution algorithms match disparate listings from Amazon, Best Buy, Walmart, and local shops into one clean comparison.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <IconStore size={22} />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              3. Buy Online or Pickup Locally
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Click <strong>Buy Now</strong> to visit the seller's direct page, or reserve curbside pickup at a nearby local retailer.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Electronics Showcase */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Trending Tech Comparisons
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              Most searched laptops, smartphones, and audio gear this week.
            </p>
          </div>

          <button onClick={() => onNavigate('search')} className="btn btn-outline btn-sm">
            Browse All <IconArrowRight size={16} />
          </button>
        </div>

        <div className="grid-products">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
}
