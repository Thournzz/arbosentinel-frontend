// ──────────────────────────────────────────────────────────────────────────────
// main.tsx — Application entry point
//
// LEARNING NOTE:
// This file has ONE job: mount the React app into the <div id="root"> in index.html.
// Everything else (routing, state, components) lives in App.tsx and below.
//
// StrictMode: wraps your app and intentionally renders components twice in
// development to surface side-effects in useEffect. Doesn't affect production.
// ──────────────────────────────────────────────────────────────────────────────

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'   // Global styles — loaded once, affects entire app

// ReactDOM.createRoot: the modern React 18 way to mount.
// The "!" is TypeScript's non-null assertion — we KNOW root exists because
// index.html guarantees <div id="root"> is there.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
