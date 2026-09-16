import React from 'react';
import ProductCard from '../components/products/ProductCard';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

function HomePage({ products, onSearch, onNavigate, onOpenProduct, query, setQuery }) {
  const featuredProducts = products.slice(0, 3);
  const highlights = [
    { title: 'Price tracking', value: '24/7', hint: 'Live price alerts' },
    { title: 'Seller coverage', value: '6+', hint: 'Authorized retailers' },
    { title: 'Savings', value: '$428', hint: 'Avg. user savings' }
  ];

  return (
    <div className="page-stack">
      <section className="hero glass-card">
        <div className="hero-content">
          <p className="eyebrow">Smart shopping powered by price intelligence</p>
          <h1>Find the best deals before you buy.</h1>
          <p className="hero-subtitle">
            Compare product prices, stock, local pickup, and seller ratings across the market.
          </p>

          <div className="hero-search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for smartphones, laptops, headphones..."
            />
            <button className="btn btn-primary" onClick={onSearch}>Compare prices</button>
          </div>

          <div className="mini-pills">
            <span>Fast delivery</span>
            <span>Local pickup</span>
            <span>Price alerts</span>
          </div>
        </div>
      </section>

      <section className="stats-row">
        {highlights.map((item) => (
          <div key={item.title} className="stat-box glass-card">
            <div className="stat-title">{item.title}</div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-hint">{item.hint}</div>
          </div>
        ))}
      </section>

      <section className="section-header">
        <div>
          <p className="eyebrow">Trending today</p>
          <h2>Popular comparisons</h2>
        </div>
        <button className="btn btn-outline" onClick={() => onNavigate('results')}>Browse all</button>
      </section>

      <div className="product-grid">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onOpenProduct}
            onBuy={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
          />
        ))}
      </div>

      <section className="feature-grid">
        <div className="feature-card glass-card">
          <h3>Reliable seller comparison</h3>
          <p>See the lowest available price, shipping fees, stock counts, and local pickup options in one place.</p>
        </div>
        <div className="feature-card glass-card">
          <h3>Price history intelligence</h3>
          <p>Track historical drops and spot the best time to buy with projected savings insights.</p>
        </div>
        <div className="feature-card glass-card">
          <h3>Smart recommendations</h3>
          <p>Get curated product suggestions based on your wishlist, alerts, and local availability patterns.</p>
        </div>
      </section>

      <section className="deal-banner glass-card">
        <div>
          <p className="eyebrow">This week’s best price</p>
          <h3>{featuredProducts[0]?.title}</h3>
        </div>
        <div className="deal-price">
          <span>from</span>
          <strong>{currency.format(featuredProducts[0]?.lowestPrice || 0)}</strong>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
