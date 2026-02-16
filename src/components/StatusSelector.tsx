import type { StatusKey, Slot } from '../types';
import { STATUSES } from '../data/constants';

interface StatusSelectorProps {
  value: StatusKey | null;
  onChange: (v: StatusKey | null) => void;
  slotInfo: Slot;
}

export function StatusSelector({ value, onChange, slotInfo }: StatusSelectorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 0' }}>
      <div style={{ fontSize: 18, width: 32, textAlign: 'center', flexShrink: 0 }}>{slotInfo.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 1 }}>{slotInfo.tag}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{slotInfo.label}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {STATUSES.map((st) => {
          const active = value === st.key;
          return (
            <button
              key={st.key}
              className="status-btn"
              onClick={() => onChange(active ? null : st.key)}
              style={{
                width: 52,
                height: 48,
                border: active ? `2px solid ${st.border}` : '2px solid transparent',
                borderRadius: 12,
                background: active ? st.activeBg : 'var(--warm-gray)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                padding: 0,
                boxShadow: active ? `0 2px 12px ${st.color}22` : 'none',
                WebkitAppearance: 'none',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: active ? 20 : 17, fontWeight: 800, color: active ? st.color : '#C4BFB8', lineHeight: 1 }}>
                {st.symbol}
              </span>
              <span style={{ fontSize: 9, fontWeight: 600, color: active ? st.color : '#B0AAA3', lineHeight: 1 }}>
                {st.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
