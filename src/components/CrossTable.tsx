import type { CSSProperties } from 'react';
import type { FullSchedule } from '../types';
import { TEACHERS, SLOTS, DATES, STATUS_MAP } from '../data/constants';

const stickyLeft: CSSProperties = { position: 'sticky', left: 0, zIndex: 2, boxShadow: '2px 0 4px rgba(0,0,0,0.04)' };

interface CrossTableProps {
  schedule: FullSchedule;
}

export function CrossTable({ schedule }: CrossTableProps) {
  const cellSize = 28;
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid #F0ECE7', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ borderCollapse: 'collapse', width: 'max-content', minWidth: '100%' }}>
          <thead>
            <tr style={{ background: 'var(--navy)' }}>
              <th style={{ ...stickyLeft, background: 'var(--navy)', padding: '10px 8px', minWidth: 56 }}></th>
              {TEACHERS.map((t) => (
                <th key={t.id} colSpan={2} style={{ padding: '8px 4px', textAlign: 'center', color: 'white', fontSize: 11, fontWeight: 700, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <div>{t.avatar}</div>
                  <div>{t.short}</div>
                </th>
              ))}
            </tr>
            <tr style={{ background: '#1A3D66' }}>
              <th style={{ ...stickyLeft, background: '#1A3D66', padding: '4px 8px', fontSize: 10, color: '#7BA3CC', fontWeight: 600, textAlign: 'left' }}>日付</th>
              {TEACHERS.map((t) =>
                SLOTS.map((sl) => (
                  <th
                    key={`${t.id}_${sl.id}`}
                    style={{
                      padding: '4px 2px',
                      textAlign: 'center',
                      fontSize: 10,
                      color: '#7BA3CC',
                      fontWeight: 600,
                      width: cellSize + 8,
                      borderLeft: sl.id === 'day' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    }}
                  >
                    {sl.icon}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {DATES.map((d, di) => {
              const dc = d.isSunday ? '#EF4444' : d.isSaturday ? '#3B82F6' : 'var(--text)';
              if (d.isClosed) {
                return (
                  <tr key={d.key} style={{ background: '#ECEAE5' }}>
                    <td style={{ ...stickyLeft, background: '#ECEAE5', padding: '7px 8px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: dc }}>{d.date}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: dc, marginLeft: 2 }}>{d.day}</span>
                    </td>
                    <td colSpan={TEACHERS.length * SLOTS.length} style={{ textAlign: 'center', padding: '7px 4px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                      🏫 休校日
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={d.key} style={{ background: di % 2 === 0 ? 'white' : '#FDFCFA', borderBottom: '1px solid #F5F1EC' }}>
                  <td style={{ ...stickyLeft, background: di % 2 === 0 ? 'white' : '#FDFCFA', padding: '7px 8px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: dc }}>{d.date}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: dc, marginLeft: 2 }}>{d.day}</span>
                  </td>
                  {TEACHERS.map((t) =>
                    SLOTS.map((sl) => {
                      const v = schedule[t.id][`${d.key}_${sl.id}`];
                      const info = v ? STATUS_MAP[v] : null;
                      return (
                        <td key={`${t.id}_${sl.id}`} style={{ textAlign: 'center', padding: '4px 2px', borderLeft: sl.id === 'day' ? '1px solid #F0ECE7' : 'none' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: cellSize,
                              height: cellSize,
                              borderRadius: 8,
                              fontSize: info ? 16 : 12,
                              fontWeight: info ? 800 : 400,
                              color: info ? info.color : '#D5CFC8',
                              background: info ? info.bg : 'transparent',
                            }}
                          >
                            {info ? info.symbol : '—'}
                          </span>
                        </td>
                      );
                    }),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Staff count summary */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #F0ECE7', background: '#FDFCFA' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>📊 コマ別 出勤可能人数</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {DATES.map((d) => {
            if (d.isClosed) return null;
            const dc = d.isSunday ? '#EF4444' : d.isSaturday ? '#3B82F6' : 'var(--text)';
            return (
              <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: dc, minWidth: 40 }}>
                  {d.key}
                  <span style={{ fontSize: 9, marginLeft: 1 }}>{d.day}</span>
                </span>
                {SLOTS.map((sl) => {
                  const okCount = TEACHERS.filter((t) => schedule[t.id][`${d.key}_${sl.id}`] === 'ok').length;
                  const maybeCount = TEACHERS.filter((t) => schedule[t.id][`${d.key}_${sl.id}`] === 'maybe').length;
                  return (
                    <div
                      key={sl.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: okCount === 0 && maybeCount === 0 ? '#FEF2F2' : okCount >= 3 ? '#ECFDF5' : '#FFFBEB',
                        minWidth: 80,
                      }}
                    >
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sl.icon}</span>
                      <span style={{ fontWeight: 700, color: '#10B981' }}>◯{okCount}</span>
                      <span style={{ fontWeight: 600, color: '#F59E0B', fontSize: 11 }}>△{maybeCount}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
