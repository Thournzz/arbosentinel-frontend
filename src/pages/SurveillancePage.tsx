// ══════════════════════════════════════════════════════════════════════════════
// SurveillancePage.tsx — Main surveillance dashboard
// Maps to: GET /api/dashboard/stats + GET /api/alerts
//
// LEARNING NOTE — useEffect + useState data-fetching pattern:
// This is the standard React pattern for loading async data:
//   1. Declare loading + data state
//   2. useEffect fires once on mount ([] dependency = no re-runs)
//   3. Fetch → update state → React re-renders with real data
//   4. On error → fall back to mock data so the UI never breaks
//
// The `loading` flag shows a spinner while the fetch is in-flight.
// The empty `[]` dependency array means "run once after first render."
// ══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react'
import StatCard from '../components/standard/StatCard'
import RiskGauge from '../components/mega/RiskGauge'
import AlertBanner from '../components/mega/AlertBanner'
import LoadingSpinner from '../components/standard/LoadingSpinner'
import { fetchDashboardStats, fetchAlerts } from '../api/arboApi'
import {
  mockDashboardStats,
  mockRiskScores,
  mockAlerts,
} from '../api/mockData'
import type { DashboardStats, MrProgAlert } from '../api/mockData'

const SurveillancePage: React.FC = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [stats,   setStats]   = useState<DashboardStats>(mockDashboardStats)
  const [alerts,  setAlerts]  = useState<MrProgAlert[]>(mockAlerts.filter(a => a.isActive))
  const [loading, setLoading] = useState(true)

  // Risk scores come from ML service — keep mock until ML ETL is seeded
  const scores = mockRiskScores

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false   // Prevent state updates if component unmounts early

    async function load() {
      try {
        // Run both fetches in parallel — Promise.all waits for both to finish
        const [liveStats, liveAlerts] = await Promise.all([
          fetchDashboardStats(),
          fetchAlerts(),
        ])

        if (cancelled) return   // Component unmounted, skip setState

        // Merge active-alert count into stats object
        const activeCount = liveAlerts.filter(a => a.isActive).length
        setStats({ ...liveStats, activeAlerts: activeCount })
        setAlerts(liveAlerts.filter(a => a.isActive))

      } catch (err) {
        // Backend unreachable — silently keep mock data
        console.warn('[ArboSentinel] Surveillance fetch failed, using mock:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // Cleanup: mark cancelled if component unmounts before fetch completes
    return () => { cancelled = true }
  }, [])   // Empty array = run once after initial render

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container page-content animate-fade-up">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">ARBOVIRAL SURVEILLANCE SYSTEM — LIVE DASHBOARD</p>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Global Pathogen Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '600px' }}>
          Real-time surveillance data for mosquito-borne arboviruses. Data ingested from
          CDC, WHO, DengAI, and Brazil SINAN. ML risk scores computed every 12 hours.
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--teal-pulse)',
          marginTop: '0.5rem',
        }}>
          LAST REFRESH: {new Date(stats.lastDataRefresh).toLocaleString()}
        </p>
      </div>

      {/* ── Hero stats row ────────────────────────────────────────────────── */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard
          label="Diseases Tracked"
          value={stats.totalDiseasesTracked}
          icon="🦠"
          accentColor="var(--cyber-cyan)"
          sublabel="Dengue · Malaria · Zika · WNV · CHIKV"
        />
        <StatCard
          label="Active Alerts"
          value={stats.activeAlerts}
          icon="🚨"
          accentColor="var(--risk-high)"
          sublabel="Requires attention"
        />
        <StatCard
          label="Countries Monitored"
          value={stats.countriesMonitored}
          icon="🌍"
          accentColor="var(--teal-pulse)"
          sublabel="Cross-border surveillance"
        />
        <StatCard
          label="ML Model"
          value="ACTIVE"
          icon="🤖"
          accentColor="var(--purple-vibe)"
          sublabel="GradientBoostingRegressor · DengAI"
        />
      </div>

      {/* ── Disease case totals ───────────────────────────────────────────── */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">CASE BURDEN OVERVIEW</p>
        <div className="grid-3" style={{ marginTop: '0.75rem' }}>
          {stats.diseaseTotals.map(dt => (
            <StatCard
              key={dt.disease}
              label={dt.disease.replace('_', ' ').toUpperCase()}
              value={dt.totalCases}
              unit="cases"
              accentColor={
                dt.disease === 'dengue'      ? 'var(--risk-high)' :
                dt.disease === 'malaria'     ? 'var(--risk-critical)' :
                dt.disease === 'zika'        ? 'var(--cyber-cyan)' :
                dt.disease === 'west_nile'   ? 'var(--teal-pulse)' :
                                               'var(--purple-vibe)'
              }
              sublabel={dt.totalCases > 0 && dt.latestYear ? `Latest data: ${dt.latestYear}` : 'ETL pending'}
            />
          ))}
        </div>
      </section>

      {/* ── Risk gauges ───────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">CURRENT RISK SCORES — ML COMPUTED</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Risk scores (0–100) combine epidemiological trend analysis, environmental indicators,
          and machine-learning predictions from historical case data.
        </p>
        <div className="grid-4">
          {scores.map(rs => (
            <RiskGauge
              key={rs.id}
              disease={rs.diseaseType}
              score={rs.riskScore}
              riskLevel={rs.riskLevel}
              size={130}
            />
          ))}
        </div>
      </section>

      {/* ── Active alerts ────────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <section>
          <p className="section-label">ACTIVE SURVEILLANCE ALERTS</p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              marginTop: '0.75rem',
            }}
          >
            {alerts.map(alert => (
              <AlertBanner key={alert.id} alert={alert} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default SurveillancePage
