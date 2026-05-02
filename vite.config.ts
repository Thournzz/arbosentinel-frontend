// ──────────────────────────────────────────────────────────────────────────────
// YELLOW layer — Vite build configuration
// vite.config.ts defines HOW the project is built & served in dev mode.
// `defineConfig` gives TypeScript type-checking for the config object.
// ──────────────────────────────────────────────────────────────────────────────
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugins: array of Vite plugins.
  // @vitejs/plugin-react enables JSX transform + Fast Refresh (hot reload).
  plugins: [react()],

  server: {
    port: 5175,   // Dev server port — 5173/5174 taken by other projects
    host: true,   // Bind to 0.0.0.0 so Claude Preview tool can reach it

    // proxy: forward /api calls to Spring Boot so we can develop against real data.
    // In mock-data mode (current), the frontend never actually calls these — but
    // the proxy is ready for when the backend is running on :8080.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,   // Rewrites the Host header to match the target
      },
    },
  },
})
