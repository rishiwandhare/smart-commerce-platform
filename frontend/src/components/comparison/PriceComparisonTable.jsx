import React from 'react';
import { IconExternalLink, IconStore, IconTruck, IconStar, IconCheck, IconShieldCheck } from '../common/Icons';
import { Badge } from '../common/Badge';

export function PriceComparisonTable({ product, onReservePickup }) {
  if (!product || !product.offers || product.offers.length === 0) {
    return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>No current retailer offers.</div>;
  }

  // Sort offers by price ascending so lowest price is on top
  const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);
  const minPrice = sortedOffers[0].price;

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Available Sellers & Price Comparison
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Prices verified across authorized feeds. Select a seller to visit their original page or reserve in-store.
          </p>
        </div>
        <Badge variant="primary">
          {product.offers.length} Verified Offers
        </Badge>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Retailer / Seller</th>
              <th style={{ padding: '1rem' }}>Condition & Stock</th>
              <th style={{ padding: '1rem' }}>Delivery / Fulfillment</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedOffers.map((offer, idx) => {
              const isBestPrice = offer.price === minPrice;
              const hasPickup = offer.localPickup;

              return (
                <tr
                  key={offer.id || idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isBestPrice ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isBestPrice ? 'rgba(99, 102, 241, 0.04)' : 'transparent')}
                >
                  {/* Retailer Name & Seller */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: 'var(--text-primary)',
                          flexShrink: 0
                        }}
                      >
                        {offer.retailerName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                            {offer.retailerName}
                          </span>
                          {isBestPrice && (
                            <Badge variant="success" style={{ fontSize: '0.625rem', padding: '1px 5px' }}>
                              Best Deal
                            </Badge>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span>{offer.sellerName}</span>
                          {offer.sellerRating && (
                            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--warning)' }}>
                              • <IconStar size={12} filled={true} /> {offer.sellerRating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Condition & Stock */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {offer.condition || 'Brand New'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: offer.stockCount < 5 ? 'var(--warning)' : 'var(--success)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconCheck size={14} /> {offer.availability}
                    </div>
                  </td>

                  {/* Delivery / Shipping */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconTruck size={16} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{offer.shipping}</span>
                    </div>
                    {hasPickup && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                        <IconStore size={14} style={{ color: 'var(--primary)' }} />
                        <span>Pickup: {offer.pickupReady || 'In Store'} ({offer.storeDistance})</span>
                      </div>
                    )}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isBestPrice ? '#34d399' : 'var(--text-primary)' }}>
                      ${offer.price.toFixed(2)}
                    </div>
                    {offer.originalPrice > offer.price && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ${offer.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {hasPickup && onReservePickup && (
                        <button
                          onClick={() => onReservePickup(offer)}
                          className="btn btn-secondary btn-sm"
                          title="Reserve at local store for same-day pickup"
                        >
                          <IconStore size={15} /> Pickup
                        </button>
                      )}

                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn-sm ${isBestPrice ? 'btn-success' : 'btn-primary'}`}
                        id={`buy-now-${offer.id}`}
                      >
                        Buy Now <IconExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
