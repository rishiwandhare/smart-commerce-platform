import React from 'react';
import { usePreferences } from '../../context/UserPreferencesContext';
import { IconCheck, IconAlertTriangle, IconX } from './Icons';

export function Toast() {
  const { toastMessage } = usePreferences();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        background: 'var(--bg-surface-elevated)',
        color: 'var(--text-primary)',
        border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isSuccess ? 'var(--success-light)' : 'var(--primary-light)',
          color: isSuccess ? 'var(--success)' : 'var(--primary)'
        }}
      >
        {isSuccess ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
      </div>
      <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
        {toastMessage.message}
      </span>
    </div>
  );
}
