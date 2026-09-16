import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../context/UserPreferencesContext';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/products/ProductCard';
import { IconHeart, IconSearch } from '../../components/common/Icons';

export function WishlistPage({ onNavigate }) {
  const { wishlistIds, toggleWishlist } = usePreferences();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistItems() {
      setLoading(true);
      try {
        const all = await productService.getProducts();
        const saved = all.filter((p) => wishlistIds.includes(p.id));
        setProducts(saved);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistItems();
  }, [wishlistIds]);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '0.25rem' }}>
          <IconHeart size={20} filled={true} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>Saved Items</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Wishlist & Tracked Deals</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
          Real-time lowest prices for items you are monitoring across all retailers.
        </p>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          Loading saved wishlist products...
        </div>
      ) : products.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
            <IconHeart size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.875rem' }}>
            Browse products and click the heart icon to save products and track their prices across retailers.
          </p>
          <button onClick={() => onNavigate('search')} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <IconSearch size={18} /> Explore Products
          </button>
        </div>
      ) : (
        <div className="grid-products">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}
