import React from 'react';
import { useComparison } from '../../context/ComparisonContext';
import { Modal } from '../common/Modal';
import { IconX, IconLayers, IconTrash2, IconStar, IconCheck, IconExternalLink } from '../common/Icons';

export function CompareDrawer({ onNavigate }) {
  const {
    comparedProducts,
    isDrawerOpen,
    setIsDrawerOpen,
    isModalOpen,
    setIsModalOpen,
    removeFromCompare,
    clearCompare,
    count
  } = useComparison();

  if (count === 0) return null;

  return (
    <>
      {/* Floating Bottom Drawer */}
      {isDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            width: '90%',
            maxWidth: '850px',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Left: Pinned Items Previews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', padding: '4px 0' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Compare ({count}/4):
            </div>

            {comparedProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px 4px 4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>
                  ${p.lowestPrice.toFixed(0)}
                </span>
                <button
                  onClick={() => removeFromCompare(p.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  <IconX size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <IconLayers size={16} /> Compare Matrix
            </button>
            <button
              onClick={clearCompare}
              className="btn-icon"
              style={{ borderRadius: '50%' }}
              title="Clear all"
            >
              <IconTrash2 size={16} />
            </button>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="btn-icon"
              style={{ borderRadius: '50%' }}
              title="Minimize"
            >
              <IconX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Minimized Pill when Drawer closed */}
      {!isDrawerOpen && count > 0 && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="btn btn-primary btn-sm"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 90,
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <IconLayers size={16} /> Compare Products ({count})
        </button>
      )}

      {/* Side-by-Side Detailed Comparison Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Side-by-Side Product Comparison (${count} Products)`}
        maxWidth="960px"
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px', color: 'var(--text-muted)', width: '180px' }}>Feature</th>
                {comparedProducts.map((p) => (
                  <th key={p.id} style={{ padding: '12px', minWidth: '200px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                      />
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.title}</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>
                        From ${p.lowestPrice.toFixed(2)}
                      </div>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          onNavigate(`product/${p.id}`);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '4px' }}
                      >
                        View All Offers
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Brand</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>{p.brand}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Rating</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }}>
                      <IconStar size={14} filled={true} /> {p.rating} ({p.reviewsCount} reviews)
                    </div>
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Available Sellers</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>
                    <strong>{p.offers.length} stores</strong> (Amazon, Best Buy, etc.)
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>All-Time Low</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} style={{ padding: '12px', color: 'var(--success)', fontWeight: 600 }}>
                    ${p.allTimeLow ? p.allTimeLow.toFixed(2) : p.lowestPrice.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Specs Overview</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} style={{ padding: '12px', fontSize: '0.8125rem', color: 'var(--text-secondary)', verticalAlign: 'top' }}>
                    {Object.entries(p.specs || {}).slice(0, 3).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: '4px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{k}:</strong> {v}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
