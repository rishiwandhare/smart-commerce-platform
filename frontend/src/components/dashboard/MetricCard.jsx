import React from 'react';

function MetricCard({ label, value, change, tone = 'primary' }) {
  return (
    <div className="metric-card glass-card">
      <div className="metric-topline">
        <span className="metric-label">{label}</span>
        <span className={`badge ${tone === 'success' ? 'badge-success' : tone === 'warning' ? 'badge-warning' : 'badge-primary'}`}>
          {change}
        </span>
      </div>
      <div className="metric-value">{value}</div>
    </div>
  );
}

export default MetricCard;
