import React from 'react';
import { usePreferences } from '../../context/UserPreferencesContext';
import { useComparison } from '../../context/ComparisonContext';
import { IconHeart, IconStar, IconLayers, IconTrendingDown, IconStore } from '../common/Icons';
import { Badge } from '../common/Badge';

export function ProductCard({ product, onNavigate }) {
  const { isInWishlist, toggleWishlist } = usePreferences();
  const { isCompared, toggleCompare } = useComparison();

  const isFavorite = isInWishlist(product.id);
  const compared = isCompared(product.id);

  // Check if any offer has local store pickup
  const hasLocalStore = product.offers.some((o) => o.localPickup);

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Floating Badges */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2
        }}
      >
        {product.priceDropPct > 0 ? (
          <Badge variant="success" icon={<IconTrendingDown size={14} />}>
            -{product.priceDropPct}% Off
          </Badge>
        ) : (
          <span />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id, product.title);
          }}
          className="btn-icon"
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: '50%',
            color: isFavorite ? 'var(--danger)' : 'var(--text-muted)'
          }}
          title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <IconHeart size={18} filled={isFavorite} />
        </button>
      </div>

      {/* Product Image Container */}
      <div
        onClick={() => onNavigate(`product/${product.id}`)}
        style={{
          height: '210px',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        {hasLocalStore && (
          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              background: 'rgba(11, 15, 25, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 6px',
              fontSize: '0.6875rem',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <IconStore size={12} /> Local Pickup Ready
          </span>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand & Ratings */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
            {product.brand}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--warning)' }}>
            <IconStar size={14} filled={true} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onNavigate(`product/${product.id}`)}
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '0.75rem',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.8em'
          }}
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Pricing Summary */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ${product.lowestPrice.toFixed(2)}
            </span>
            {product.originalMSRP > product.lowestPrice && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ${product.originalMSRP.toFixed(2)}
              </span>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Available at <strong style={{ color: 'var(--text-primary)' }}>{product.offers.length} stores</strong>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigate(`product/${product.id}`)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              Compare Prices
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(product);
              }}
              className="btn btn-sm"
              style={{
                background: compared ? 'var(--accent-cyan-light)' : 'var(--bg-surface)',
                color: compared ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${compared ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                padding: '0.375rem 0.625rem'
              }}
              title={compared ? 'Pinned for comparison' : 'Pin to compare'}
            >
              <IconLayers size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
