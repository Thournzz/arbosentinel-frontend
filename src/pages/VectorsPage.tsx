// ══════════════════════════════════════════════════════════════════════════════
// VectorsPage.tsx — Caribbean Vector Intelligence
//
// Dr. Sandiford's primary research interest is vectors — this page is built
// specifically for her and the MCRU (Mosquito Control and Research Unit, UWI Mona).
//
// Shows:
//   • Caribbean mosquito vector species profiles (taxonomy, diseases, distribution)
//   • PAHO ARBO Portal surveillance bulletin links
//   • Recent field reports and publications from the region
//   • Jamaica-specific vector intelligence (incl. Sandiford et al. 2025)
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import DiseaseTag from '../components/standard/DiseaseTag'

// ── Vector species data ───────────────────────────────────────────────────────

interface VectorSpecies {
  id: string
  genus: string
  species: string
  commonName: string
  diseases: string[]         // disease keys for DiseaseTag
  distribution: string
  breedingHabitat: string
  bitingPattern: string
  caribbeanStatus: string
  jamaicaPresence: boolean
  riskLevel: 'high' | 'moderate' | 'low'
  notes?: string
}

const CARIBBEAN_VECTORS: VectorSpecies[] = [
  {
    id: 'ae_aegypti',
    genus: 'Aedes',
    species: 'aegypti',
    commonName: 'Yellow Fever Mosquito',
    diseases: ['dengue', 'zika', 'chikungunya'],
    distribution: 'Present across all Caribbean islands and tropical Americas',
    breedingHabitat: 'Small artificial water containers — tyres, flower pots, drums, gutters',
    bitingPattern: 'Daytime biter — peak activity 2 hrs after sunrise and before sunset',
    caribbeanStatus: 'Primary urban vector — endemic throughout the region',
    jamaicaPresence: true,
    riskLevel: 'high',
    notes: 'Primary target of MCRU vector control operations. Insecticide resistance documented in Caribbean populations.',
  },
  {
    id: 'ae_albopictus',
    genus: 'Aedes',
    species: 'albopictus',
    commonName: 'Asian Tiger Mosquito',
    diseases: ['dengue', 'chikungunya', 'zika'],
    distribution: 'Widespread in Caribbean, subtropical and temperate Americas',
    breedingHabitat: 'Natural containers (tree holes, leaf axils) and artificial containers',
    bitingPattern: 'Daytime biter — more aggressive than Ae. aegypti, bites outdoors',
    caribbeanStatus: 'Secondary vector — established in Jamaica and most Caribbean territories',
    jamaicaPresence: true,
    riskLevel: 'moderate',
    notes: 'More cold-tolerant than Ae. aegypti, enabling range expansion. Co-exists with primary vector in many Caribbean sites.',
  },
  {
    id: 'ae_vittatus',
    genus: 'Aedes',
    species: 'vittatus',
    commonName: 'Rock Pool Mosquito',
    diseases: [],
    distribution: 'Africa, South Asia — newly detected in Jamaica (2025)',
    breedingHabitat: 'Rock pools, tree holes, and natural water-holding cavities',
    bitingPattern: 'Daytime biter — aggressive feeder',
    caribbeanStatus: 'First confirmed detection in the Caribbean — Jamaica, 2025',
    jamaicaPresence: true,
    riskLevel: 'moderate',
    notes: 'Sandiford et al. (2025) Parasites & Vectors — first confirmed detection in Jamaica. Not a primary arboviral vector but co-occurrence with Ae. aegypti warrants heightened surveillance.',
  },
  {
    id: 'cx_quinquefasciatus',
    genus: 'Culex',
    species: 'quinquefasciatus',
    commonName: 'Southern House Mosquito',
    diseases: ['west_nile'],
    distribution: 'Pan-tropical — present throughout Caribbean and Americas',
    breedingHabitat: 'Polluted water — blocked drains, cesspits, sewage effluent',
    bitingPattern: 'Night biter — peak activity at dusk and overnight',
    caribbeanStatus: 'Endemic across all Caribbean territories',
    jamaicaPresence: true,
    riskLevel: 'moderate',
    notes: 'Also a vector for lymphatic filariasis (Wuchereria bancrofti) in the Caribbean — significant public health concern beyond arboviruses.',
  },
  {
    id: 'an_albimanus',
    genus: 'Anopheles',
    species: 'albimanus',
    commonName: 'White-footed Malaria Mosquito',
    diseases: ['malaria'],
    distribution: 'Caribbean and Central America — primary in Hispaniola (Haiti/Dominican Republic)',
    breedingHabitat: 'Sunlit, shallow water — rice fields, swamps, marshes',
    bitingPattern: 'Night biter — primarily outdoor feeder',
    caribbeanStatus: 'Main malaria vector in Caribbean — highest risk in Hispaniola',
    jamaicaPresence: false,
    riskLevel: 'low',
    notes: 'Jamaica is currently malaria-free but historical transmission occurred. Surveillance maintained given Hispaniola proximity.',
  },
]

// ── PAHO bulletin links ───────────────────────────────────────────────────────

interface BulletinLink {
  title: string
  source: string
  url: string
  date: string
  tag: string
}

const PAHO_BULLETINS: BulletinLink[] = [
  {
    title: 'Epidemiological Update: Dengue in the Americas',
    source: 'PAHO/WHO',
    url: 'https://www.paho.org/en/documents/epidemiological-update-dengue-americas-region-18-february-2026',
    date: 'February 2026',
    tag: 'DENGUE',
  },
  {
    title: 'PAHO ARBO Portal — Dengue Data & Analysis',
    source: 'PAHO ARBO Portal',
    url: 'https://www.paho.org/en/arbo-portal/dengue-data-and-analysis',
    date: 'Updated weekly',
    tag: 'DENGUE',
  },
  {
    title: 'PAHO ARBO Portal — Chikungunya Data & Analysis',
    source: 'PAHO ARBO Portal',
    url: 'https://www.paho.org/en/arbo-portal/chikungunya-data-and-analysis',
    date: 'Updated weekly',
    tag: 'CHIKUNGUNYA',
  },
  {
    title: 'PAHO ARBO Portal — Zika Data & Analysis',
    source: 'PAHO ARBO Portal',
    url: 'https://www.paho.org/en/arbo-portal/zika-data-and-analysis',
    date: 'Updated weekly',
    tag: 'ZIKA',
  },
  {
    title: 'Caribbean Subregional Arboviral Surveillance',
    source: 'PAHO — Caribbean Subregion',
    url: 'https://www.paho.org/en/arbo-portal/dengue-data-and-analysis/dengue-analysis-subregions',
    date: 'Updated weekly',
    tag: 'CARIBBEAN',
  },
]

// ── Field reports / publications ──────────────────────────────────────────────

interface FieldReport {
  title: string
  authors: string
  journal: string
  year: number
  significance: string
  tag: string
}

const FIELD_REPORTS: FieldReport[] = [
  {
    title: 'First confirmed detection of Aedes vittatus in Jamaica',
    authors: 'Sandiford, S. et al.',
    journal: 'Parasites & Vectors',
    year: 2025,
    significance: 'First record of this species in the Caribbean. Implications for arboviral surveillance protocols in Jamaica and the wider region.',
    tag: 'JAMAICA',
  },
  {
    title: 'Dengue virus serotype circulation in the Caribbean — PAHO surveillance',
    authors: 'PAHO Regional Office',
    journal: 'PAHO Epidemiological Bulletin',
    year: 2024,
    significance: 'Multi-serotype DENV circulation increases risk of severe dengue in previously exposed populations.',
    tag: 'CARIBBEAN',
  },
  {
    title: 'Aedes albopictus establishment and dengue transmission risk in the Caribbean',
    authors: 'CARPHA Vector Surveillance Programme',
    journal: 'Caribbean Public Health Agency',
    year: 2023,
    significance: 'Documents establishment of Ae. albopictus as a secondary vector across CARICOM territories.',
    tag: 'CARIBBEAN',
  },
]

// ── Risk colour helper ────────────────────────────────────────────────────────
const RISK_COLORS = {
  high:     'var(--risk-high)',
  moderate: 'var(--risk-moderate)',
  low:      'var(--risk-low)',
}

// ── Main page ─────────────────────────────────────────────────────────────────
const VectorsPage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="container page-content animate-fade-up">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">CARIBBEAN VECTOR INTELLIGENCE CENTRE</p>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Mosquito Vector Surveillance
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '660px', marginTop: '0.5rem' }}>
          Vector species profiles, PAHO regional surveillance bulletins, and field reports
          for the Caribbean. Primary focus: Jamaica and CARICOM territories. Data from PAHO
          ARBO Portal, CARPHA, and UWI Mona Mosquito Control and Research Unit (MCRU).
        </p>
      </div>

      {/* ── Vector species ───────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">CARIBBEAN VECTOR SPECIES PROFILES</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Primary mosquito vectors of arboviral disease in Jamaica and the Caribbean region.
          Click any species to expand the full profile.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {CARIBBEAN_VECTORS.map(v => {
            const isOpen = expanded === v.id
            const riskColor = RISK_COLORS[v.riskLevel]

            return (
              <div
                key={v.id}
                className="panel"
                style={{ borderLeft: `3px solid ${riskColor}`, cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : v.id)}
              >
                {/* Collapsed row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🦟</span>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                        {v.genus} {v.species}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                        — {v.commonName}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const }}>
                    {v.jamaicaPresence && (
                      <span style={{
                        fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
                        background: 'rgba(0,229,255,0.1)', color: 'var(--cyber-cyan)',
                        border: '1px solid rgba(0,229,255,0.3)', borderRadius: '20px',
                        padding: '2px 8px', letterSpacing: '0.08em',
                      }}>
                        JAMAICA
                      </span>
                    )}
                    {v.diseases.map(d => <DiseaseTag key={d} disease={d} size="sm" />)}
                    <span style={{
                      fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
                      color: riskColor, letterSpacing: '0.08em',
                    }}>
                      {v.riskLevel.toUpperCase()} RISK
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-dim)', paddingTop: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem 1.5rem' }}>
                      {[
                        { label: 'Distribution',      value: v.distribution },
                        { label: 'Breeding Habitat',  value: v.breedingHabitat },
                        { label: 'Biting Pattern',    value: v.bitingPattern },
                        { label: 'Caribbean Status',  value: v.caribbeanStatus },
                      ].map(row => (
                        <div key={row.label}>
                          <p className="section-label" style={{ marginBottom: '0.2rem' }}>{row.label}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{row.value}</p>
                        </div>
                      ))}
                    </div>
                    {v.notes && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.6rem 0.85rem',
                        background: 'rgba(0,229,255,0.03)',
                        border: '1px solid var(--border-dim)',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <p className="section-label" style={{ marginBottom: '0.2rem' }}>Field Notes</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{v.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── PAHO surveillance bulletins ──────────────────────────────────────── */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">PAHO REGIONAL SURVEILLANCE BULLETINS</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Active epidemiological updates from the Pan American Health Organization.
          These are the primary regional authority source for Caribbean arboviral surveillance data.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {PAHO_BULLETINS.map((b, i) => (
            <a
              key={i}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap' as const,
                  transition: 'border-color 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem' }}>📋</span>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0 }}>{b.title}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                      {b.source} · {b.date}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
                    background: 'rgba(0,229,255,0.08)', color: 'var(--teal-pulse)',
                    border: '1px solid rgba(0,229,255,0.25)', borderRadius: '20px',
                    padding: '2px 8px', letterSpacing: '0.08em',
                  }}>
                    {b.tag}
                  </span>
                  <span style={{ color: 'var(--teal-pulse)', fontSize: '0.75rem' }}>↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Field reports ────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-label">REGIONAL FIELD REPORTS & PUBLICATIONS</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Selected surveillance findings and peer-reviewed publications relevant to
          Caribbean vector ecology and arboviral transmission.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FIELD_REPORTS.map((r, i) => (
            <div key={i} className="panel" style={{ borderLeft: '3px solid var(--teal-pulse)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' as const }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>{r.title}</p>
                  <p style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--teal-pulse)', margin: '0 0 0.5rem' }}>
                    {r.authors} · <em>{r.journal}</em> · {r.year}
                  </p>
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {r.significance}
                  </p>
                </div>
                <span style={{
                  fontSize: '0.6rem', fontFamily: 'var(--font-mono)', flexShrink: 0,
                  background: 'rgba(0,191,165,0.08)', color: 'var(--teal-pulse)',
                  border: '1px solid rgba(0,191,165,0.25)', borderRadius: '20px',
                  padding: '2px 8px', letterSpacing: '0.08em', height: 'fit-content',
                }}>
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Data attribution ─────────────────────────────────────────────────── */}
      <div style={{
        padding: 'var(--space-md)',
        background: 'var(--void-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-dim)',
      }}>
        <p className="section-label">DATA & RESEARCH SOURCES</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.7 }}>
          <span style={{ color: 'var(--teal-pulse)' }}>PAHO ARBO Portal</span> — Pan American Health Organization Caribbean surveillance ·{' '}
          <span style={{ color: 'var(--teal-pulse)' }}>CARPHA</span> — Caribbean Public Health Agency vector surveillance ·{' '}
          <span style={{ color: 'var(--teal-pulse)' }}>UWI MCRU</span> — Mosquito Control and Research Unit, University of the West Indies, Mona ·{' '}
          <span style={{ color: 'var(--teal-pulse)' }}>Parasites & Vectors</span> — Sandiford et al. (2025)
        </p>
      </div>
    </div>
  )
}

export default VectorsPage
