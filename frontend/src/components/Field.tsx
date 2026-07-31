import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export default function Field({ label, error, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>{label}</label>
      {children}
      {error && <span style={{ color: '#ef4444', fontSize: '0.82rem' }}>{error}</span>}
    </div>
  );
}
