import React, { useState } from 'react';
import { IconTrendingDown, IconTrendingUp, IconClock, IconStar } from '../common/Icons';
import { Badge } from '../common/Badge';

export function PriceHistoryChart({ priceHistory = [], allTimeLow, allTimeHigh, currentPrice }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [timeRange, setTimeRange] = useState('all');

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        No historical price data available yet.
      </div>
    );
  }

  // Filter based on timeRange
  let displayData = [...priceHistory];
  if (timeRange === '7d') {
    displayData = displayData.slice(-1);
  } else if (timeRange === '30d') {
    displayData = displayData.slice(-2);
  } else if (timeRange === '3m') {
    displayData = displayData.slice(-4);
  } else if (timeRange === '6m') {
    displayData = displayData.slice(-6);
  } else if (timeRange === '1y') {
    displayData = displayData.slice(-12);
  }

  // SVG Chart Dimensions
  const width = 680;
  const height = 220;
  const paddingX = 50;
  const paddingY = 35;

  const prices = displayData.map((d) => d.price);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const minPrice = Math.min(...prices) * 0.96;
  const maxPrice = Math.max(...prices) * 1.04;
  const priceRange = maxPrice - minPrice || 1;

  // Calculate coordinates
  const points = displayData.map((d, index) => {
    const x = paddingX + (index / (displayData.length - 1 || 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.price - minPrice) / priceRange) * (height - paddingY * 2);
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, pt, index) => {
    return index === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Fill area under path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Determine if buying now is recommended
  const isAtAllTimeLow = currentPrice <= (allTimeLow || minPrice);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Historical Price Tracking & Trend
            </h3>
            {isAtAllTimeLow && (
              <Badge variant="success" icon={<IconTrendingDown size={14} />}>
                All-Time Low!
              </Badge>
            )}
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Demo/mock history across retailers. Track price movement to decide when to compare offers.
          </p>
        </div>

        {/* Range Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {['7d', '30d', '3m', '6m', '1y'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              style={{
                background: timeRange === r ? 'var(--primary)' : 'transparent',
                color: timeRange === r ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
                {r === '1y' ? '1 Year' : r === '3m' ? '3 Months' : r === '6m' ? '6 Months' : r === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All-Time Lowest</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>
            ${(allTimeLow || minPrice).toFixed(2)}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average in range</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)' }}>${averagePrice.toFixed(2)}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All-Time Highest</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--danger)' }}>
            ${(allTimeHigh || maxPrice).toFixed(2)}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Buy Recommendation</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: isAtAllTimeLow ? 'var(--success)' : 'var(--info)' }}>
            {isAtAllTimeLow ? 'Buy Now (Best Price)' : 'Good Deal (Close to Low)'}
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '550px', overflow: 'visible' }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.5, 1].map((pct, idx) => {
            const yVal = paddingY + pct * (height - paddingY * 2);
            const priceVal = maxPrice - pct * (maxPrice - minPrice);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={yVal}
                  x2={width - paddingX}
                  y2={yVal}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={yVal + 4}
                  fill="var(--text-muted)"
                  fontSize="11"
                  textAnchor="end"
                >
                  ${Math.round(priceVal)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#priceGradient)" />

          {/* Main Price Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredPoint?.date === pt.date;
            return (
              <g key={idx} onMouseEnter={() => setHoveredPoint(pt)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 4.5}
                  fill={isHovered ? '#ffffff' : 'var(--primary)'}
                  stroke="var(--bg-primary)"
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.15s ease' }}
                />
                <text
                  x={pt.x}
                  y={height - 10}
                  fill="var(--text-muted)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {pt.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 30}%`,
              transform: 'translate(-50%, -100%)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              fontSize: '0.75rem',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-lg)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--success)' }}>
              ${hoveredPoint.price.toFixed(2)}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {hoveredPoint.date} • {hoveredPoint.retailer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
