import React from 'react';
import { ProductCard } from './ProductCard';
import { IconSearch, IconRefreshCw } from '../common/Icons';

export function ProductGrid({ products, loading, onNavigate, onClearFilters }) {
  if (loading) {
    return (
      <div className="grid-products">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{ height: '390px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ height: '200px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }} className="animate-pulse" />
            <div style={{ height: '18px', width: '40%', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }} className="animate-pulse" />
            <div style={{ height: '24px', width: '85%', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }} className="animate-pulse" />
            <div style={{ marginTop: 'auto', height: '36px', width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }} className="animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconSearch size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No products matched your search</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9375rem' }}>
          Try loosening your price filters, selecting a different category, or checking your spelling.
        </p>
        {onClearFilters && (
          <button onClick={onClearFilters} className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }}>
            <IconRefreshCw size={16} /> Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid-products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
      ))}
    </div>
  );
}
