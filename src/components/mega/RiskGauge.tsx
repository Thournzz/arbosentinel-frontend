// ══════════════════════════════════════════════════════════════════════════════
// RiskGauge.tsx — MEGA (molecule) component
// Circular SVG gauge that visualises a risk score 0–100.
// Combines DiseaseTag atom + SVG gauge graphic + score display.
//
// LEARNING NOTE — SVG arc math:
//   • A circle with radius r has circumference = 2πr
//   • stroke-dasharray sets the dash pattern: [filled, gap]
//   • stroke-dashoffset shifts where the dash starts
//   • By setting dasharray = circumference and offset = circumference * (1 - ratio),
//     we reveal exactly `ratio` fraction of the circle arc.
// ══════════════════════════════════════════════════════════════════════════════

import React from 'react'
import DiseaseTag from '../standard/DiseaseTag'
import type { RiskLevel } from '../../api/mockData'

interface RiskGaugeProps {
  disease: string
  score: number       // 0–100
  riskLevel: RiskLevel
  size?: number       // SVG size in px
}

// Map risk level → color
const RISK_COLORS: Record<RiskLevel, string> = {
  low:      'var(--risk-low)',
  moderate: 'var(--risk-moderate)',
  high:     'var(--risk-high)',
  critical: 'var(--risk-critical)',
}

const RiskGauge: React.FC<RiskGaugeProps> = ({
  disease,
  score,
  riskLevel,
  size = 120,
}) => {
  const color = RISK_COLORS[riskLevel]

  // SVG circle geometry
  const cx = size / 2
  const cy = size / 2
  const r  = (size / 2) - 12   // radius, inset from edge for stroke width
  const circumference = 2 * Math.PI * r

  // How much arc to fill: score/100 fraction of full circumference
  const filled = (score / 100) * circumference
  const gap    = circumference - filled

  return (
    <div
      className="panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1.25rem 1rem',
      }}
    >
      {/* SVG gauge */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={8}
          />
          {/* Foreground arc — stroke-dasharray trick */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${gap}`}
            style={{
              // Drop shadow on the arc for glow effect
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: 'stroke-dasharray 0.8s ease',
            }}
          />
        </svg>

        {/* Score text centred inside the SVG using absolute positioning */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          <div
            className="text-mono"
            style={{
              fontSize: size > 100 ? '1.5rem' : '1.1rem',
              fontWeight: 700,
              color,
              textShadow: `0 0 12px ${color}`,
            }}
          >
            {score.toFixed(0)}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
            /100
          </div>
        </div>
      </div>

      {/* Disease label */}
      <DiseaseTag disease={disease} size="md" />

      {/* Risk level badge */}
      <span className={`badge badge-${riskLevel}`}>
        {riskLevel.toUpperCase()}
      </span>
    </div>
  )
}

export default RiskGauge
