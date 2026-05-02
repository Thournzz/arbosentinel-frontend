// ══════════════════════════════════════════════════════════════════════════════
// DiseaseTag.tsx — STANDARD (atom) component
// A small colour-coded pill badge that identifies a disease type.
//
// LEARNING NOTE:
// Record<string, CSSProperties> is a TypeScript utility type meaning:
// "an object whose keys are strings and values are CSSProperties objects".
// This creates a type-safe lookup table (dictionary pattern) for the color map.
// ══════════════════════════════════════════════════════════════════════════════

import React, { CSSProperties } from 'react'

type DiseaseKey = 'dengue' | 'malaria' | 'zika' | 'west_nile' | 'chikungunya' | string

// ── Color map: disease → visual style ────────────────────────────────────────
// Each entry has a background (rgba with low opacity) and a text color.
// Using rgba allows the tag to work on any background.
const DISEASE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  dengue:      { bg: 'rgba(255, 109,   0, 0.15)', color: '#ff6d00', label: 'DENGUE' },
  malaria:     { bg: 'rgba(255,  23,  68, 0.15)', color: '#ff1744', label: 'MALARIA' },
  zika:        { bg: 'rgba(  0, 229, 255, 0.12)', color: '#00e5ff', label: 'ZIKA' },
  west_nile:   { bg: 'rgba(  0, 191, 165, 0.15)', color: '#00bfa5', label: 'WEST NILE' },
  chikungunya: { bg: 'rgba(123,  47, 255, 0.15)', color: '#7b2fff', label: 'CHIKUNGUNYA' },
}

const DEFAULT_STYLE = { bg: 'rgba(128,128,128,0.15)', color: '#aaa', label: '' }

interface DiseaseTagProps {
  disease: DiseaseKey
  size?: 'sm' | 'md'
}

const DiseaseTag: React.FC<DiseaseTagProps> = ({ disease, size = 'sm' }) => {
  // Normalize: 'DENGUE' → 'dengue'. Optional chaining + toLowerCase is safe even if null
  const key = disease?.toLowerCase().replace(' ', '_') ?? ''
  const style = DISEASE_STYLES[key] ?? { ...DEFAULT_STYLE, label: disease.toUpperCase() }

  const fontSize = size === 'md' ? '0.75rem' : '0.65rem'
  const padding  = size === 'md' ? '3px 12px' : '2px 8px'

  return (
    <span
      style={{
        display: 'inline-block',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.color}`,
        borderRadius: '20px',
        padding,
        fontSize,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em',
        fontWeight: 600,
        // whiteSpace: nowrap prevents "WEST" and "NILE" from wrapping to separate lines
        whiteSpace: 'nowrap' as CSSProperties['whiteSpace'],
      }}
    >
      {style.label}
    </span>
  )
}

export default DiseaseTag
