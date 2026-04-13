import React from 'react';
import { C } from '../../theme';

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

export function Section({ label, children }: SectionProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p
        style={{
          fontWeight: 700,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: C.muted,
          marginBottom: 9,
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}