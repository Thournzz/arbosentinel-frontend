// ══════════════════════════════════════════════════════════════════════════════
// PathogenLibraryPage.tsx — Pathogen / Disease Library
// Maps to: GET /api/diseases
//
// LEARNING NOTE — useState with filter logic:
// `filter` is a string from the search input. We derive the displayed list
// by calling array.filter() on every render — no separate "filtered" state.
// This is intentional: derived state should NOT be stored in useState.
// If the source data changes or the filter changes, the displayed list
// automatically recalculates on the next render.
//
// Real data from the Railway backend via fetchDiseases().
// On error: falls back to mockDiseases — the UI is never broken.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react'
import DiseaseCard from '../components/mega/DiseaseCard'
import LoadingSpinner from '../components/standard/LoadingSpinner'
import { fetchDiseases } from '../api/arboApi'
import { mockDiseases } from '../api/mockData'
import type { Disease } from '../api/mockData'

const PathogenLibraryPage: React.FC = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [diseases, setDiseases] = useState<Disease[]>(mockDiseases)
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [pathogenFilter, setPathogenFilter] = useState<string>('all')

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDiseases()
      .then(setDiseases)
      .catch(err => console.warn('[ArboSentinel] Diseases fetch failed, using mock:', err))
      .finally(() => setLoading(false))
  }, [])

  // ── Derived filter — NOT stored in state ──────────────────────────────────
  // Recalculated on every render when search, filter, or diseases changes
  const visible = diseases.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.primaryVector.toLowerCase().includes(search.toLowerCase()) ||
      d.scientificName.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      pathogenFilter === 'all' || d.pathogenType === pathogenFilter

    return matchesSearch && matchesType
  })

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container page-content animate-fade-up">
      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">PATHOGEN INTELLIGENCE DATABASE</p>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Arboviral Pathogen Library</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '600px' }}>
          Curated profiles of mosquito-borne pathogens tracked by ArboSentinel.
          Data sourced from CDC, WHO, and peer-reviewed literature.
        </p>
      </div>

      {/* Search + filter bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: 'var(--space-lg)',
          flexWrap: 'wrap' as const,
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Search disease, vector, pathogen..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '220px',
            background: 'var(--void-surface)',
            border: '1px solid var(--border-dim)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />

        {(['all', 'virus', 'parasite'] as const).map(type => (
          <button
            key={type}
            onClick={() => setPathogenFilter(type)}
            className="btn-primary"
            style={{
              background: pathogenFilter === type ? 'rgba(0,229,255,0.15)' : 'transparent',
              boxShadow: pathogenFilter === type ? 'var(--glow-cyan)' : 'none',
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            marginLeft: 'auto',
          }}
        >
          {loading ? 'LOADING…' : `${visible.length}/${diseases.length} SHOWN`}
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
          <LoadingSpinner />
        </div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            No pathogens match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {visible.map(disease => (
            <DiseaseCard key={disease.id} disease={disease} />
          ))}
        </div>
      )}

      {/* Data attribution */}
      <div
        style={{
          marginTop: 'var(--space-2xl)',
          padding: 'var(--space-lg)',
          background: 'var(--void-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-dim)',
        }}
      >
        <p className="section-label">DATA SOURCES</p>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' as const, marginTop: '0.5rem' }}>
          {[
            { label: 'CDC',          desc: 'West Nile, Zika surveillance data' },
            { label: 'WHO',          desc: 'Global malaria & arbovirus reports' },
            { label: 'DengAI',       desc: 'Dengue forecasting competition dataset (San Juan + Iquitos)' },
            { label: 'Brazil SINAN', desc: 'National arbovirus notification system (dengue/Zika/CHIKV)' },
          ].map(src => (
            <div key={src.label}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--teal-pulse)' }}>
                {src.label}
              </span>
              <br />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{src.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PathogenLibraryPage
