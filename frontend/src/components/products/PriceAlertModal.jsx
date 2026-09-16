import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { usePreferences } from '../../context/UserPreferencesContext';
import { IconBell, IconTrendingDown } from '../common/Icons';

export function PriceAlertModal({ isOpen, onClose, product }) {
  const { addPriceAlert } = usePreferences();
  const [targetPrice, setTargetPrice] = useState(
    product ? Math.floor(product.lowestPrice * 0.95) : 0
  );
  const [email, setEmail] = useState('alex.johnson@example.com');

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetPrice > 0) {
      addPriceAlert({
        productId: product.id,
        productTitle: product.title,
        targetPrice,
        currentPrice: product.lowestPrice
      });
      onClose();
    }
  };

  const discount = Math.max(0, Math.round(((product.lowestPrice - targetPrice) / product.lowestPrice) * 100));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Price Drop Alert">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Product</div>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
            {product.title}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Current Best Price: <strong style={{ color: 'var(--text-primary)' }}>${product.lowestPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Notify me when price drops below ($):</label>
          <input
            type="number"
            step="1"
            className="input-field"
            value={targetPrice}
            onChange={(e) => setTargetPrice(Number(e.target.value))}
            min="1"
            max={product.lowestPrice}
            required
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            Targeting a {discount}% price drop below current lowest offer
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Notification Email:</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            <IconBell size={16} /> Set Alert
          </button>
        </div>
      </form>
    </Modal>
  );
}
