// ══════════════════════════════════════════════════════════════════════════════
// StatCard.tsx — STANDARD (atom) component
// Chip Folder tier: Standard Chip — small, single-purpose, reusable everywhere
//
// LEARNING NOTE:
// This is a "dumb" / "presentational" component — it has no state, no side
// effects. It just receives props and renders UI. That makes it easy to test
// and reuse. Props are typed with a TypeScript interface for compile-time safety.
//
// React.FC<Props> = Function Component that receives Props. The generic <Props>
// tells TypeScript exactly what shape the props object must have.
// ══════════════════════════════════════════════════════════════════════════════

import React from 'react'

// ── Props interface ───────────────────────────────────────────────────────────
interface StatCardProps {
  label: string           // Short label — e.g. "Active Alerts"
  value: string | number  // The big number or value to display
  unit?: string           // Optional unit — e.g. "countries", "%"
  accentColor?: string    // CSS color value — defaults to cyber-cyan
  icon?: string           // Optional emoji icon
  sublabel?: string       // Optional smaller secondary text below value
}

// ── Component ────────────────────────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  accentColor = 'var(--cyber-cyan)',  // Default if caller doesn't specify
  icon,
  sublabel,
}) => {
  return (
    <div
      className="panel"
      style={{
        // Unique border-top highlight per color — each stat card feels distinct
        borderTop: `2px solid ${accentColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow blob — purely decorative, reinforces the accent color */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: accentColor,
          opacity: 0.06,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
        <span className="section-label">{label}</span>
      </div>

      {/* Value — the headline number */}
      <div
        className="text-mono"
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: accentColor,
          lineHeight: 1,
          // text-shadow creates a subtle glow matching the accent
          textShadow: `0 0 20px ${accentColor}60`,
        }}
      >
        {/* Format numbers with commas for readability */}
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && (
          <span
            style={{
              fontSize: '0.85rem',
              marginLeft: '0.25rem',
              opacity: 0.7,
              fontFamily: 'var(--font-body)',
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Sublabel — optional context below the value */}
      {sublabel && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}

export default StatCard
