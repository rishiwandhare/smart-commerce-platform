import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/UserPreferencesContext';
import { StatCard } from '../../components/dashboard/StatCard';
import {
  IconHeart,
  IconBell,
  IconShoppingBag,
  IconTrendingDown,
  IconStore,
  IconArrowRight,
  IconZap
} from '../../components/common/Icons';

export function CustomerDashboardPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const { wishlistCount, alerts, orders } = usePreferences();

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          background: 'var(--primary-dark)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
          />
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase' }}>
              Customer Portal
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Welcome back, {currentUser.name}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Tracking deals from {currentUser.location} • Member since {currentUser.memberSince}
            </p>
          </div>
        </div>

        <button onClick={() => onNavigate('search')} className="btn btn-primary">
          <IconZap size={18} /> Search New Deals
        </button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        <StatCard
          title="Total Lifetime Savings"
          value={`$${currentUser.savedSavings.toFixed(2)}`}
          change="+18% vs MSRP"
          isPositive={true}
          icon={<IconTrendingDown size={20} />}
          subtitle="saved on tech deals"
        />

        <StatCard
          title="Saved to Wishlist"
          value={wishlistCount}
          icon={<IconHeart size={20} />}
          subtitle="live price tracking"
        />

        <StatCard
          title="Active Price Alerts"
          value={alerts.length}
          icon={<IconBell size={20} />}
          subtitle="monitoring drops"
        />

        <StatCard
          title="Local Pickup Orders"
          value={orders.length}
          icon={<IconShoppingBag size={20} />}
          subtitle="ready for pickup"
        />
      </div>

      {/* Active Price Alerts & Pickup Orders Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))',
          gap: '2rem'
        }}
      >
        {/* Active Alerts Box */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconBell size={18} style={{ color: 'var(--warning)' }} /> Active Price Alerts
            </h3>
            <button onClick={() => onNavigate('alerts')} className="btn btn-outline btn-sm">
              Manage All
            </button>
          </div>

          {alerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No active price alerts set.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {alt.productTitle}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Current: ${alt.currentPrice.toFixed(2)} • Target: <strong style={{ color: 'var(--success)' }}>${alt.targetPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate(`product/${alt.productId}`)}
                    className="btn btn-secondary btn-sm"
                  >
                    View Offer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Local Pickup Reservations Box */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconStore size={18} style={{ color: 'var(--accent-cyan)' }} /> Store Pickup Orders
            </h3>
            <button onClick={() => onNavigate('orders')} className="btn btn-outline btn-sm">
              View All
            </button>
          </div>

          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No pending store pickup orders.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{ord.productTitle}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>{ord.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {ord.storeName} • {ord.pickupAddress}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.8125rem' }}>
                    <span>Pickup Code: <strong style={{ color: 'var(--primary)' }}>{ord.pickupCode}</strong></span>
                    <strong style={{ color: 'var(--text-primary)' }}>${ord.pricePaid.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
