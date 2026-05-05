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
 * GET a JSON endpoint and unwrap the { success, data } envelope.
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

/**
 * POST to a JSON endpoint (with optional query params) and unwrap the envelope.
 * Used for ML prediction — Spring Boot takes @RequestParam, not @RequestBody.
 */
export async function apiPost<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = params
    ? `${API_BASE}${path}?${new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()}`
    : `${API_BASE}${path}`

  const res = await fetch(url, { method: 'POST' })

  if (!res.ok) {
    throw new Error(`API POST ${path} returned ${res.status}`)
  }

  const envelope: ApiEnvelope<T> = await res.json()
  return envelope.data
}
