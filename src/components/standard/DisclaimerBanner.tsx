// ══════════════════════════════════════════════════════════════════════════════
// DisclaimerBanner.tsx — STANDARD (atom) component
// Legal and scope disclaimer for clinical/predictive content.
//
// WHY THIS EXISTS:
// ArboSentinel is a public health SURVEILLANCE and RESEARCH intelligence tool.
// It is not a clinical decision system. Displaying drug dosing, ML risk scores,
// or symptom profiles without this disclaimer creates legal liability —
// a qualified healthcare or public health professional must remain the decision-maker.
//
// Use `variant="clinical"` on pharmacology pages (drug dosing/interactions).
// Use `variant="predictive"` on ML prediction / risk score pages.
// Use `variant="general"` as a footer-level platform disclaimer.
// ══════════════════════════════════════════════════════════════════════════════

import React from 'react'

type DisclaimerVariant = 'clinical' | 'predictive' | 'general'

interface DisclaimerBannerProps {
  variant?: DisclaimerVariant
}

const DISCLAIMER_CONTENT: Record<DisclaimerVariant, { icon: string; heading: string; body: string }> = {
  clinical: {
    icon: '⚕',
    heading: 'Clinical Reference Only',
    body:
      'Drug information on this platform is provided for public health research and educational reference only. ' +
      'It does not constitute medical advice, a prescription, or a treatment recommendation. ' +
      'All clinical decisions — including drug selection, dosing, and management — must be made by a ' +
      'qualified healthcare professional in the context of individual patient assessment.',
  },
  predictive: {
    icon: '📊',
    heading: 'Epidemiological Estimates — Not Clinical Guidance',
    body:
      'Risk scores and ML predictions are statistical estimates derived from historical surveillance data. ' +
      'They are intended to support public health situational awareness, not to direct clinical or ' +
      'operational decisions independently. Outbreak response and intervention planning must involve ' +
      'qualified epidemiologists and public health authorities.',
  },
  general: {
    icon: '🛡',
    heading: 'Surveillance & Research Tool',
    body:
      'ArboSentinel is a public health surveillance and research intelligence platform. ' +
      'It is not a clinical diagnostic tool, prescribing aid, or substitute for professional ' +
      'public health or medical judgment. Data is sourced from CDC, WHO, DengAI, and Brazil SINAN ' +
      'and is intended for research, monitoring, and epidemiological awareness purposes only.',
  },
}

const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ variant = 'general' }) => {
  const { icon, heading, body } = DISCLAIMER_CONTENT[variant]

  return (
    <div
      role="note"
      aria-label="Platform disclaimer"
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        background: 'rgba(200, 168, 50, 0.06)',   // gold tint — cautionary, not alarming
        border: '1px solid rgba(200, 168, 50, 0.3)',
        borderLeft: '3px solid #C8A832',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-lg)',
      }}
    >
      <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
      <div>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            color: '#C8A832',
            margin: '0 0 0.3rem',
          }}
        >
          {heading.toUpperCase()}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          {body}
        </p>
      </div>
    </div>
  )
}

export default DisclaimerBanner
