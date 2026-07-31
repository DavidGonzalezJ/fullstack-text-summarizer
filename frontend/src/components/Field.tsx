import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export default function Field({ label, error, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{
        fontWeight: 500,
        fontSize: '0.875rem',
        color: '#374151',
        letterSpacing: '0.01em',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
