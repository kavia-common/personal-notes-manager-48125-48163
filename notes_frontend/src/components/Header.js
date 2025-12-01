import React from 'react';

// PUBLIC_INTERFACE
export function Header({ onCreate, onDelete, canDelete }) {
  /** Header with gradient background and primary actions */
  return (
    <header className="app-header" aria-label="Application Header">
      <div className="title" aria-label="App Title">
        <span className="dot" aria-hidden="true" />
        <span>Notes Manager</span>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onCreate} aria-label="Create note">
          + New Note
        </button>
        <button
          className="btn btn-danger"
          onClick={onDelete}
          aria-label="Delete selected note"
          disabled={!canDelete}
          style={{ opacity: canDelete ? 1 : 0.6, cursor: canDelete ? 'pointer' : 'not-allowed' }}
        >
          Delete
        </button>
      </div>
    </header>
  );
}
