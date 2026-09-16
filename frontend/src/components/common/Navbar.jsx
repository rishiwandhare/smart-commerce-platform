import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/UserPreferencesContext';
import { useComparison } from '../../context/ComparisonContext';
import {
  IconSearch,
  IconShoppingBag,
  IconHeart,
  IconBell,
  IconStore,
  IconShieldCheck,
  IconBarChart3,
  IconUser,
  IconLayers,
  IconZap,
  IconSliders
} from './Icons';

export function Navbar({ onNavigate, currentPath = '' }) {
  const { currentUser, activePersonaRole, switchPersona, isCustomer, isShopkeeper, isAdmin } = useAuth();
  const { wishlistCount, alertCount, orders } = usePreferences();
  const { count: compareCount, setIsDrawerOpen } = useComparison();

  const [searchQuery, setSearchQuery] = useState('');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('search');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--header-height)',
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
            }}
          >
            <IconZap size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                PricePulse
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.625rem', padding: '2px 6px' }}>
                AI Match
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: '1',
            maxWidth: '520px',
            position: 'relative'
          }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Search products (e.g., iPhone 15 Pro, MacBook M3, Sony XM5)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.75rem',
              paddingRight: '4rem',
              height: '42px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface)'
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          >
            <IconSearch size={18} />
          </span>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{
              position: 'absolute',
              right: '4px',
              top: '4px',
              bottom: '4px',
              borderRadius: 'var(--radius-full)',
              padding: '0 1rem'
            }}
          >
            Compare
          </button>
        </form>

        {/* Dynamic Navigation Links based on persona */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isCustomer && (
            <>
              <button
                onClick={() => onNavigate('search')}
                className="btn btn-outline btn-sm"
                style={{ border: 'none', color: currentPath.startsWith('search') ? 'var(--primary)' : 'var(--text-secondary)' }}
              >
                Browse Deals
              </button>

              <button
                onClick={() => onNavigate('wishlist')}
                className="btn-icon"
                title="Wishlist"
                style={{ position: 'relative' }}
              >
                <IconHeart size={19} filled={wishlistCount > 0} className={wishlistCount > 0 ? "text-rose" : ""} />
                {wishlistCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--danger)',
                      color: '#fff',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('alerts')}
                className="btn-icon"
                title="Price Alerts"
                style={{ position: 'relative' }}
              >
                <IconBell size={19} />
                {alertCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--warning)',
                      color: '#000',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {alertCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('orders')}
                className="btn-icon"
                title="Store Pickup Orders"
                style={{ position: 'relative' }}
              >
                <IconShoppingBag size={19} />
                {orders.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {orders.length}
                  </span>
                )}
              </button>
            </>
          )}

          {isShopkeeper && (
            <>
              <button
                onClick={() => onNavigate('shopkeeper')}
                className="btn btn-sm"
                style={{
                  color: currentPath === 'shopkeeper' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: currentPath === 'shopkeeper' ? 'var(--primary-light)' : 'transparent',
                  border: 'none'
                }}
              >
                Overview
              </button>
              <button
                onClick={() => onNavigate('shopkeeper/inventory')}
                className="btn btn-sm"
                style={{
                  color: currentPath === 'shopkeeper/inventory' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: currentPath === 'shopkeeper/inventory' ? 'var(--primary-light)' : 'transparent',
                  border: 'none'
                }}
              >
                Prices & Stock
              </button>
              <button
                onClick={() => onNavigate('shopkeeper/analytics')}
                className="btn btn-sm"
                style={{
                  color: currentPath === 'shopkeeper/analytics' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: currentPath === 'shopkeeper/analytics' ? 'var(--primary-light)' : 'transparent',
                  border: 'none'
                }}
              >
                Demand Forecast
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => onNavigate('admin')}
                className="btn btn-sm"
                style={{
                  color: currentPath === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: currentPath === 'admin' ? 'var(--primary-light)' : 'transparent',
                  border: 'none'
                }}
              >
                System Health
              </button>
              <button
                onClick={() => onNavigate('admin/stores')}
                className="btn btn-sm"
                style={{
                  color: currentPath === 'admin/stores' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: currentPath === 'admin/stores' ? 'var(--primary-light)' : 'transparent',
                  border: 'none'
                }}
              >
                Retailer Feeds
              </button>
              <button
                onClick={() => onNavigate('admin/matching')}
                className="btn btn-sm"
                style={{
                  color: currentPath === 'admin/matching' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: currentPath === 'admin/matching' ? 'var(--primary-light)' : 'transparent',
                  border: 'none'
                }}
              >
                AI Match Queue
              </button>
            </>
          )}

          {/* Side-by-side Compare Pinned Trigger */}
          {compareCount > 0 && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="btn btn-sm btn-outline"
              style={{
                borderColor: 'var(--accent-cyan)',
                color: 'var(--accent-cyan)',
                background: 'var(--accent-cyan-light)'
              }}
            >
              <IconLayers size={16} />
              Compare ({compareCount})
            </button>
          )}

          {/* Interactive Persona Switcher Badge */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="btn btn-sm"
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px 4px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentUser.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--accent-cyan)', textTransform: 'capitalize' }}>
                  {activePersonaRole}
                </div>
              </div>
            </button>

            {/* Persona Switcher Dropdown */}
            {showPersonaMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '240px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '8px',
                  zIndex: 200,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                <div style={{ padding: '6px 8px', fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Switch Test Persona
                </div>

                <button
                  onClick={() => { switchPersona('customer'); setShowPersonaMenu(false); onNavigate(''); }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    textAlign: 'left',
                    background: activePersonaRole === 'customer' ? 'var(--primary-light)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8125rem'
                  }}
                >
                  <IconUser size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Customer View</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Alex (Price comparisons)</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchPersona('shopkeeper'); setShowPersonaMenu(false); onNavigate('shopkeeper'); }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    textAlign: 'left',
                    background: activePersonaRole === 'shopkeeper' ? 'var(--primary-light)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8125rem'
                  }}
                >
                  <IconStore size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Shopkeeper View</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>MetroTech (Stock & Pricing)</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchPersona('admin'); setShowPersonaMenu(false); onNavigate('admin'); }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    textAlign: 'left',
                    background: activePersonaRole === 'admin' ? 'var(--primary-light)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8125rem'
                  }}
                >
                  <IconShieldCheck size={16} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Admin Platform</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>System oversight & Feeds</div>
                  </div>
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '6px 0' }}></div>

                <button
                  onClick={() => { setShowPersonaMenu(false); onNavigate('auth'); }}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  Account / Login Options
                </button>
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
}
