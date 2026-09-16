import React from 'react';
import { IconZap, IconShieldCheck, IconStore, IconTrendingDown } from './Icons';

export function Footer({ onNavigate }) {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '4rem 0 2rem',
        marginTop: '6rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <IconZap size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>PricePulse</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Real-time multi-retailer e-commerce price comparison platform. We index authorized feeds, match identical products with AI entity resolution, and find you the guaranteed lowest price.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IconShieldCheck size={16} /> Permitted Feeds Only
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Top Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li>
                <a href="#search?category=smartphones" onClick={(e) => { e.preventDefault(); onNavigate('search?category=smartphones'); }}>
                  Smartphones & Accessories
                </a>
              </li>
              <li>
                <a href="#search?category=laptops" onClick={(e) => { e.preventDefault(); onNavigate('search?category=laptops'); }}>
                  Laptops & Ultrabooks
                </a>
              </li>
              <li>
                <a href="#search?category=audio" onClick={(e) => { e.preventDefault(); onNavigate('search?category=audio'); }}>
                  Noise-Canceling Headphones
                </a>
              </li>
              <li>
                <a href="#search?category=tv" onClick={(e) => { e.preventDefault(); onNavigate('search?category=tv'); }}>
                  4K OLED Smart TVs
                </a>
              </li>
              <li>
                <a href="#search?category=gaming" onClick={(e) => { e.preventDefault(); onNavigate('search?category=gaming'); }}>
                  Gaming Consoles & Gear
                </a>
              </li>
            </ul>
          </div>

          {/* Features & Portals */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Platform Solutions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li>
                <a href="#search" onClick={(e) => { e.preventDefault(); onNavigate('search'); }}>
                  Price Comparison Engine
                </a>
              </li>
              <li>
                <a href="#alerts" onClick={(e) => { e.preventDefault(); onNavigate('alerts'); }}>
                  Automated Price Drop Alerts
                </a>
              </li>
              <li>
                <a href="#orders" onClick={(e) => { e.preventDefault(); onNavigate('orders'); }}>
                  Local Store Same-Day Pickup
                </a>
              </li>
              <li>
                <a href="#shopkeeper" onClick={(e) => { e.preventDefault(); onNavigate('shopkeeper'); }}>
                  Merchant & Shopkeeper Portal
                </a>
              </li>
              <li>
                <a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}>
                  Admin Oversight Console
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Comparison Integrity
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <IconTrendingDown size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span>We continually monitor prices across Amazon, Best Buy, Walmart, and local independent electronics stores.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <IconStore size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <span>Support local retailers with integrated in-store pickup reservations.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} PricePulse Platform. Built with React + Vite and Python FastAPI backend ready.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Permitted Retailer APIs Only</span>
            <span>No Fake Data</span>
            <span>Zero Tracking Pixels</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
