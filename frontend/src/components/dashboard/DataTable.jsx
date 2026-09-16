import React from 'react';

export function DataTable({ columns = [], data = [], keyField = 'id', emptyMessage = 'No records found' }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  padding: '1rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                  textAlign: col.align || 'left',
                  width: col.width || 'auto'
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row[keyField] || rowIdx}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={col.key || colIdx}
                  style={{
                    padding: '1rem 1.25rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    textAlign: col.align || 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
