# ArboSentinel Frontend

React + Vite + TypeScript frontend for the ArboSentinel arboviral intelligence platform.
MMBN3 void aesthetic — deep space dark, cyan data-stream accents.

---

## Setup

```bash
cd arbosentinel-frontend
npm install
npm run dev
```

Runs at `http://localhost:5175`

Requires Spring Boot backend on `http://localhost:9191` for live data.
Runs fully on mock data without the backend (current default).

---

## Pages

| Page | Route (state) | Description |
|------|---------------|-------------|
| Surveillance | `surveillance` | Hero stats, risk gauges, active alerts |
| Pathogen Library | `pathogens` | 5 disease profiles, search + filter |
| Dengue Intelligence | `dengue` | Weekly bar chart, ML prediction form |
| Pharmacology | `pharmacology` | Drug profiles with mechanism of action |
| About | `about` | Dedication to Dr. Sandiford, platform mission |

---

## Switching to Live API Data

Currently all data comes from `src/api/mockData.ts`.

To connect to the running backend, replace mock data calls with axios calls.
A base client is pre-configured in `src/api/client.ts` (not yet wired to pages).

The Vite dev proxy in `vite.config.ts` forwards `/api/*` to `http://localhost:9191` automatically — no CORS issues in development.

---

## Component Architecture (Chip Folder)

```
src/components/
  standard/   Atoms   — StatCard, DiseaseTag, LoadingSpinner
  mega/       Molecules — RiskGauge, AlertBanner, DiseaseCard
  giga/       Organisms — NavBar, MrProgWidget
src/pages/    Container layer — own data, pass props down
src/api/      mockData.ts + future axios clients
```

---

## Build for Production

```bash
npm run build
```

Output in `dist/`. Serve with any static host (Nginx, Netlify, Vercel, Railway).
Point the API proxy at the deployed Spring Boot URL in production.
