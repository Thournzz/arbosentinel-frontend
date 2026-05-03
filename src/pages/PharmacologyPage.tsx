// ══════════════════════════════════════════════════════════════════════════════
// PharmacologyPage.tsx — Pharmacology & Treatment Intelligence
// Maps to: GET /api/pharmacology/drugs
//
// LEARNING NOTE — enriched API data:
// The real API returns richer clinical detail than mock data:
//   dosingAdult, dosingPediatric, keyInteractions, contraindications
// We use the ApiPharmDrug type (from arboApi.ts) which carries these extra fields.
// The detail panel now displays them — mock data never had this depth.
//
// Disease filter is hidden when data comes from live API (indication data
// requires a separate /drugs/disease/{id} call per disease — Phase 2).
// WHO filter still works — that flag is present on every drug record.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react'
import DiseaseTag from '../components/standard/DiseaseTag'
import LoadingSpinner from '../components/standard/LoadingSpinner'
import DisclaimerBanner from '../components/standard/DisclaimerBanner'
import { fetchDrugs } from '../api/arboApi'
import type { ApiPharmDrug } from '../api/arboApi'
import { mockDrugs } from '../api/mockData'

// Adapt mock drugs to ApiPharmDrug shape for consistent rendering
function mockToApi(m: typeof mockDrugs[0]): ApiPharmDrug {
  return {
    id:                  m.id,
    genericName:         m.genericName,
    drugClass:           null,
    mechanismOfAction:   m.mechanismOfAction,
    dosingAdult:         null,
    dosingPediatric:     null,
    keyInteractions:     null,
    contraindications:   null,
    whoEssentialMedicine: m.whoEssentialMedicine,
    interactionWarning:  m.interactionWarning,
    indications:         null,
  }
}

const PharmacologyPage: React.FC = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [drugs,       setDrugs]       = useState<ApiPharmDrug[]>(mockDrugs.map(mockToApi))
  const [loading,     setLoading]     = useState(true)
  const [showWhoOnly, setShowWhoOnly] = useState(false)
  const [selected,    setSelected]    = useState<ApiPharmDrug | null>(null)

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDrugs()
      .then(setDrugs)
      .catch(err => console.warn('[ArboSentinel] Drugs fetch failed, using mock:', err))
      .finally(() => setLoading(false))
  }, [])

  // ── Derived filter ────────────────────────────────────────────────────────
  const visible = drugs.filter(d => !showWhoOnly || d.whoEssentialMedicine)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container page-content animate-fade-up">

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p className="section-label">PHARMACOLOGICAL INTELLIGENCE — ARBOVIRAL THERAPEUTICS</p>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Treatment & Drug Database
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '700px' }}>
          Drug profiles for mosquito-borne disease management. Data cross-referenced with
          WHO Essential Medicines List and peer-reviewed clinical literature.
          Mechanism of action annotations provided for clinical reference.
        </p>
      </div>

      {/* Clinical disclaimer — required wherever dosing/interactions are shown */}
      <DisclaimerBanner variant="clinical" />

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: 'var(--space-lg)',
          flexWrap: 'wrap' as const,
          alignItems: 'center',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
        }}>
          {loading ? 'LOADING…' : `${visible.length} DRUGS`}
        </span>

        {/* WHO Essential toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: showWhoOnly ? 'var(--teal-pulse)' : 'var(--text-secondary)',
          }}
        >
          <input
            type="checkbox"
            checked={showWhoOnly}
            onChange={e => setShowWhoOnly(e.target.checked)}
            style={{ accentColor: 'var(--teal-pulse)' }}
          />
          WHO ESSENTIAL ONLY
        </label>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
          <LoadingSpinner />
        </div>
      ) : (
        /* Two-column layout: drug list + detail panel */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Drug list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {visible.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                No drugs match current filters.
              </p>
            )}
            {visible.map(drug => (
              <button
                key={drug.id}
                onClick={() => setSelected(selected?.id === drug.id ? null : drug)}
                style={{
                  background: selected?.id === drug.id
                    ? 'rgba(0, 229, 255, 0.08)'
                    : 'var(--void-surface)',
                  border: selected?.id === drug.id
                    ? '1px solid var(--cyber-cyan)'
                    : '1px solid var(--border-dim)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.9rem 1.1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: selected?.id === drug.id ? 'var(--glow-cyan)' : 'none',
                }}
              >
                {/* Drug name + badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.03em',
                      margin: 0,
                    }}>
                      {drug.genericName}
                    </p>
                    {drug.drugClass && (
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontStyle: 'italic' }}>
                        {drug.drugClass}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap' as const }}>
                    {drug.whoEssentialMedicine && (
                      <span className="badge" style={{
                        background: 'rgba(0,191,165,0.15)',
                        color: 'var(--teal-pulse)',
                        border: '1px solid var(--teal-pulse)',
                      }}>WHO EML</span>
                    )}
                    {drug.interactionWarning && (
                      <span className="badge" style={{
                        background: 'rgba(255,109,0,0.12)',
                        color: 'var(--risk-high)',
                        border: '1px solid var(--risk-high)',
                      }}>⚠ INTERACTION</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel — shows when a drug is selected */}
          {selected ? (
            <div
              className="panel"
              style={{
                position: 'sticky',
                top: '70px',
                alignSelf: 'start',
                animation: 'slide-in-right 0.3s ease forwards',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.1rem' }}>
                {selected.genericName}
              </h3>
              {selected.drugClass && (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1rem' }}>
                  {selected.drugClass}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '1rem' }}>
                {selected.whoEssentialMedicine && (
                  <span className="badge" style={{ background: 'rgba(0,191,165,0.15)', color: 'var(--teal-pulse)', border: '1px solid var(--teal-pulse)' }}>
                    ✓ WHO ESSENTIAL MEDICINE
                  </span>
                )}
                {selected.interactionWarning && (
                  <span className="badge badge-high">⚠ DRUG INTERACTION WARNING</span>
                )}
              </div>

              {/* Mechanism of Action */}
              {selected.mechanismOfAction && (
                <>
                  <p className="section-label">Mechanism of Action</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    {selected.mechanismOfAction}
                  </p>
                </>
              )}

              {/* Adult Dosing */}
              {selected.dosingAdult && (
                <>
                  <p className="section-label">Adult Dosing</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {selected.dosingAdult}
                  </p>
                </>
              )}

              {/* Paediatric Dosing */}
              {selected.dosingPediatric && (
                <>
                  <p className="section-label">Paediatric Dosing</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {selected.dosingPediatric}
                  </p>
                </>
              )}

              {/* Key Interactions */}
              {selected.keyInteractions && (
                <>
                  <p className="section-label" style={{ color: 'var(--risk-high)' }}>⚠ Key Interactions</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {selected.keyInteractions}
                  </p>
                </>
              )}

              {/* Contraindications */}
              {selected.contraindications && (
                <>
                  <p className="section-label" style={{ color: 'var(--risk-critical)' }}>✕ Contraindications</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {selected.contraindications}
                  </p>
                </>
              )}

              {/* Disease tags — shown for mock data which has indicatedFor */}
              {'indicatedFor' in selected && Array.isArray((selected as any).indicatedFor) && (selected as any).indicatedFor.length > 0 && (
                <>
                  <p className="section-label" style={{ marginTop: '1rem' }}>Indicated For</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, marginTop: '0.5rem' }}>
                    {(selected as any).indicatedFor.map((d: string) => (
                      <DiseaseTag key={d} disease={d} size="md" />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                border: '1px dashed var(--border-dim)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-secondary)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'center' }}>
                ← SELECT A DRUG<br />to view clinical detail
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PharmacologyPage
