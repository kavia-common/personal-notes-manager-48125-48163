import React from 'react';
import { NotesList } from './NotesList';

// PUBLIC_INTERFACE
export function Sidebar({ query, onQueryChange, notes, selectedId, onSelect }) {
  return (
    <aside className="sidebar" aria-label="Notes Sidebar">
      <div className="search">
        <label htmlFor="search" className="visually-hidden">Search notes</label>
        <input
          id="search"
          className="input"
          type="search"
          placeholder="Search notes..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <NotesList notes={notes} selectedId={selectedId} onSelect={onSelect} />
    </aside>
  );
}
