// ══════════════════════════════════════════════════════════════════════════════
// LoadingSpinner.tsx — STANDARD (atom) component
// A pulsing atom-ring spinner with MMBN3 void aesthetic.
//
// LEARNING NOTE:
// This demonstrates CSS @keyframes animations driven purely by JavaScript objects
// via the <style> tag injection pattern (useful when not using CSS Modules).
// The animation is defined once in index.css — we just apply the class name here.
// ══════════════════════════════════════════════════════════════════════════════

import React from 'react'

interface SpinnerProps {
  size?: number    // Diameter in px
  message?: string // Optional loading text
}

const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 48, message }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
      }}
    >
      {/* Atom ring — CSS border-radius trick to make a circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',

          // Border trick: only the top portion is colored, rest is transparent
          // Combined with spin animation → appears to be a moving arc
          border: `3px solid rgba(0, 229, 255, 0.15)`,
          borderTopColor: 'var(--cyber-cyan)',
          borderRightColor: 'var(--teal-pulse)',

          // animation: name duration timing-function iteration-count
          animation: 'orbit-1 1s linear infinite',
        }}
      />

      {message && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
          }}
        >
          {message}
        </span>
      )}
    </div>
  )
}

export default LoadingSpinner
