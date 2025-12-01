import React from 'react';

// PUBLIC_INTERFACE
export function Modal({ title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, confirmVariant = 'danger' }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className="title" id="modal-title">{title}</div>
        {description && <div className="helper">{description}</div>}
        <div className="actions">
          <button className="btn" onClick={onCancel} aria-label="Cancel">{cancelText}</button>
          <button
            className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
