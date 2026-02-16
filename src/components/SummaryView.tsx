import type { FullSchedule, TeacherId } from '../types';
import { TEACHERS, TOTAL_SLOTS } from '../data/constants';
import { CrossTable } from './CrossTable';

interface SummaryViewProps {
  schedule: FullSchedule;
  getStats: (tid: TeacherId) => { ok: number; maybe: number; ng: number; filled: number };
  onExport: () => void;
}

export function SummaryView({ schedule, getStats, onExport }: SummaryViewProps) {
  return (
    <div style={{ padding: '16px 12px 20px' }}>
      <button
        className="action-btn"
        onClick={onExport}
        style={{
          width: '100%',
          padding: '14px',
          border: 'none',
          borderRadius: 14,
          background: 'var(--navy)',
          color: 'white',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 16,
          boxShadow: '0 4px 16px rgba(15,43,76,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        📋 テキストで出力（LINE等に共有）
      </button>

      <CrossTable schedule={schedule} />

      {/* Per-teacher chips */}
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {TEACHERS.map((t) => {
          const s = getStats(t.id);
          const pct = TOTAL_SLOTS > 0 ? Math.round((s.filled / TOTAL_SLOTS) * 100) : 0;
          return (
            <div key={t.id} style={{ flex: '1 1 calc(50% - 4px)', padding: '10px 12px', background: 'white', borderRadius: 14, border: '1px solid #F0ECE7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{t.avatar}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)' }}>{t.short}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: pct === 100 ? '#10B981' : 'var(--text-muted)' }}>{pct}%</span>
              </div>
              <div style={{ display: 'flex', gap: 6, fontSize: 12 }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>◯{s.ok}</span>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>△{s.maybe}</span>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>✕{s.ng}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
