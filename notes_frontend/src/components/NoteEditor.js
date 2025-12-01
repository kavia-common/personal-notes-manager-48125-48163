import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export function NoteEditor({ note, onChangeTitle, onChangeContent }) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (note && !note.title && titleRef.current) {
      titleRef.current.focus();
    }
  }, [note?.id]);

  if (!note) return null;

  return (
    <div className="editor-content" aria-label="Note Editor">
      <div>
        <label htmlFor="title" className="visually-hidden">Title</label>
        <input
          id="title"
          ref={titleRef}
          className="input title-input"
          placeholder="Title"
          value={note.title}
          onChange={e => onChangeTitle(e.target.value)}
          aria-label="Note title"
        />
      </div>
      <div>
        <label htmlFor="content" className="visually-hidden">Content</label>
        <textarea
          id="content"
          className="textarea"
          placeholder="Write your note here..."
          value={note.content}
          onChange={e => onChangeContent(e.target.value)}
          aria-label="Note content"
        />
        <div className="helper">Auto-saves. Markdown-friendly plain text.</div>
      </div>
    </div>
  );
}
