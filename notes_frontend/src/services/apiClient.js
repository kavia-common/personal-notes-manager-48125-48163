import { localStorageProvider } from './localStorageProvider';

/**
 * Resolve API base from environment in a way that works in browser builds
 * and during tests. We check both process.env and window.process.env (if present).
 */
function readEnv(name) {
  // CRA injects process.env.* at build-time. Some runtimes may attach under window.process.env.
  try {
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof window !== 'undefined' && window.process && window.process.env && window.process.env[name]) {
      return window.process.env[name];
    }
  } catch {
    // ignore
  }
  return undefined;
}

const RAW_API_BASE =
  readEnv('REACT_APP_API_BASE') ||
  readEnv('REACT_APP_BACKEND_URL') ||
  '';

/**
 * Normalize API base to empty string when unset/blank and trim spaces.
 */
const API_BASE = (RAW_API_BASE || '').toString().trim();

/**
 * Return true only if a non-empty API base is configured.
 */
function hasBackend() {
  return !!API_BASE;
}

/**
 * HTTP helper with robust error handling.
 * Throws on non-2xx responses. Caller decides fallback behavior.
 */
async function http(path, options = {}) {
  // Guard: never attempt network if no backend configured
  if (!hasBackend()) {
    throw new Error('NO_BACKEND_CONFIGURED');
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    if (res.status === 204) return null;
    // Res may not always be JSON; guard parsing
    try {
      return await res.json();
    } catch {
      return null;
    }
  } catch (err) {
    // Re-throw to allow upstream to fallback to localStorage
    throw err;
  }
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** Notes: { id, title, content, updatedAt } */
  listNotes: async () => {
    // Prefer backend when configured, but gracefully fallback if request fails
    if (!hasBackend()) return localStorageProvider.list();
    try {
      return await http('/notes', { method: 'GET' });
    } catch {
      return localStorageProvider.list();
    }
  },
  createNote: async (note) => {
    if (!hasBackend()) return localStorageProvider.create(note);
    try {
      return await http('/notes', { method: 'POST', body: JSON.stringify(note) });
    } catch {
      // fallback to local storage create
      return localStorageProvider.create(note);
    }
  },
  updateNote: async (id, updates) => {
    if (!hasBackend()) return localStorageProvider.update(id, updates);
    try {
      return await http(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    } catch {
      // fallback locally
      return localStorageProvider.update(id, updates);
    }
  },
  deleteNote: async (id) => {
    if (!hasBackend()) return localStorageProvider.delete(id);
    try {
      await http(`/notes/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      // fallback locally
      return localStorageProvider.delete(id);
    }
  },
  hasBackend,
};
