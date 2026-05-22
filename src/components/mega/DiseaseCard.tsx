// ══════════════════════════════════════════════════════════════════════════════
// DiseaseCard.tsx — MEGA (molecule) component
// Displays one disease entity with pathogen info, risk badge, and statistics.
//
// LEARNING NOTE — Truncate text pattern:
// CSS `display: -webkit-box; -webkit-line-clamp: 3; overflow: hidden;` limits
// a paragraph to N lines with "..." suffix. This keeps cards uniform height.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import DiseaseTag from '../standard/DiseaseTag'
import type { Disease } from '../../api/mockData'

interface DiseaseCardProps {
  disease: Disease
}

// Pathogen type → emoji icon
const PATHOGEN_ICON: Record<string, string> = {
  virus:    '🦠',
  parasite: '🔬',
  bacteria: '🧫',
}

const DiseaseCard: React.FC<DiseaseCardProps> = ({ disease }) => {
  // useState: local toggle for expanding the description
  // `expanded` = current state value; `setExpanded` = function to change it
  // React re-renders the component whenever state changes
  const [expanded, setExpanded] = useState(false)

  const riskColors = {
    low:      'var(--risk-low)',
    moderate: 'var(--risk-moderate)',
    high:     'var(--risk-high)',
    critical: 'var(--risk-critical)',
  }

  const borderColor = riskColors[disease.riskLevel]

  return (
    <div
      className="panel"
      style={{
        borderTop: `2px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'transform 0.2s ease',
        cursor: 'default',
      }}
      // CSS hover handled by global .panel:hover — box-shadow glow effect
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>{PATHOGEN_ICON[disease.pathogenType] ?? '🦟'}</span>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>{disease.name}</h3>
          </div>
          <p
            style={{
              fontSize: '0.7rem',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              marginTop: '0.2rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {disease.scientificName}
          </p>
        </div>
        <DiseaseTag disease={disease.name.toLowerCase()} size="sm" />
      </div>

      {/* ICD code + vector */}
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--teal-pulse)' }}>ICD-10:</span> {disease.icdCode}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--teal-pulse)' }}>Vector:</span>{' '}
          <em>{disease.primaryVector}</em>
        </span>
      </div>

      {/* Description with expand/collapse */}
      <p
        style={{
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          margin: 0,
          // Clamp to 3 lines when not expanded
          ...(expanded ? {} : {
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }),
        }}
      >
        {disease.description}
      </p>

      {/* Expand/collapse button */}
      <button
        onClick={() => setExpanded(prev => !prev)}  // Toggle: true→false, false→true
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--teal-pulse)',
          cursor: 'pointer',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          padding: 0,
          textAlign: 'left',
          letterSpacing: '0.05em',
        }}
      >
        {expanded ? '▲ SHOW LESS' : '▼ READ MORE'}
      </button>

      {/* Clinical detail — only visible when expanded */}
      {expanded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem 1.25rem',
            padding: '0.75rem',
            background: 'rgba(0, 229, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-dim)',
          }}
        >
          {disease.pathogenFamily && (
            <div>
              <p className="section-label" style={{ marginBottom: '0.15rem' }}>Family</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {disease.pathogenFamily}
              </p>
            </div>
          )}
          {disease.genomeType && (
            <div>
              <p className="section-label" style={{ marginBottom: '0.15rem' }}>Genome</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {disease.genomeType}
              </p>
            </div>
          )}
          {(disease.incubationMinDays != null || disease.incubationMaxDays != null) && (
            <div>
              <p className="section-label" style={{ marginBottom: '0.15rem' }}>Incubation</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--teal-pulse)', fontFamily: 'var(--font-mono)' }}>
                {disease.incubationMinDays ?? '?'}–{disease.incubationMaxDays ?? '?'} days
              </p>
            </div>
          )}
          {disease.firstIdentifiedYear && (
            <div>
              <p className="section-label" style={{ marginBottom: '0.15rem' }}>First Identified</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {disease.firstIdentifiedYear}
                {disease.firstIdentifiedLocation ? ` · ${disease.firstIdentifiedLocation}` : ''}
              </p>
            </div>
          )}
        </div>
      )}

      <hr className="divider" style={{ margin: '0.25rem 0' }} />

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
        <div>
          <div className="section-label">Global Cases</div>
          <div className="text-mono" style={{ color: borderColor, fontSize: '0.9rem', fontWeight: 700 }}>
            {disease.activeCasesGlobal >= 1_000_000
              ? `${(disease.activeCasesGlobal / 1_000_000).toFixed(1)}M`
              : disease.activeCasesGlobal >= 1_000
              ? `${(disease.activeCasesGlobal / 1_000).toFixed(0)}K`
              : disease.activeCasesGlobal.toString()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="section-label">Affected Countries</div>
          <div className="text-mono" style={{ color: 'var(--cyber-cyan)', fontSize: '0.9rem', fontWeight: 700 }}>
            {disease.affectedCountries}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiseaseCard
