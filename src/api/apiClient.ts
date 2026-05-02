/// <reference types="vite/client" />
// ══════════════════════════════════════════════════════════════════════════════
// YELLOW layer — API client
// Single fetch wrapper used by all API functions.
//
// LEARNING NOTE — Vite environment variables:
// `import.meta.env.VITE_*` reads vars from .env / .env.production at BUILD time.
// In dev:  .env or .env.local (falls back to '' → Vite proxy forwards to :8080)
// In prod: .env.production → baked into the bundle at `vite build`
// NEVER expose secrets here — these are inlined in the JS bundle.
//
// Error strategy: throw on non-2xx. Pages catch and fall back to mock data
// so the UI never breaks if the backend is unreachable.
// ══════════════════════════════════════════════════════════════════════════════

const API_BASE: string = import.meta.env.VITE_API_URL ?? ''

// Shape every Spring Boot endpoint returns
interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
}

/**
 * Fetch a JSON endpoint and unwrap the { success, data } envelope.
 * Throws if the HTTP status is not 2xx.
 */
export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)

  if (!res.ok) {
    throw new Error(`API ${path} returned ${res.status}`)
  }

  const envelope: ApiEnvelope<T> = await res.json()
  return envelope.data
}
