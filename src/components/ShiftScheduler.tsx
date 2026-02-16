import { useState, useRef, useEffect, useCallback } from 'react';
import type { TeacherId, StatusKey, SlotId } from '../types';
import { TEACHERS, SLOTS, DATES, STATUS_MAP, TOTAL_SLOTS } from '../data/constants';
import { useShiftPreferences } from '../hooks/useShiftPreferences';
import { Toast } from './Toast';
import { ExportModal } from './ExportModal';
import { InputView } from './InputView';
import { SummaryView } from './SummaryView';

interface ShiftSchedulerProps {
  defaultTeacherId: TeacherId;
  onLogout: () => void;
}

export function ShiftScheduler({ defaultTeacherId, onLogout }: ShiftSchedulerProps) {
  const { schedule, loading, error, updatePreference, fillAllPreferences, getStats, refetch } = useShiftPreferences();
  const [activeTeacher, setActiveTeacher] = useState<TeacherId>(defaultTeacherId);
  const [view, setView] = useState<'input' | 'summary'>('input');
  const [toastState, setToastState] = useState({ visible: false, message: '' });
  const [exportModal, setExportModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const teacherBarRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastState({ visible: true, message: msg });
    setTimeout(() => setToastState({ visible: false, message: '' }), 1800);
  };

  const handleUpdateCell = useCallback(
    async (tid: TeacherId, cellKey: string, val: StatusKey | null) => {
      const [dateKey, slotId] = cellKey.split(/_(?=[^_]+$)/) as [string, SlotId];
      const errMsg = await updatePreference(tid, dateKey, slotId, val);
      if (errMsg) showToast(errMsg);
    },
    [updatePreference],
  );

  const handleFillAll = useCallback(
    async (tid: TeacherId, status: StatusKey | null) => {
      const errMsg = await fillAllPreferences(tid, status);
      if (errMsg) {
        showToast(errMsg);
      } else {
        const lbl = status === 'ok' ? '全て◯' : status === 'ng' ? '全て✕' : 'リセット';
        const teacher = TEACHERS.find((t) => t.id === tid);
        showToast(`${teacher?.short}先生 → ${lbl}`);
      }
    },
    [fillAllPreferences],
  );

  const switchTeacher = (id: TeacherId) => {
    setActiveTeacher(id);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (teacherBarRef.current) {
      const el = teacherBarRef.current.querySelector(`[data-teacher="${activeTeacher}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTeacher]);

  const buildExportText = () => {
    let text = '【春期講習 シフト希望一覧】\n期間：2026年3月25日〜4月4日\n\n';
    TEACHERS.forEach((t) => {
      text += `■ ${t.name} 先生\n`;
      const s = getStats(t.id);
      text += `  ◯${s.ok}  △${s.maybe}  ✕${s.ng}\n`;
      DATES.forEach((d) => {
        if (d.isClosed) return;
        SLOTS.forEach((sl) => {
          const v = schedule[t.id][`${d.key}_${sl.id}`];
          if (v) text += `  ${d.key}(${d.day}) ${sl.label} → ${STATUS_MAP[v].label}\n`;
        });
      });
      text += '\n';
    });
    return text;
  };

  const teacher = TEACHERS.find((t) => t.id === activeTeacher)!;
  const stats = getStats(activeTeacher);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌸</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#EF4444', marginBottom: 16 }}>{error}</div>
          <button
            onClick={refetch}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: 12,
              background: 'var(--navy)',
              color: 'white',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
        background: 'var(--cream)',
        minHeight: '100vh',
        maxWidth: 480,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--text)',
        paddingBottom: view === 'input' ? 'calc(80px + var(--safe-bottom))' : '20px',
        position: 'relative',
      }}
    >
      <Toast message={toastState.message} visible={toastState.visible} />
      {exportModal && <ExportModal text={buildExportText()} onClose={() => setExportModal(false)} />}

      {/* Header */}
      <div
        style={{
          background: 'var(--navy)',
          padding: '20px 20px 16px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 24px rgba(15,43,76,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: '#7BA3CC', fontWeight: 500, letterSpacing: 2, marginBottom: 2 }}>東進育英舎 日立校</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white', margin: 0 }}>🌸 春期講習シフト</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#7BA3CC', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, color: '#A8CFF0' }}>3/25 – 4/4</div>
              <div>2部制・全{TOTAL_SLOTS}コマ</div>
            </div>
            <button
              onClick={onLogout}
              style={{
                marginTop: 4,
                padding: '3px 8px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                background: 'transparent',
                color: '#7BA3CC',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              講師変更
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 3 }}>
          {([
            { key: 'input' as const, label: '入力', icon: '✏️' },
            { key: 'summary' as const, label: '一覧', icon: '📊' },
          ]).map((v) => (
            <button
              key={v.key}
              className="view-toggle"
              onClick={() => setView(v.key)}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 10,
                border: 'none',
                background: view === v.key ? 'white' : 'transparent',
                color: view === v.key ? 'var(--navy)' : '#7BA3CC',
                fontSize: 13,
                fontWeight: view === v.key ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: view === v.key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {view === 'input' ? (
          <InputView
            teacher={teacher}
            schedule={schedule}
            stats={stats}
            onUpdate={handleUpdateCell}
            onFillAll={handleFillAll}
          />
        ) : (
          <SummaryView schedule={schedule} getStats={getStats} onExport={() => setExportModal(true)} />
        )}
      </div>

      {/* Bottom Nav */}
      {view === 'input' && (
        <div
          ref={teacherBarRef}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid #ECEAE5',
            display: 'flex',
            justifyContent: 'center',
            padding: '8px 12px calc(8px + var(--safe-bottom))',
            gap: 4,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
            zIndex: 50,
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          {TEACHERS.map((t) => {
            const active = activeTeacher === t.id;
            const s = getStats(t.id);
            const done = s.filled === TOTAL_SLOTS;
            return (
              <button
                key={t.id}
                data-teacher={t.id}
                className="teacher-tab"
                onClick={() => switchTeacher(t.id)}
                style={{
                  flex: '0 0 auto',
                  minWidth: 64,
                  padding: '6px 10px 4px',
                  border: active ? '2px solid var(--navy)' : '2px solid transparent',
                  borderRadius: 14,
                  background: active ? 'var(--navy)' : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  position: 'relative',
                  WebkitAppearance: 'none',
                }}
              >
                <span style={{ fontSize: 20 }}>{t.avatar}</span>
                <span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? 'white' : 'var(--text-muted)' }}>
                  {t.short}
                </span>
                {s.filled > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 18,
                      height: 18,
                      borderRadius: 100,
                      background: done ? '#10B981' : 'var(--accent)',
                      color: 'white',
                      fontSize: 9,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      border: '2px solid white',
                    }}
                  >
                    {done ? '✓' : s.filled}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
