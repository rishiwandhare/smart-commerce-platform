import React from 'react';
import { IconMapPin, IconStore, IconCheck, IconClock } from '../common/Icons';

export function StoreMapVisualizer({ stores = [], selectedStoreId, onSelectStore, onReservePickup, productTitle }) {
  const selectedStore = stores.find((s) => s.id === selectedStoreId) || stores[0];

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
            Interactive Local Store & Inventory Map
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Pinpoint physical stores with real-time in-store stock for immediate pickup.
          </p>
        </div>
        <span style={{ fontSize: '0.8125rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
          San Francisco Metro Area
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', minHeight: '380px' }}>
        {/* Interactive SVG Vector Map */}
        <div style={{ backgroundColor: '#090d16', position: 'relative', overflow: 'hidden', minHeight: '340px' }}>
          <svg viewBox="0 0 500 350" style={{ width: '100%', height: '100%' }}>
            {/* Grid & Terrain Representation */}
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="500" height="350" fill="#090d16" />
            <rect width="500" height="350" fill="url(#mapGrid)" />

            {/* Stylized Bay / Coastline */}
            <path
              d="M 380 0 Q 320 120 370 200 T 310 350 L 500 350 L 500 0 Z"
              fill="#0d1b2a"
              opacity="0.8"
            />

            {/* Stylized Transit & Road Arteries */}
            <path d="M 20 180 Q 200 160 380 200" stroke="#1e293b" strokeWidth="6" fill="none" />
            <path d="M 160 20 L 180 340" stroke="#1e293b" strokeWidth="5" fill="none" />
            <path d="M 50 80 Q 220 100 420 70" stroke="#1e293b" strokeWidth="4" fill="none" />
            <path d="M 280 20 Q 260 200 310 340" stroke="#1e293b" strokeWidth="4" fill="none" />

            {/* Store Pins */}
            {stores.map((store, idx) => {
              // Normalized pin coordinates on the vector map
              const pinPositions = [
                { x: 230, y: 140 }, // MetroTech Market St
                { x: 190, y: 220 }, // Best Buy Harrison St
                { x: 260, y: 160 }, // Target Metreon
                { x: 340, y: 280 }  // Walmart Fremont
              ];
              const pos = pinPositions[idx % pinPositions.length];
              const isSelected = store.id === selectedStore?.id;

              return (
                <g
                  key={store.id}
                  onClick={() => onSelectStore(store.id)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {/* Radar Pulse on Selected */}
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="22" fill="var(--primary)" opacity="0.25">
                      <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Pin Body */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 14 : 10}
                    fill={store.hasItem ? (isSelected ? 'var(--primary)' : 'var(--success)') : 'var(--bg-surface)'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />

                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {idx + 1}
                  </text>

                  {/* Label on Pin */}
                  <text
                    x={pos.x}
                    y={pos.y - 18}
                    fill={isSelected ? 'var(--text-primary)' : 'var(--text-muted)'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {store.name.split(' - ')[0]} ({store.distanceMiles}mi)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Store Inventory Detail Card */}
        {selectedStore && (
          <div
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">
                  {selectedStore.distanceMiles} miles away
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconCheck size={14} /> Curbside Pickup Available
                </span>
              </div>

              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {selectedStore.name}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {selectedStore.address}, {selectedStore.city}, {selectedStore.state} {selectedStore.zip}
              </p>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem' }}>
                <IconClock size={14} /> {selectedStore.hours}
              </div>

              {/* In-Store Item Status */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Stock for: {productTitle || 'Selected Product'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedStore.hasItem ? 'var(--success)' : 'var(--danger)' }}>
                      {selectedStore.hasItem ? `${selectedStore.stockCount} Units In Stock` : 'Out of Stock at this store'}
                    </div>
                    {selectedStore.aisleLocation && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Located in: {selectedStore.aisleLocation}
                      </div>
                    )}
                  </div>
                  {selectedStore.localPrice && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Store Price</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ${selectedStore.localPrice.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                disabled={!selectedStore.hasItem}
                onClick={() => onReservePickup && onReservePickup(selectedStore)}
                className="btn btn-primary"
                style={{ flex: 1, opacity: selectedStore.hasItem ? 1 : 0.5, cursor: selectedStore.hasItem ? 'pointer' : 'not-allowed' }}
              >
                <IconStore size={18} /> Reserve for 1-Hour Pickup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
