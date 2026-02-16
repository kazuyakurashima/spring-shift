interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;
  return (
    <div
      className="toast"
      style={{
        position: 'fixed',
        top: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--navy)',
        color: 'white',
        padding: '10px 24px',
        borderRadius: 100,
        fontSize: 13,
        fontWeight: 500,
        zIndex: 200,
        boxShadow: '0 8px 32px rgba(15,43,76,0.3)',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}
