import React from 'react';
import { ProductCard } from './ProductCard';

export function RecommendationsList({ products, onNavigate, title = "Recommended Alternatives" }) {
  if (!products || products.length === 0) return null;

  return (
    <section style={{ marginTop: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {title}
        </h3>
      </div>
      <div className="grid-products">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}
