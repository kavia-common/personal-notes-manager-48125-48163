import React from 'react';

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '';
  }
}

// PUBLIC_INTERFACE
export function NotesList({ notes, selectedId, onSelect }) {
  return (
    <div className="notes-list" role="list" aria-label="Notes list">
      {notes.length === 0 ? (
        <div className="empty-state">
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>No notes found</div>
            <div className="helper">Create a new note to get started.</div>
          </div>
        </div>
      ) : (
        notes.map(n => (
          <button
            key={n.id}
            className={`note-item ${selectedId === n.id ? 'active' : ''}`}
            role="listitem"
            onClick={() => onSelect(n.id)}
            aria-pressed={selectedId === n.id}
          >
            <div className="title">{n.title || 'Untitled'}</div>
            <div className="snippet">{(n.content || '').slice(0, 80) || 'No content'}</div>
            <div className="meta">Updated {formatDate(n.updatedAt)}</div>
          </button>
        ))
      )}
    </div>
  );
}
