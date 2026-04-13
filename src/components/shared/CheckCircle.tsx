import { C } from '../../theme';

interface CheckCircleProps {
  done: boolean;
}

export function CheckCircle({ done }: CheckCircleProps) {
  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        flexShrink: 0,
        background: done ? C.green : 'transparent',
        border: `2px solid ${done ? C.green : C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {done && (
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );
}