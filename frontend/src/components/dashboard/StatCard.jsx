import React from 'react';
import { IconTrendingUp, IconTrendingDown } from '../common/Icons';

export function StatCard({ title, value, change, isPositive = true, icon, subtitle }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}
      </div>

      {(change || subtitle) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
          {change && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 600,
                color: isPositive ? 'var(--success)' : 'var(--danger)'
              }}
            >
              {isPositive ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
              {change}
            </span>
          )}
          {subtitle && (
            <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
