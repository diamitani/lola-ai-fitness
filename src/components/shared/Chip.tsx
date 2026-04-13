import { C, F } from '../../theme';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 15px',
        borderRadius: 22,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: F.body,
        transition: 'all 0.15s',
        background: selected ? C.rose : C.surface,
        color: selected ? '#fff' : C.text,
        border: `2px solid ${selected ? C.rose : C.border}`,
      }}
    >
      {label}
    </button>
  );
}