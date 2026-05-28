// ══════════════════════════════════════════════════════════════════════════════
// NavBar.tsx — GIGA (organism) component
// The top navigation bar — contains the molecular atom logo, app name,
// nav links, and a live-clock display.
//
// LEARNING NOTE — useEffect with a cleanup function:
//   useEffect runs AFTER the component mounts (appears in DOM).
//   The function it returns is the "cleanup" — runs when component unmounts.
//   For setInterval, we MUST clear it on unmount to prevent memory leaks.
//   Pattern: useEffect(() => { const id = setInterval(...); return () => clearInterval(id); }, [])
//   The empty [] dependency array means "run once on mount, never re-run".
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'

interface NavBarProps {
  currentPage: string
  onNavigate: (page: string) => void  // Callback prop — parent controls navigation
}

// Nav link definitions — centralised so adding a new page is one-line change
const NAV_LINKS = [
  { id: 'surveillance',  label: 'SURVEILLANCE',  icon: '📡' },
  { id: 'pathogens',     label: 'PATHOGENS',      icon: '🦠' },
  { id: 'vectors',       label: 'VECTORS',        icon: '🦟' },
  { id: 'dengue',        label: 'DENGUE INTEL',   icon: '📊' },
  { id: 'westnile',      label: 'WEST NILE',      icon: '🎯' },
  { id: 'pharmacology',  label: 'PHARMACOLOGY',   icon: '💊' },
  { id: 'about',         label: 'ABOUT',          icon: '🔬' },
]

const NavBar: React.FC<NavBarProps> = ({ currentPage, onNavigate }) => {
  // Clock state — updates every second
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    // setInterval: runs callback every N milliseconds
    // Returns an interval ID we can use to cancel it
    const id = setInterval(() => setTime(new Date()), 1000)

    // Cleanup function — cancels the interval when NavBar unmounts
    return () => clearInterval(id)
  }, [])  // Empty deps → run once on mount

  // Format: HH:MM:SS
  const timeStr = time.toTimeString().slice(0, 8)

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,     // Stay above page content when scrolling
        background: 'rgba(5, 5, 16, 0.92)',
        backdropFilter: 'blur(12px)',   // Frosted glass effect
        borderBottom: '1px solid var(--border-dim)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '56px',
          gap: '2rem',
        }}
      >
        {/* ── Molecular Atom Logo ─────────────────────────────────────── */}
        <button
          onClick={() => onNavigate('surveillance')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
          }}
        >
          {/* Atom graphic: nucleus + 3 orbiting electrons */}
          <div
            style={{
              width: 32,
              height: 32,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Nucleus */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--cyber-cyan)',
                boxShadow: 'var(--glow-cyan)',
                animation: 'pulse-glow 2s ease-in-out infinite',
                position: 'absolute',
                zIndex: 2,
              }}
            />
            {/* Electron 1 — orbit-1 from index.css @keyframes */}
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--cyber-cyan)',
                position: 'absolute',
                animation: 'orbit-1 2.5s linear infinite',
              }}
            />
            {/* Electron 2 */}
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--teal-pulse)',
                position: 'absolute',
                animation: 'orbit-2 3.5s linear infinite',
              }}
            />
            {/* Electron 3 */}
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'var(--purple-vibe)',
                position: 'absolute',
                animation: 'orbit-3 4.5s linear infinite',
              }}
            />
          </div>

          {/* App name */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--cyber-cyan)',
                letterSpacing: '0.12em',
                lineHeight: 1.1,
              }}
            >
              ARBOSENTINEL
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.15em',
              }}
            >
              ARBOVIRAL INTELLIGENCE
            </div>
          </div>
        </button>

        {/* ── Nav links ───────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            flex: 1,
            // Hide on very small screens — mobile nav would need a hamburger menu
            overflow: 'auto',
          }}
        >
          {NAV_LINKS.map(link => {
            // isActive: the link whose id matches currentPage gets highlight styling
            const isActive = currentPage === link.id
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                style={{
                  background: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--cyber-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  padding: '0.35rem 0.75rem',
                  whiteSpace: 'nowrap' as const,
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  // Glow effect only on active tab
                  boxShadow: isActive ? '0 0 8px rgba(0, 229, 255, 0.2)' : 'none',
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </button>
            )
          })}
        </div>

        {/* ── Live clock ──────────────────────────────────────────────── */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--teal-pulse)',
            letterSpacing: '0.1em',
            flexShrink: 0,
          }}
        >
          {timeStr}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
