import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { PriceComparisonTable } from '../../components/comparison/PriceComparisonTable';
import { PriceHistoryChart } from '../../components/comparison/PriceHistoryChart';
import { NearbyStoreFinder } from '../../components/stores/NearbyStoreFinder';
import { RecommendationsList } from '../../components/products/RecommendationsList';
import { PriceAlertModal } from '../../components/products/PriceAlertModal';
import { Modal } from '../../components/common/Modal';
import { usePreferences } from '../../context/UserPreferencesContext';
import { useComparison } from '../../context/ComparisonContext';
import {
  IconHeart,
  IconBell,
  IconLayers,
  IconStar,
  IconTrendingDown,
  IconShieldCheck,
  IconStore,
  IconCheck,
  IconArrowRight
} from '../../components/common/Icons';
import { Badge } from '../../components/common/Badge';

export function ProductDetailPage({ productId, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [pickupModalOffer, setPickupModalOffer] = useState(null);

  const { isInWishlist, toggleWishlist, createPickupOrder } = usePreferences();
  const { isCompared, toggleCompare } = useComparison();

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
        const recs = await productService.getRecommendations(productId);
        setRecommendations(recs);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      loadProductData();
      window.scrollTo(0, 0);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
          Loading price comparisons & retailer data...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => onNavigate('search')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Search
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const compared = isCompared(product.id);
  const bestOffer = [...product.offers].sort((a, b) => a.price - b.price)[0];
  const maxSavings = product.originalMSRP - product.lowestPrice;

  const handleConfirmPickup = () => {
    if (pickupModalOffer) {
      createPickupOrder({
        productId: product.id,
        productTitle: product.title,
        retailerName: pickupModalOffer.retailerName || pickupModalOffer.name,
        storeName: pickupModalOffer.storeName || pickupModalOffer.name,
        pickupAddress: pickupModalOffer.address || 'Local Partner Store',
        price: pickupModalOffer.price || pickupModalOffer.localPrice || product.lowestPrice
      });
      setPickupModalOffer(null);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <span onClick={() => onNavigate('')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span onClick={() => onNavigate(`search?category=${product.category}`)} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
          {product.category}
        </span>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{product.brand}</span>
      </div>

      {/* Product Overview Header Grid */}
      <div
        className="product-overview-grid"
        style={{ marginBottom: '3rem' }}
      >
        {/* Left: Image Gallery Card */}
        <div
          className="glass-card"
          style={{
            overflow: 'hidden',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0e1a'
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: '100%',
              maxHeight: '440px',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)'
            }}
          />
        </div>

        {/* Right: Info & Pricing Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                {product.brand}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Model: {product.modelNumber}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.25, color: 'var(--text-primary)' }}>
              {product.title}
            </h1>

            {/* Ratings & Identifiers */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }}>
                <IconStar size={16} filled={true} />
                <strong style={{ color: 'var(--text-primary)' }}>{product.rating}</strong>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-muted)' }}>UPC: {product.upc}</span>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)' }}>
                ${product.lowestPrice.toFixed(2)}
              </span>
              {product.originalMSRP > product.lowestPrice && (
                <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.originalMSRP.toFixed(2)}
                </span>
              )}
              {maxSavings > 0 && (
                <Badge variant="success" icon={<IconTrendingDown size={14} />}>
                  Save ${maxSavings.toFixed(2)} ({product.priceDropPct}%)
                </Badge>
              )}
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Lowest price available at <strong style={{ color: 'var(--text-primary)' }}>{bestOffer?.retailerName}</strong>. Compared across {product.offers.length} certified retailers.
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
              {bestOffer && (
                <a
                  href={bestOffer.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-cta btn-lg"
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  Buy Now at {bestOffer.retailerName} (${bestOffer.price.toFixed(2)})
                </a>
              )}

              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="btn btn-outline"
                title="Set Price Alert"
              >
                <IconBell size={18} /> Price Drop Alert
              </button>

              <button
                onClick={() => toggleWishlist(product.id, product.title)}
                className="btn btn-outline"
                style={{ color: isFavorite ? 'var(--danger)' : 'inherit' }}
                title="Save to Wishlist"
              >
                <IconHeart size={18} filled={isFavorite} />
              </button>

              <button
                onClick={() => toggleCompare(product)}
                className="btn btn-outline"
                style={{ color: compared ? 'var(--accent-cyan)' : 'inherit' }}
                title="Pin for side-by-side compare"
              >
                <IconLayers size={18} />
              </button>
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {product.description}
          </p>
        </div>
      </div>

      {/* Multi-Seller Price Comparison Table */}
      <section style={{ marginBottom: '3.5rem' }}>
        <PriceComparisonTable
          product={product}
          onReservePickup={(offer) => setPickupModalOffer(offer)}
        />
      </section>

      {/* Historical Price Chart */}
      <section style={{ marginBottom: '3.5rem' }}>
        <PriceHistoryChart
          priceHistory={product.priceHistory}
          allTimeLow={product.allTimeLow}
          allTimeHigh={product.allTimeHigh}
          currentPrice={product.lowestPrice}
        />
      </section>

      {/* Nearby Stores & Interactive Stock Map */}
      <NearbyStoreFinder
        product={product}
        onReservePickup={(store) => setPickupModalOffer(store)}
      />

      {/* Technical Specifications Table */}
      {product.specs && (
        <section style={{ marginTop: '3.5rem' }}>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Technical Specifications
              </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <tr
                    key={key}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem', width: '30%', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>
                      {key}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recommended Alternatives */}
      <RecommendationsList products={recommendations} onNavigate={onNavigate} />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        product={product}
      />

      {/* Local Pickup Reservation Confirmation Modal */}
      <Modal
        isOpen={Boolean(pickupModalOffer)}
        onClose={() => setPickupModalOffer(null)}
        title="Reserve for Local Store Pickup"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Product</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{product.title}</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Pickup Location</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              {pickupModalOffer?.storeName || pickupModalOffer?.name || 'MetroTech Express - Downtown Hub'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {pickupModalOffer?.address || '452 Market St, Suite 100, San Francisco'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--success)', marginTop: '6px', fontWeight: 600 }}>
              <IconCheck size={14} /> Item ready for pickup in 1 hour
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Price due upon pickup:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ${(pickupModalOffer?.price || pickupModalOffer?.localPrice || product.lowestPrice).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={() => setPickupModalOffer(null)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={handleConfirmPickup} className="btn btn-primary btn-sm">
              <IconStore size={16} /> Confirm Reservation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
