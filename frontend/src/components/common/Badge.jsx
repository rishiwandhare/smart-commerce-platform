import React from 'react';

export function Badge({ children, variant = 'neutral', icon = null, className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
}
