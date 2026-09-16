import React from 'react';

export function SortDropdown({ sortBy, onSortChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="input-field"
        style={{
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          backgroundColor: 'var(--bg-surface)',
          cursor: 'pointer',
          width: 'auto'
        }}
      >
        <option value="lowest_price">Lowest Price First</option>
        <option value="highest_price">Highest Price First</option>
        <option value="biggest_drop">Biggest Price Drop (%)</option>
        <option value="top_rated">Customer Rating</option>
        <option value="most_retailers">Most Sellers Available</option>
      </select>
    </div>
  );
}
