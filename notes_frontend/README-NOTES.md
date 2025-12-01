# Notes Frontend (Personal Notes Manager)

A modern, lightweight React SPA for creating, editing, searching, and deleting personal notes.

## Features
- Ocean Professional theme (blue/amber, rounded corners, subtle shadows)
- App Shell: Header, Sidebar (search + list), Main Editor
- Create, edit, delete notes
- Debounced auto-save with optimistic updates
- Sort by last updated; search by title/content
- Persists to localStorage (no backend required)
- API client reads REACT_APP_API_BASE (or REACT_APP_BACKEND_URL) and gracefully falls back to localStorage

## Run Locally
1. Install dependencies:
   npm install

2. Start development server:
   npm start

3. Open http://localhost:3000

## Environment Variables (optional)
- REACT_APP_API_BASE: Base URL for future backend API (if unset, app uses localStorage)
- REACT_APP_BACKEND_URL: Alternative base URL recognized by the API client

No other env vars are required for the app to run.

## Accessibility
- Labeled inputs and aria attributes on controls
- Keyboard focus states and high-contrast buttons

## File Structure
- src/App.js – main app shell and layout
- src/styles.css – theme variables and global styles
- src/components/ – UI components (Header, Sidebar, NotesList, NoteEditor, EmptyState, Modal)
- src/state/notesStore.js – app state, actions, and debounced persistence
- src/services/apiClient.js – backend API client with localStorage fallback
- src/services/localStorageProvider.js – localStorage CRUD
- src/utils/debounce.js – debounce helper
