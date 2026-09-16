import React from 'react';
import { IconZap, IconTrendingUp, IconAlertTriangle } from '../common/Icons';

export function DemandForecastChart({ inventory = [] }) {
  // Chart dimensions
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const barData = inventory.slice(0, 3).map((item) => ({
    name: item.productTitle.split(' ')[0] + ' ' + (item.productTitle.split(' ')[1] || ''),
    currentStock: item.stock,
    forecastDemand: item.forecastNextMonth,
    trend: item.demandTrend
  }));

  const maxVal = Math.max(...barData.map((d) => Math.max(d.currentStock, d.forecastDemand)), 35);
  const chartHeight = height - paddingY * 2;
  const groupWidth = (width - paddingX * 2) / (barData.length || 1);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Demand Forecasting & Stock Readiness
            </h3>
            <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
              <IconZap size={12} /> Predictive Analytics
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Comparison of current local inventory against 30-day projected search demand.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Current Stock</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--accent-cyan)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Predicted 30d Demand</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '500px' }}>
          {/* Baseline */}
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="rgba(255,255,255,0.1)" />

          {barData.map((d, idx) => {
            const groupX = paddingX + idx * groupWidth;
            const barW = 28;
            const currentH = (d.currentStock / maxVal) * chartHeight;
            const forecastH = (d.forecastDemand / maxVal) * chartHeight;

            const isStockDeficit = d.currentStock < d.forecastDemand;

            return (
              <g key={idx}>
                {/* Bar 1: Current Stock */}
                <rect
                  x={groupX + groupWidth / 2 - barW - 4}
                  y={height - paddingY - currentH}
                  width={barW}
                  height={currentH}
                  fill="var(--primary)"
                  rx="4"
                />
                <text
                  x={groupX + groupWidth / 2 - barW / 2 - 4}
                  y={height - paddingY - currentH - 6}
                  fill="var(--text-primary)"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {d.currentStock}
                </text>

                {/* Bar 2: Forecast Demand */}
                <rect
                  x={groupX + groupWidth / 2 + 4}
                  y={height - paddingY - forecastH}
                  width={barW}
                  height={forecastH}
                  fill="var(--accent-cyan)"
                  rx="4"
                />
                <text
                  x={groupX + groupWidth / 2 + barW / 2 + 4}
                  y={height - paddingY - forecastH - 6}
                  fill="var(--accent-cyan)"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {d.forecastDemand}
                </text>

                {/* Label */}
                <text
                  x={groupX + groupWidth / 2}
                  y={height - 10}
                  fill="var(--text-secondary)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {d.name}
                </text>

                {/* Warning if deficit */}
                {isStockDeficit && (
                  <text
                    x={groupX + groupWidth / 2}
                    y={height - paddingY - Math.max(currentH, forecastH) - 22}
                    fill="var(--warning)"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    Reorder +{d.forecastDemand - d.currentStock}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
