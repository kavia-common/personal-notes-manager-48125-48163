import React, { useEffect, useState } from 'react';
import './styles.css';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';
import { EmptyState } from './components/EmptyState';
import { Modal } from './components/Modal';
import { notesStore } from './state/notesStore';

// PUBLIC_INTERFACE
function App() {
  /** This is the SPA entry with header, sidebar, and editor layout. */
  const [state, setState] = useState(notesStore.state);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const unsub = notesStore.subscribe(setState);
    notesStore.init();
    return unsub;
  }, []);

  const selected = notesStore.getSelected();

  const handleCreate = () => notesStore.create();
  const handleDelete = () => {
    if (!selected) return;
    setShowConfirm(true);
  };
  const confirmDelete = () => {
    if (selected) notesStore.remove(selected.id);
    setShowConfirm(false);
  };

  return (
    <div className="app-shell">
      <Header
        onCreate={handleCreate}
        onDelete={handleDelete}
        canDelete={!!selected}
      />
      <div className="layout">
        <Sidebar
          query={state.query}
          onQueryChange={q => notesStore.setQuery(q)}
          notes={notesStore.filtered()}
          selectedId={state.selectedId}
          onSelect={id => notesStore.select(id)}
        />
        <main className="main" aria-label="Main content">
          <div className="editor-header">
            <div style={{ fontWeight: 600 }}>
              {selected ? (selected.title || 'Untitled') : 'Welcome'}
            </div>
            <div className="helper">
              {selected ? 'Editing note' : 'Create a note to get started'}
            </div>
          </div>
          {selected ? (
            <NoteEditor
              note={selected}
              onChangeTitle={(v) => notesStore.updateSelected({ title: v })}
              onChangeContent={(v) => notesStore.updateSelected({ content: v })}
            />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      {showConfirm && (
        <Modal
          title="Delete note?"
          description="This action cannot be undone."
          confirmText="Delete"
          confirmVariant="danger"
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default App;
