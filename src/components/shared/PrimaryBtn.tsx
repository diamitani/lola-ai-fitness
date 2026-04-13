import React from 'react';
import { C, F } from '../../theme';

interface PrimaryBtnProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export function PrimaryBtn({ onClick, disabled = false, children, style = {}, type = 'button' }: PrimaryBtnProps) {
  return (
    <button
      type={type}
      {...(onClick ? { onClick } : {})}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '17px',
        borderRadius: 16,
        background: disabled
          ? C.border
          : `linear-gradient(135deg, ${C.rose}, ${C.peach})`,
        color: disabled ? C.muted : '#fff',
        border: 'none',
        fontFamily: F.body,
        fontWeight: 700,
        fontSize: 16,
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: disabled ? 'none' : `0 8px 24px rgba(232,130,106,0.35)`,
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}