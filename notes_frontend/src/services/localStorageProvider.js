const STORAGE_KEY = 'notes_app_items_v1';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeAll(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export const localStorageProvider = {
  list: async () => readAll(),
  create: async (note) => {
    const all = readAll();
    all.push(note);
    writeAll(all);
    return note;
  },
  update: async (id, updates) => {
    const all = readAll();
    const idx = all.findIndex(n => n.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      writeAll(all);
      return all[idx];
    }
    return null;
  },
  delete: async (id) => {
    const all = readAll();
    const filtered = all.filter(n => n.id !== id);
    writeAll(filtered);
    return true;
  }
};
