import { apiClient } from '../services/apiClient';
import { debounce } from '../utils/debounce';

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export class NotesStore {
  constructor() {
    this.subscribers = new Set();
    this.state = {
      notes: [],
      selectedId: null,
      loading: false,
      query: '',
      sort: 'updatedAt_desc',
    };
    this.debouncedPersist = debounce(() => {
      // Trigger save of selected note if any updated.
      // apiClient.updateNote internally falls back to localStorage when no backend
      // is configured or when the network request fails.
      const note = this.getSelected();
      if (note) {
        apiClient.updateNote(note.id, note).catch(() => {});
      }
    }, 600);
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  notify() {
    for (const fn of this.subscribers) fn(this.state);
  }

  set(partial) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  async init() {
    this.set({ loading: true });
    try {
      const notes = await apiClient.listNotes();
      // Sort newest first
      notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      const selectedId = notes[0]?.id || null;
      this.set({ notes, selectedId, loading: false });
    } catch (e) {
      // As an extra guard (though apiClient already falls back),
      // ensure we never leave the app in an error state.
      try {
        const notes = await apiClient.listNotes(); // this will fallback internally to localStorage
        notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        const selectedId = notes[0]?.id || null;
        this.set({ notes, selectedId, loading: false });
      } catch {
        // Absolute fallback: empty state
        this.set({ notes: [], selectedId: null, loading: false });
      }
    }
  }

  getSelected() {
    return this.state.notes.find(n => n.id === this.state.selectedId) || null;
  }

  select(id) {
    this.set({ selectedId: id });
  }

  async create() {
    const now = Date.now();
    const note = {
      id: uuid(),
      title: 'Untitled',
      content: '',
      updatedAt: now,
    };
    // Optimistic
    const notes = [note, ...this.state.notes];
    this.set({ notes, selectedId: note.id });
    try {
      await apiClient.createNote(note);
    } catch {
      // ignore for now
    }
  }

  async remove(id) {
    const notes = this.state.notes.filter(n => n.id !== id);
    const selectedId =
      this.state.selectedId === id ? (notes[0]?.id || null) : this.state.selectedId;
    this.set({ notes, selectedId });
    try {
      await apiClient.deleteNote(id);
    } catch {
      // ignore
    }
  }

  updateSelected(updates, { debounceSave = true } = {}) {
    const { notes, selectedId } = this.state;
    if (!selectedId) return;
    const idx = notes.findIndex(n => n.id === selectedId);
    if (idx === -1) return;
    const updated = {
      ...notes[idx],
      ...updates,
      updatedAt: Date.now(),
    };
    const next = [...notes];
    next[idx] = updated;
    // Keep sorting by updatedAt desc
    next.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    this.set({ notes: next, selectedId: updated.id });
    if (debounceSave) this.debouncedPersist(); else apiClient.updateNote(updated.id, updated).catch(() => {});
  }

  setQuery(q) {
    this.set({ query: q });
  }

  filtered() {
    const { notes, query } = this.state;
    if (!query) return notes;
    const q = query.toLowerCase();
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  }
}

// PUBLIC_INTERFACE
export const notesStore = new NotesStore();
