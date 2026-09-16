import React from 'react';
import { MOCK_CATEGORIES, MOCK_BRANDS } from '../../data/mockProducts';
import { IconFilter, IconRefreshCw } from '../common/Icons';

export function FilterSidebar({
  category,
  onCategoryChange,
  brand,
  onBrandChange,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onInStockChange,
  onReset
}) {
  return (
    <aside
      className="glass-card"
      style={{
        padding: '1.5rem',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem' }}>
          <IconFilter size={18} /> Filters
        </div>
        <button
          onClick={onReset}
          className="btn-icon"
          style={{ padding: '4px', fontSize: '0.75rem', background: 'transparent', border: 'none' }}
          title="Reset Filters"
        >
          <IconRefreshCw size={15} />
        </button>
      </div>

      {/* Category Section */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Category
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {MOCK_CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  border: 'none',
                  background: isSelected ? 'var(--primary-light)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <span>{cat.name}</span>
                {cat.count && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

      {/* Price Range Filter */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Max Price: ${maxPrice}
        </h4>
        <input
          type="range"
          min="100"
          max="4000"
          step="50"
          value={maxPrice}
          onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>$100</span>
          <span>$4,000+</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

      {/* Brand Checkboxes */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Brand
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="brandFilter"
              checked={brand === ''}
              onChange={() => onBrandChange('')}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>All Brands</span>
          </label>
          {MOCK_BRANDS.map((b) => (
            <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="brandFilter"
                checked={brand.toLowerCase() === b.toLowerCase()}
                onChange={() => onBrandChange(b)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

      {/* In-Stock Only Toggle */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--success)' }}
          />
          <span style={{ fontWeight: 500 }}>In-Stock Offers Only</span>
        </label>
      </div>
    </aside>
  );
}
