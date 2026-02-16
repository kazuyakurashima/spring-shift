import type { DateInfo, TeacherId, FullSchedule, StatusKey } from '../types';
import { SLOTS } from '../data/constants';
import { StatusSelector } from './StatusSelector';

interface DateCardProps {
  dateInfo: DateInfo;
  schedule: FullSchedule;
  teacherId: TeacherId;
  onUpdate: (teacherId: TeacherId, cellKey: string, value: StatusKey | null) => void;
  index: number;
}

export function DateCard({ dateInfo, schedule, teacherId, onUpdate, index }: DateCardProps) {
  const dayColor = dateInfo.isSunday ? '#EF4444' : dateInfo.isSaturday ? '#3B82F6' : 'var(--text)';

  if (dateInfo.isClosed) {
    return (
      <div
        className="date-card"
        style={{
          background: '#ECEAE5',
          borderRadius: 'var(--radius)',
          padding: '14px 16px',
          border: '1px solid #E0DCD6',
          animationDelay: `${index * 0.03}s`,
          opacity: 0.7,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#EF4444', lineHeight: 1 }}>{dateInfo.date}</span>
          <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 700 }}>{dateInfo.day}曜日</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{dateInfo.month}月</span>
          <span
            style={{
              marginLeft: 'auto',
              background: 'var(--navy)',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 8,
            }}
          >
            🏫 休校日
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="date-card"
      style={{
        background: 'white',
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        animationDelay: `${index * 0.03}s`,
        border: '1px solid #F0ECE7',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: dayColor, lineHeight: 1 }}>{dateInfo.date}</span>
        <span style={{ fontSize: 13, color: dayColor, fontWeight: 700 }}>{dateInfo.day}曜日</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{dateInfo.month}月</span>
      </div>
      {SLOTS.map((sl, i) => (
        <div key={sl.id}>
          {i > 0 && <div style={{ height: 1, background: '#F5F1EC', margin: '2px 0' }} />}
          <StatusSelector
            value={schedule[teacherId]?.[`${dateInfo.key}_${sl.id}`] ?? null}
            onChange={(v) => onUpdate(teacherId, `${dateInfo.key}_${sl.id}`, v)}
            slotInfo={sl}
          />
        </div>
      ))}
    </div>
  );
}
