import type { TeacherId } from '../types';
import { TEACHERS } from '../data/constants';

interface TeacherSelectProps {
  onSelect: (id: TeacherId) => void;
}

export function TeacherSelect({ onSelect }: TeacherSelectProps) {
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
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--navy)',
          padding: '32px 20px 28px',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 24px rgba(15,43,76,0.15)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 10, color: '#7BA3CC', fontWeight: 500, letterSpacing: 2, marginBottom: 4 }}>東進育英舎 日立校</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: '0 0 4px' }}>🌸 春期講習シフト</h1>
        <div style={{ fontSize: 12, color: '#7BA3CC' }}>3/25 – 4/4 ・ 2部制</div>
      </div>

      {/* Teacher Selection */}
      <div style={{ padding: '24px 20px', flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', textAlign: 'center', margin: '0 0 20px' }}>
          あなたの名前を選んでください
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TEACHERS.map((t) => (
            <button
              key={t.id}
              className="action-btn"
              onClick={() => onSelect(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                border: '1px solid #F0ECE7',
                borderRadius: 16,
                background: 'white',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                WebkitAppearance: 'none',
              }}
            >
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
                  flexShrink: 0,
                }}
              >
                {t.avatar}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>先生</div>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 18 }}>→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
