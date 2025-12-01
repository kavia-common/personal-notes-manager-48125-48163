import { localStorageProvider } from './localStorageProvider';

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  '';

function hasBackend() {
  return !!API_BASE;
}

async function http(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** Notes: { id, title, content, updatedAt } */
  listNotes: async () => {
    if (!hasBackend()) return localStorageProvider.list();
    return http('/notes', { method: 'GET' });
  },
  createNote: async (note) => {
    if (!hasBackend()) return localStorageProvider.create(note);
    return http('/notes', { method: 'POST', body: JSON.stringify(note) });
  },
  updateNote: async (id, updates) => {
    if (!hasBackend()) return localStorageProvider.update(id, updates);
    return http(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  },
  deleteNote: async (id) => {
    if (!hasBackend()) return localStorageProvider.delete(id);
    return http(`/notes/${id}`, { method: 'DELETE' });
  },
  hasBackend,
};
