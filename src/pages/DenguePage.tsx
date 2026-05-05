// ══════════════════════════════════════════════════════════════════════════════
// DenguePage.tsx — Dengue Intelligence Centre
// Maps to: GET /api/dengue/weekly + POST /api/ml/run/dengue
//
// Shows:
//   • Weekly case trend as an SVG bar chart (custom, no charting library)
//   • A live ML prediction form
//   • City breakdown stats
//
// LEARNING NOTE — SVG data visualisation (no library):
// Building a bar chart manually teaches you what charting libraries do internally:
//   1. Determine the data domain (min/max values)
//   2. Scale values to fit the SVG coordinate space
//   3. Draw <rect> elements whose height is proportional to the value
//   4. Add <text> labels for axes
// This approach gives you full control and zero dependency overhead.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import DiseaseTag from '../components/standard/DiseaseTag'
import DisclaimerBanner from '../components/standard/DisclaimerBanner'
import { fetchDenguePrediction, type MlPredictionResult } from '../api/arboApi'
import { mockDengueWeekly } from '../api/mockData'

// ── Mini SVG bar chart ────────────────────────────────────────────────────────
interface BarChartProps {
  data: { label: string; value: number }[]
  width?: number
  height?: number
  color?: string
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 160,
  color = 'var(--cyber-cyan)',
}) => {
  if (data.length === 0) return null

  const PADDING = { top: 20, right: 10, bottom: 30, left: 40 }
  const chartW = width  - PADDING.left - PADDING.right
  const chartH = height - PADDING.top  - PADDING.bottom

  const maxVal = Math.max(...data.map(d => d.value))
  const barW   = chartW / data.length - 2   // 2px gap between bars

  return (
    // viewBox makes the SVG scale responsively to its container
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      aria-label="Dengue weekly cases bar chart"
    >
      <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>

        {/* Y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = chartH * (1 - ratio)
          return (
            <g key={ratio}>
              <line x1={0} y1={y} x2={chartW} y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={-8} y={y + 4}
                fontSize={9} fill="var(--text-secondary)" textAnchor="end">
                {Math.round(maxVal * ratio)}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          // Scale: bar height = (value / maxVal) * chartH
          const barH  = (d.value / maxVal) * chartH
          const x     = i * (barW + 2)
          const y     = chartH - barH

          return (
            <g key={i}>
              <rect
                x={x} y={y}
                width={barW} height={barH}
                fill={color}
                opacity={0.75}
                rx={2}
                style={{ transition: 'height 0.5s ease' }}
              />
              {/* X-axis label — only show every 5th to avoid clutter */}
              {i % 5 === 0 && (
                <text
                  x={x + barW / 2}
                  y={chartH + 14}
                  fontSize={8}
                  fill="var(--text-secondary)"
                  textAnchor="middle"
                >
                  W{d.label}
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
const DenguePage: React.FC = () => {
  // ML prediction form state — each field maps to a backend @RequestParam
  const [city,          setCity]         = useState<'sj' | 'iq'>('sj')
  const [weekOfYear,    setWeekOfYear]   = useState(30)
  const [avgTemp,       setAvgTemp]      = useState(28.5)
  const [precip,        setPrecip]       = useState(45.0)
  const [humidity,      setHumidity]     = useState(0.78)
  const [ndvi,          setNdvi]         = useState(0.42)
  const [prediction,    setPrediction]   = useState<MlPredictionResult | null>(null)
  const [predError,     setPredError]    = useState<string | null>(null)
  const [isLoading,     setIsLoading]    = useState(false)

  // Call Spring Boot → Python FastAPI → GradientBoostingRegressor
  const runPrediction = async () => {
    setIsLoading(true)
    setPrediction(null)
    setPredError(null)
    try {
      const result = await fetchDenguePrediction({
        city,
        weekOfYear,
        avgTempC:    avgTemp,
        precipMm:    precip,
        humidityPct: humidity,
        ndviNe:      ndvi,
      })
      setPrediction(result)
    } catch (err) {
      setPredError('Prediction service unavailable — check ML microservice status.')
      console.error('[ArboSentinel] ML prediction failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Prepare chart data from mock weekly stats (San Juan 2008)
  const sjData = mockDengueWeekly
    .filter(d => d.city === 'sj')
    .map(d => ({ label: String(d.weekOfYear), value: d.totalCases }))

  // Summary stats
  const totalCases = sjData.reduce((acc, d) => acc + d.value, 0)
  const peakWeek   = sjData.reduce((max, d) => d.value > max.value ? d : max, sjData[0])

  return (
    <div className="container page-content animate-fade-up">

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">DENGUE INTELLIGENCE CENTRE</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Dengue Fever Forecasting</h1>
          <DiseaseTag disease="dengue" size="md" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '600px', marginTop: '0.5rem' }}>
          ML-powered dengue case prediction for San Juan, PR (sj) and Iquitos, Peru (iq).
          Data: DengAI competition dataset (CDC/NOAA). Model: GradientBoostingRegressor.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Weekly Cases (SJ 2008 season)', value: totalCases.toLocaleString(), unit: 'total', color: 'var(--risk-high)' },
          { label: 'Peak Week', value: `Week ${peakWeek?.label ?? '-'}`, unit: `${peakWeek?.value ?? 0} cases`, color: 'var(--risk-critical)' },
          { label: 'Cities in Dataset', value: '2', unit: 'San Juan · Iquitos', color: 'var(--cyber-cyan)' },
        ].map(s => (
          <div key={s.label} className="panel" style={{ borderTop: `2px solid ${s.color}` }}>
            <p className="section-label">{s.label}</p>
            <p className="text-mono" style={{ fontSize: '1.6rem', color: s.color, fontWeight: 700 }}>{s.value}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Weekly trend chart */}
      <section className="panel" style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">WEEKLY DENGUE CASES — SAN JUAN 2008 (DENGAI)</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Peak transmission season: weeks 28–36 (July–September).
          Aligns with Caribbean rainy season and Aedes aegypti breeding conditions.
        </p>
        <BarChart data={sjData} color="rgba(255, 109, 0, 0.8)" />
      </section>

      {/* Predictive disclaimer — required before ML outputs */}
      <DisclaimerBanner variant="predictive" />

      {/* ML Prediction form */}
      <section className="panel">
        <p className="section-label">🤖 ML PREDICTION ENGINE — DENGUE CASE FORECAST</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Input climate variables to run the GradientBoostingRegressor model.
          In production this calls: <code style={{ color: 'var(--teal-pulse)' }}>POST /api/ml/run/dengue</code> →
          Python FastAPI → trained scikit-learn model.
        </p>

        {/* Form grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* City selector */}
          <div>
            <p className="section-label">City</p>
            <select
              value={city}
              onChange={e => setCity(e.target.value as 'sj' | 'iq')}
              style={{
                width: '100%',
                background: 'var(--void)',
                border: '1px solid var(--border-dim)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.75rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
              }}
            >
              <option value="sj">sj — San Juan, PR</option>
              <option value="iq">iq — Iquitos, Peru</option>
            </select>
          </div>

          {/* Week of year */}
          <div>
            <p className="section-label">Week of Year ({weekOfYear})</p>
            <input type="range" min={1} max={52} value={weekOfYear}
              onChange={e => setWeekOfYear(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--cyber-cyan)' }}
            />
          </div>

          {/* Avg Temp */}
          <div>
            <p className="section-label">Avg Temp °C ({avgTemp})</p>
            <input type="range" min={18} max={38} step={0.5} value={avgTemp}
              onChange={e => setAvgTemp(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--risk-high)' }}
            />
          </div>

          {/* Precipitation */}
          <div>
            <p className="section-label">Precip mm ({precip})</p>
            <input type="range" min={0} max={200} step={5} value={precip}
              onChange={e => setPrecip(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--teal-pulse)' }}
            />
          </div>

          {/* Humidity */}
          <div>
            <p className="section-label">Humidity {(humidity * 100).toFixed(0)}%</p>
            <input type="range" min={0.3} max={1.0} step={0.01} value={humidity}
              onChange={e => setHumidity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--cyber-cyan)' }}
            />
          </div>

          {/* NDVI */}
          <div>
            <p className="section-label">NDVI NE ({ndvi})</p>
            <input type="range" min={-0.5} max={0.9} step={0.01} value={ndvi}
              onChange={e => setNdvi(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--risk-low)' }}
            />
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Vegetation index (greenness) — higher = more Aedes habitat
            </p>
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={runPrediction}
          disabled={isLoading}
          className="btn-primary"
          style={{
            opacity: isLoading ? 0.5 : 1,
            background: isLoading ? 'rgba(123,47,255,0.1)' : 'transparent',
            borderColor: 'var(--purple-vibe)',
            color: 'var(--purple-vibe)',
          }}
        >
          {isLoading ? '⏳ RUNNING MODEL...' : '▶ RUN PREDICTION'}
        </button>

        {/* Error state */}
        {predError && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(204,34,34,0.08)',
            border: '1px solid rgba(204,34,34,0.4)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--risk-critical)',
          }}>
            ✕ {predError}
          </div>
        )}

        {/* Live ML prediction result */}
        {prediction !== null && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'rgba(123, 47, 255, 0.08)',
              border: '1px solid rgba(123, 47, 255, 0.4)',
              borderRadius: 'var(--radius-md)',
              animation: 'fade-up 0.3s ease forwards',
            }}
          >
            <p className="section-label">PREDICTION OUTPUT — LIVE GBR MODEL</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="text-mono" style={{ fontSize: '2.5rem', color: 'var(--purple-vibe)', fontWeight: 700 }}>
                {prediction.predictedCases}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                predicted cases — week {weekOfYear}, {city === 'sj' ? 'San Juan' : 'Iquitos'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' as const }}>
              <div>
                <p className="section-label">Risk Score</p>
                <p className="text-mono" style={{
                  fontSize: '1.1rem',
                  color: prediction.riskScore > 70 ? 'var(--risk-critical)'
                       : prediction.riskScore > 40 ? 'var(--risk-high)'
                       : 'var(--risk-low)',
                }}>
                  {Number(prediction.riskScore).toFixed(1)} / 100
                </p>
              </div>
              {prediction.confidencePercent != null && (
                <div>
                  <p className="section-label">Confidence</p>
                  <p className="text-mono" style={{ fontSize: '1.1rem', color: 'var(--teal-pulse)' }}>
                    {Number(prediction.confidencePercent).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              Model: {prediction.modelVersion ?? 'GradientBoostingRegressor'} · scikit-learn trained on DengAI.
              Inputs: temp={avgTemp}°C · precip={precip}mm · humidity={(humidity*100).toFixed(0)}% · NDVI={ndvi}.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default DenguePage
