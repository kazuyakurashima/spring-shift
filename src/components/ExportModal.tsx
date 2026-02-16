import { useRef, useEffect } from 'react';

interface ExportModalProps {
  text: string;
  onClose: () => void;
}

export function ExportModal({ text, onClose }: ExportModalProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  const selectAll = () => {
    if (textRef.current) {
      textRef.current.focus();
      textRef.current.select();
      textRef.current.setSelectionRange(0, 99999);
    }
  };

  useEffect(() => {
    setTimeout(selectAll, 150);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px calc(20px + env(safe-area-inset-bottom,0px))',
          width: '100%',
          maxWidth: 480,
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--navy)', fontFamily: 'inherit' }}>
            📋 シフト希望テキスト
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 100,
              border: 'none',
              background: 'var(--warm-gray)',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: 1.5, fontFamily: 'inherit' }}>
          下のテキストを<strong>全選択→コピー</strong>して、LINEやメールに貼り付けてください
        </p>
        <button
          onClick={selectAll}
          style={{
            padding: '10px',
            border: 'none',
            borderRadius: 10,
            background: 'var(--navy)',
            color: 'white',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 10,
            fontFamily: 'inherit',
          }}
        >
          📌 テキストを全選択する
        </button>
        <textarea
          ref={textRef}
          readOnly
          value={text}
          style={{
            flex: 1,
            minHeight: 200,
            padding: 14,
            borderRadius: 12,
            border: '1px solid #E8E4DF',
            background: '#FAFAF8',
            fontSize: 12,
            lineHeight: 1.7,
            color: 'var(--text)',
            fontFamily: "'Zen Kaku Gothic New', monospace",
            resize: 'none',
            outline: 'none',
            WebkitUserSelect: 'text',
            userSelect: 'text',
          }}
        />
      </div>
    </div>
  );
}
