// ══════════════════════════════════════════════════════════════════════════════
// MrProgWidget.tsx — GIGA (organism) component
// The AI alert widget — named after Mr. Prog from MegaMan Battle Network,
// the little programs that populate the Cyberworld and report anomalies.
//
// In ArboSentinel, MrProg is the alert engine: it scans risk scores and
// outputs situation reports when thresholds are breached.
//
// This widget floats in the bottom-right corner (fixed position) and
// bounces gently to draw attention to active alerts.
//
// LEARNING NOTE — fixed positioning:
// `position: fixed` removes an element from the document flow and pins it
// relative to the VIEWPORT (screen), not the page. It stays in place during scroll.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import AlertBanner from '../mega/AlertBanner'
import type { MrProgAlert } from '../../api/mockData'

interface MrProgWidgetProps {
  alerts: MrProgAlert[]
}

const MrProgWidget: React.FC<MrProgWidgetProps> = ({ alerts }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Count only active, non-resolved alerts
  const activeCount = alerts.filter(a => a.isActive && a.alertStatus === 'active').length
  const hasCritical = alerts.some(a => a.severity === 'critical' && a.isActive)

  return (
    <>
      {/* ── Floating trigger button ──────────────────────────────── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle alert panel"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 200,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: `2px solid ${hasCritical ? 'var(--risk-critical)' : 'var(--cyber-cyan)'}`,
          background: 'var(--void-surface)',
          cursor: 'pointer',
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasCritical
            ? '0 0 16px rgba(255, 23, 68, 0.5)'
            : '0 0 12px rgba(0, 229, 255, 0.3)',
          // bounce-float animation from index.css — gentle up-down motion
          animation: activeCount > 0 ? 'bounce-float 2.5s ease-in-out infinite' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        🤖

        {/* Alert count badge — only shown when there are active alerts */}
        {activeCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: hasCritical ? 'var(--risk-critical)' : 'var(--risk-high)',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              // boxShadow ensures the badge stands out against any background
              boxShadow: '0 0 6px rgba(0,0,0,0.8)',
            }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Alert panel (drawer) ─────────────────────────────────── */}
      {/* Conditional rendering: panel only exists in DOM when `isOpen` is true */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '4.5rem',
            right: '1.5rem',
            zIndex: 199,
            width: 'min(440px, calc(100vw - 3rem))',  // Responsive — never wider than viewport
            maxHeight: '70vh',
            overflowY: 'auto',
            background: 'var(--void-mid)',
            border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--glow-cyan), 0 8px 40px rgba(0,0,0,0.7)',
            animation: 'slide-in-right 0.3s ease forwards',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.7rem', margin: 0, letterSpacing: '0.15em' }}>
                🤖 MR.PROG ALERT ENGINE
              </h4>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontFamily: 'var(--font-mono)' }}>
                {activeCount} ACTIVE ALERTS
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <hr className="divider" style={{ margin: 0 }} />

          {/* Alert list */}
          {alerts.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
              No active alerts. Network secure. ✓
            </p>
          ) : (
            alerts.map(alert => (
              <AlertBanner key={alert.id} alert={alert} />
            ))
          )}
        </div>
      )}
    </>
  )
}

export default MrProgWidget
