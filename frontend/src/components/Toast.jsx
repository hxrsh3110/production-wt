import React from 'react';

export function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type || 'info'}`}
          onClick={() => onDismiss(toast.id)}
          role="alert"
          style={{ cursor: 'pointer' }}
        >
          <span>
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'info' && '⚡'}
          </span>
          <div>
            <strong>{toast.title || ''}</strong>
            <div>{toast.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toast;
