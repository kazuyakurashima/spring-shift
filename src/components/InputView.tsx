import type { TeacherId, Teacher, FullSchedule, StatusKey, TeacherStats } from '../types';
import { DATES, TOTAL_SLOTS } from '../data/constants';
import { ProgressBar } from './ProgressBar';
import { DateCard } from './DateCard';

interface InputViewProps {
  teacher: Teacher;
  schedule: FullSchedule;
  stats: TeacherStats;
  onUpdate: (teacherId: TeacherId, cellKey: string, value: StatusKey | null) => void;
  onFillAll: (teacherId: TeacherId, status: StatusKey | null) => void;
}

export function InputView({ teacher, schedule, stats, onUpdate, onFillAll }: InputViewProps) {
  return (
    <div style={{ padding: '16px 16px 0' }}>
      {/* Teacher Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg,var(--navy-light),var(--navy))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 4px 12px rgba(15,43,76,0.2)',
          }}
        >
          {teacher.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--navy)', marginBottom: 4 }}>
            {teacher.name}
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>先生</span>
          </div>
          <ProgressBar filled={stats.filled} total={TOTAL_SLOTS} />
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {([
          { status: 'ok' as const, label: '全て ◯', color: '#10B981', bg: '#ECFDF5' },
          { status: 'ng' as const, label: '全て ✕', color: '#EF4444', bg: '#FEF2F2' },
          { status: null, label: 'リセット', color: '#8B8680', bg: '#F5F1EC' },
        ] as const).map((a) => (
          <button
            key={a.label}
            className="action-btn"
            onClick={() => onFillAll(teacher.id, a.status)}
            style={{
              flex: 1,
              padding: '10px 6px',
              border: 'none',
              borderRadius: 10,
              background: a.bg,
              color: a.color,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Date Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
        {DATES.map((d, i) => (
          <DateCard key={d.key} dateInfo={d} schedule={schedule} teacherId={teacher.id} onUpdate={onUpdate} index={i} />
        ))}
      </div>
    </div>
  );
}
