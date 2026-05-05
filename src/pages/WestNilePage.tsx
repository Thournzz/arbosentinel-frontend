// ══════════════════════════════════════════════════════════════════════════════
// WestNilePage.tsx — West Nile Virus Intelligence
// Maps to: GET /api/westnile/annual + GET /api/westnile/hospitalizations
//
// Shows:
//   • 26-year annual case trend (1999–2024) — CDC historic surveillance
//   • Neuroinvasive vs non-neuroinvasive hospitalization breakdown
//   • Clinical and epidemiological context panels
// ══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react'
import DiseaseTag from '../components/standard/DiseaseTag'
import LoadingSpinner from '../components/standard/LoadingSpinner'
import { fetchWestNileAnnual, fetchWestNileHospitalizations } from '../api/arboApi'
import type { WnvAnnualRow, WnvHospRow } from '../api/arboApi'

// ── SVG Bar Chart (same architecture as DenguePage) ──────────────────────────
interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  width?: number
  height?: number
  defaultColor?: string
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 700,
  height = 180,
  defaultColor = 'var(--teal-pulse)',
}) => {
  if (data.length === 0) return null
  const PAD = { top: 24, right: 10, bottom: 34, left: 48 }
  const cW = width - PAD.left - PAD.right
  const cH = height - PAD.top - PAD.bottom
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barW = Math.max(4, cW / data.length - 3)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      <g transform={`translate(${PAD.left},${PAD.top})`}>
        {[0, 0.25, 0.5, 0.75, 1].map(r => {
          const y = cH * (1 - r)
          return (
            <g key={r}>
              <line x1={0} y1={y} x2={cW} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={-6} y={y + 4} fontSize={8} fill="var(--text-secondary)" textAnchor="end">
                {(maxVal * r).toFixed(0)}
              </text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const bH = Math.max(1, (d.value / maxVal) * cH)
          const x = i * (barW + 3)
          return (
            <g key={i}>
              <rect
                x={x} y={cH - bH}
                width={barW} height={bH}
                fill={d.color ?? defaultColor}
                opacity={0.8} rx={2}
              />
              {/* Label every 4 years */}
              {i % 4 === 0 && (
                <text x={x + barW / 2} y={cH + 14} fontSize={8} fill="var(--text-secondary)" textAnchor="middle">
                  {d.label}
                </text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// ── Grouped bar chart for neuroinvasive vs non-neuroinvasive ─────────────────
const StackedHospChart: React.FC<{ data: WnvHospRow[] }> = ({ data }) => {
  const sorted = [...data].sort((a, b) => a.year - b.year)
  const width = 700, height = 180
  const PAD = { top: 24, right: 10, bottom: 34, left: 48 }
  const cW = width - PAD.left - PAD.right
  const cH = height - PAD.top - PAD.bottom

  const maxVal = Math.max(...sorted.map(d => (d.neuroinvasiveCases ?? 0) + (d.nonNeuroinvasiveCases ?? 0)), 1)
  const barW = Math.max(8, cW / sorted.length - 4)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      <g transform={`translate(${PAD.left},${PAD.top})`}>
        {[0, 0.25, 0.5, 0.75, 1].map(r => {
          const y = cH * (1 - r)
          return (
            <g key={r}>
              <line x1={0} y1={y} x2={cW} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={-6} y={y + 4} fontSize={8} fill="var(--text-secondary)" textAnchor="end">
                {(maxVal * r).toFixed(0)}
              </text>
            </g>
          )
        })}

        {sorted.map((d, i) => {
          const neuro = d.neuroinvasiveCases ?? 0
          const nonNeuro = d.nonNeuroinvasiveCases ?? 0
          const total = neuro + nonNeuro
          const totalH = (total / maxVal) * cH
          const neuroH = (neuro / maxVal) * cH
          const x = i * (barW + 4)

          return (
            <g key={d.year}>
              {/* Non-neuroinvasive (bottom, teal) */}
              <rect x={x} y={cH - totalH + neuroH} width={barW} height={Math.max(0, totalH - neuroH)}
                fill="var(--teal-pulse)" opacity={0.6} rx={1} />
              {/* Neuroinvasive (top, red) */}
              <rect x={x} y={cH - totalH} width={barW} height={neuroH}
                fill="var(--risk-high)" opacity={0.8} rx={1} />
              {i % 3 === 0 && (
                <text x={x + barW / 2} y={cH + 14} fontSize={8} fill="var(--text-secondary)" textAnchor="middle">
                  {d.year}
                </text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const WestNilePage: React.FC = () => {
  const [annual,  setAnnual]  = useState<WnvAnnualRow[]>([])
  const [hosp,    setHosp]    = useState<WnvHospRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchWestNileAnnual().catch(() => []),
      fetchWestNileHospitalizations().catch(() => []),
    ]).then(([ann, hosp]) => {
      setAnnual(ann)
      setHosp(hosp)
    }).finally(() => setLoading(false))
  }, [])

  // Derived stats
  const sorted      = [...annual].sort((a, b) => a.year - b.year)
  const totalCases  = annual.reduce((s, r) => s + r.reportedCases, 0)
  const peak        = annual.reduce((mx, r) => r.reportedCases > (mx?.reportedCases ?? 0) ? r : mx, annual[0])
  const latestYear  = sorted[sorted.length - 1]

  const totalNeuro  = hosp.reduce((s, r) => s + (r.neuroinvasiveCases ?? 0), 0)
  const totalNonNeu = hosp.reduce((s, r) => s + (r.nonNeuroinvasiveCases ?? 0), 0)

  if (loading) {
    return (
      <div className="container page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container page-content animate-fade-up">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">WEST NILE VIRUS INTELLIGENCE CENTRE</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem' }}>West Nile Virus Surveillance</h1>
          <DiseaseTag disease="west_nile" size="md" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '660px', marginTop: '0.5rem' }}>
          Historic US surveillance data from the CDC (1999–2024). West Nile virus is the
          leading cause of mosquito-borne neurological disease in North America, transmitted
          primarily by <em>Culex</em> mosquitoes. No approved human vaccine exists.
        </p>
      </div>

      {/* ── Summary stats ────────────────────────────────────────────────── */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          {
            label: 'Total Cases (1999–2024)',
            value: totalCases.toLocaleString(),
            unit: 'reported nationwide',
            color: 'var(--teal-pulse)',
          },
          {
            label: 'Peak Outbreak Year',
            value: peak ? String(peak.year) : '—',
            unit: peak ? `${peak.reportedCases.toLocaleString()} cases` : '',
            color: 'var(--risk-critical)',
          },
          {
            label: 'Neuroinvasive Cases',
            value: totalNeuro.toLocaleString(),
            unit: 'encephalitis / meningitis',
            color: 'var(--risk-high)',
          },
          {
            label: 'Most Recent Data',
            value: latestYear ? String(latestYear.year) : '—',
            unit: latestYear ? `${latestYear.reportedCases.toLocaleString()} cases` : '',
            color: 'var(--cyber-cyan)',
          },
        ].map(s => (
          <div key={s.label} className="panel" style={{ borderTop: `2px solid ${s.color}` }}>
            <p className="section-label">{s.label}</p>
            <p className="text-mono" style={{ fontSize: '1.5rem', color: s.color, fontWeight: 700 }}>
              {s.value}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{s.unit}</p>
          </div>
        ))}
      </div>

      {/* ── Annual trend chart ───────────────────────────────────────────── */}
      <section className="panel" style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">ANNUAL REPORTED CASES — US NATIONWIDE (CDC, 1999–2024)</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          The 2002–2003 outbreak represented the largest arboviral epidemic in US history.
          Culex mosquito transmission peaks mid-July through September in temperate zones.
        </p>
        {sorted.length > 0 ? (
          <BarChart
            data={sorted.map(r => ({ label: String(r.year), value: r.reportedCases }))}
            defaultColor="var(--teal-pulse)"
          />
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            No annual data loaded — run the WNV ETL job.
          </p>
        )}
      </section>

      {/* ── Hospitalization breakdown ────────────────────────────────────── */}
      {hosp.length > 0 && (
        <section className="panel" style={{ marginBottom: 'var(--space-xl)' }}>
          <p className="section-label">CLINICAL SEVERITY BREAKDOWN — NEUROINVASIVE vs NON-NEUROINVASIVE</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' as const }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--risk-high)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Neuroinvasive (encephalitis / meningitis) — {totalNeuro.toLocaleString()} total
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--teal-pulse)', opacity: 0.6 }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Non-neuroinvasive (West Nile fever) — {totalNonNeu.toLocaleString()} total
              </span>
            </div>
          </div>
          <StackedHospChart data={hosp} />
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            Neuroinvasive disease accounts for approximately 40% of reported cases.
            Case fatality rate for neuroinvasive WNV: 8–10%. Elderly patients face disproportionate mortality risk.
          </p>
        </section>
      )}

      {/* ── Epidemiological context ──────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 'var(--space-xl)' }}>
        <div className="panel">
          <p className="section-label">TRANSMISSION</p>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1rem', marginTop: '0.5rem' }}>
            <li>Primary vector: <em>Culex pipiens</em>, <em>Culex quinquefasciatus</em></li>
            <li>Reservoir host: wild birds (corvids, raptors)</li>
            <li>Humans are dead-end hosts (no human-to-human transmission)</li>
            <li>Rare: blood transfusion, organ transplant, vertical transmission</li>
            <li>ICD-10 code: A92.3 (West Nile fever)</li>
          </ul>
        </div>
        <div className="panel">
          <p className="section-label">CLINICAL PROFILE</p>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1rem', marginTop: '0.5rem' }}>
            <li>80% of infections: asymptomatic</li>
            <li>20%: West Nile fever (fever, headache, myalgia, rash)</li>
            <li>&lt;1%: neuroinvasive (encephalitis, meningitis, flaccid paralysis)</li>
            <li>Incubation period: 2–14 days</li>
            <li>No approved antiviral treatment — supportive care only</li>
          </ul>
        </div>
      </section>

      {/* ── Data source attribution ──────────────────────────────────────── */}
      <div style={{
        padding: 'var(--space-md)',
        background: 'var(--void-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-dim)',
      }}>
        <p className="section-label">DATA SOURCE</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          <span style={{ color: 'var(--teal-pulse)' }}>CDC ArboNET Surveillance</span> — West Nile Virus Historic Data (1999–2024).
          Includes annual cases, hospitalization severity breakdown, state-level distribution, monthly
          patterns, and demographic incidence rates. Ingested via ArboSentinel ETL pipeline.
        </p>
      </div>
    </div>
  )
}

export default WestNilePage
