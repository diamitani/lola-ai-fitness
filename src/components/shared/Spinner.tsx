import { C, F } from '../../theme';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Lola is thinking...' }: SpinnerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 0',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: `3px solid ${C.roseLight}`,
          borderTopColor: C.rose,
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }}
      />
      <p style={{ fontFamily: F.display, fontSize: 18, color: C.muted }}>
        {label}
      </p>
    </div>
  );
}