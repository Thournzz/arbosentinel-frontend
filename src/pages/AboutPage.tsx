// ══════════════════════════════════════════════════════════════════════════════
// AboutPage.tsx — About ArboSentinel
// Platform overview and research context for the UWI MCRU
// ══════════════════════════════════════════════════════════════════════════════

import React from 'react'

const AboutPage: React.FC = () => {
  return (
    <div className="container page-content animate-fade-up">

      {/* ── Platform header ───────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(123,47,255,0.07))',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 3rem',
          marginBottom: 'var(--space-2xl)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.12), transparent)',
          pointerEvents: 'none',
        }} />

        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--teal-pulse)', letterSpacing: '0.2em', marginBottom: '0.75rem',
        }}>
          DEVELOPED FOR
        </p>

        <h1 style={{
          fontSize: '1.8rem', marginBottom: '0.5rem',
          background: 'linear-gradient(90deg, var(--cyber-cyan), var(--purple-vibe))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Mosquito Control and Research Unit
        </h1>

        <p style={{ color: 'var(--teal-pulse)', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Department of Basic Medical Sciences · Faculty of Medical Sciences<br />
          University of the West Indies, Mona<br />
          <strong style={{ color: 'var(--cyber-cyan)' }}>
            Director: Dr. Simone Laura Sandiford
          </strong>
        </p>

        <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: '720px' }}>
          ArboSentinel was developed to support the surveillance and research
          operations of the UWI MCRU — aggregating epidemiological data from
          global public health agencies, applying machine-learning forecasting,
          and surfacing actionable outbreak risk intelligence for the diseases
          the unit actively investigates: Dengue, Zika, Chikungunya, Malaria,
          and West Nile Virus.
        </p>
      </div>

      {/* ── Research context ──────────────────────────────────────────────── */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>

        <div className="panel">
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            🦟 Co-infection Research
          </h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            A central research focus of the MCRU is understanding co-infection
            dynamics within <em>Aedes aegypti</em> — specifically whether a single
            vector can simultaneously carry and transmit Dengue (DENV),
            Zika (ZIKV), and Chikungunya (CHIKV).
          </p>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '0.75rem' }}>
            This question has direct implications for outbreak modelling: if
            co-infected vectors are possible, case prediction models that treat
            these diseases independently may systematically underestimate
            transmission risk in co-endemic regions.
            ArboSentinel's multi-disease risk scoring is designed with this in mind.
          </p>
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            🔬 Scope of the Unit
          </h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            The MCRU conducts field and laboratory investigations into
            mosquito-borne disease vectors across Jamaica and the wider Caribbean.
            Its work spans molecular characterisation of local <em>Aedes</em> and
            <em> Anopheles</em> populations, vector control strategy evaluation,
            and detection of newly introduced or range-expanding species.
          </p>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '0.75rem' }}>
            The unit's dual role — academic research and operational surveillance —
            makes it a direct consumer of the kind of data intelligence
            ArboSentinel is built to provide.
          </p>
        </div>
      </div>

      {/* ── 2025 Paper ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'rgba(0, 191, 165, 0.04)',
          border: '1px solid rgba(0, 191, 165, 0.25)',
          borderLeft: '4px solid var(--teal-pulse)',
          borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
          padding: '1.75rem 2rem',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        <p className="section-label" style={{ marginBottom: '0.75rem' }}>
          2025 PUBLISHED RESEARCH — REFLECTED IN THIS PLATFORM
        </p>

        <h3 style={{
          fontSize: '1rem', color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.4rem',
        }}>
          "First record of <em>Aedes vittatus</em> (Diptera: Culicidae) in Jamaica"
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'var(--teal-pulse)', marginBottom: '1rem' }}>
          Sandiford et al. (2025) · <em>Parasites &amp; Vectors</em>
        </p>

        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
          This paper confirmed the first detection of <em>Aedes vittatus</em> on
          the island of Jamaica — a species not previously recorded here.
          While <em>Ae. vittatus</em> is not a primary dengue vector, its
          co-occurrence with the established <em>Ae. aegypti</em> population
          raises surveillance questions directly relevant to outbreak risk modelling.
        </p>

        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          ArboSentinel's active Alert #3 —
          <strong style={{ color: 'var(--text-primary)' }}>
            {' '}"Aedes vittatus Detected in Jamaica — New Vector Presence"
          </strong>{' '}
          — is a direct operational reflection of this finding, demonstrating
          how published MCRU field data can flow into a surveillance platform
          as actionable intelligence.
        </p>
      </div>

      {/* ── Platform mission ─────────────────────────────────────────────── */}
      <div className="panel" style={{ marginBottom: 'var(--space-2xl)' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>🌍 Why This Platform Exists</h3>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '0.9rem' }}>
          Epidemiological data for arboviral diseases exists — from CDC, WHO,
          Brazil SINAN, and regional agencies — but it is fragmented across
          institutions, hard to query in aggregate, and rarely connected to
          predictive or risk-scoring intelligence.
        </p>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '0.9rem' }}>
          Field findings from units like the MCRU are published in journals but
          rarely feed back into operational dashboards where surveillance officers
          and clinicians can act on them in real time.
        </p>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
          ArboSentinel is built to close that gap: ingest the data, compute the
          risk, surface the alerts — and give researchers, clinicians, and public
          health officers a single interface for what the vectors are doing.
        </p>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-dim)' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          color: 'var(--text-secondary)', letterSpacing: '0.1em', lineHeight: 2,
        }}>
          ArboSentinel · Arboviral Pathogen Intelligence Platform<br />
          <span style={{ color: 'var(--teal-pulse)' }}>
            University of the West Indies, Mona ·
            Mosquito Control and Research Unit
          </span>
        </p>
      </div>

    </div>
  )
}

export default AboutPage
