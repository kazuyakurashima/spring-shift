interface ProgressBarProps {
  filled: number;
  total: number;
}

export function ProgressBar({ filled, total }: ProgressBarProps) {
  const pct = total > 0 ? (filled / total) * 100 : 0;
  const done = filled === total && filled > 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: '#E8E4DF', borderRadius: 100, overflow: 'hidden' }}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 100,
            background: done
              ? 'linear-gradient(90deg,#10B981,#34D399)'
              : 'linear-gradient(90deg,var(--accent),#F59E0B)',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          minWidth: 50,
          textAlign: 'right',
          color: done ? '#10B981' : 'var(--text-muted)',
        }}
      >
        {filled}/{total}
      </span>
    </div>
  );
}
