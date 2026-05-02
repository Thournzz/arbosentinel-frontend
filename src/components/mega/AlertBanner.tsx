// ══════════════════════════════════════════════════════════════════════════════
// AlertBanner.tsx — MEGA (molecule) component
// Renders an active MrProgAlert with severity-matched styling.
// "MrProg" is our internal name for the AI alert engine — named after the
// MegaMan Battle Network character who monitors network threats.
//
// LEARNING NOTE:
// This shows the pattern of "conditional className composition" — instead of
// a giant if/else, we use a lookup object (SEVERITY_META) to map a string key
// to all its visual properties at once. This is far easier to extend than
// a long switch statement.
// ══════════════════════════════════════════════════════════════════════════════

import React from 'react'
import type { MrProgAlert, RiskLevel } from '../../api/mockData'

interface AlertBannerProps {
  alert: MrProgAlert
}

const SEVERITY_META: Record<RiskLevel, { icon: string; borderColor: string; bg: string }> = {
  low:      { icon: '🟢', borderColor: 'var(--risk-low)',      bg: 'rgba(0,230,118,0.06)' },
  moderate: { icon: '🟡', borderColor: 'var(--risk-moderate)', bg: 'rgba(255,234,0,0.06)' },
  high:     { icon: '🟠', borderColor: 'var(--risk-high)',     bg: 'rgba(255,109,0,0.08)' },
  critical: { icon: '🔴', borderColor: 'var(--risk-critical)', bg: 'rgba(255,23,68,0.08)'  },
}

// Helper: format ISO date string → "Apr 25, 2026"
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alert }) => {
  const meta = SEVERITY_META[alert.severity] ?? SEVERITY_META.moderate

  return (
    <div
      style={{
        background: meta.bg,
        border: `1px solid ${meta.borderColor}`,
        borderLeft: `4px solid ${meta.borderColor}`,  // Thicker left accent — visual hierarchy
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        animation: 'fade-up 0.4s ease forwards',
      }}
    >
      {/* Header row: icon + title + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem' }}>{meta.icon}</span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              color: meta.borderColor,
              fontWeight: 600,
            }}
          >
            {alert.alertTitle}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
          }}
        >
          {formatDate(alert.triggeredAt)}
        </span>
      </div>

      {/* Body text */}
      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {alert.alertBody}
      </p>

      {/* Footer: disease tag + status badge */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {alert.diseaseType && (
          <span
            className="badge"
            style={{
              background: 'rgba(0,229,255,0.1)',
              color: 'var(--cyber-cyan)',
              border: '1px solid var(--cyber-cyan)',
            }}
          >
            {alert.diseaseType.toUpperCase()}
          </span>
        )}
        <span className={`badge badge-${alert.severity}`}>
          {alert.severity.toUpperCase()}
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            marginLeft: 'auto',
          }}
        >
          STATUS: {alert.alertStatus.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export default AlertBanner
