import React from 'react';

// PUBLIC_INTERFACE
export function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No note selected</div>
        <div className="helper">Select or create a note to begin.</div>
      </div>
    </div>
  );
}
