// ══════════════════════════════════════════════════════════════════════════════
// App.tsx — Root application component
//
// LEARNING NOTE — Single-page application (SPA) routing:
// React Router `BrowserRouter` uses the HTML5 History API to change the URL
// WITHOUT triggering a full page reload. The server serves the same index.html
// for every route — JavaScript handles displaying the correct component.
//
// Here we use a SIMPLE approach: manual state-based routing (no BrowserRouter)
// because it requires zero server config and works perfectly in preview mode.
// In production you'd use React Router v6's createBrowserRouter for URL-based
// navigation with back-button support.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import NavBar             from './components/giga/NavBar'
import MrProgWidget       from './components/giga/MrProgWidget'
import SurveillancePage   from './pages/SurveillancePage'
import PathogenLibraryPage from './pages/PathogenLibraryPage'
import DenguePage         from './pages/DenguePage'
import PharmacologyPage   from './pages/PharmacologyPage'
import AboutPage          from './pages/AboutPage'
import { mockAlerts }     from './api/mockData'

// Page type — string literal union for type safety
type Page = 'surveillance' | 'pathogens' | 'dengue' | 'pharmacology' | 'about'

const App: React.FC = () => {
  // currentPage drives which component is rendered
  // Default: surveillance dashboard (the "hero" screen)
  const [currentPage, setCurrentPage] = useState<Page>('surveillance')

  // Navigate handler — passed as a prop to NavBar (callback prop pattern)
  // NavBar calls this when a link is clicked; App updates currentPage
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page)
    // Scroll to top on page change — feels like a real navigation
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Page component map — avoids a giant if/else or switch
  // Record<Page, JSX.Element> means: "keys must be Page values, values are JSX"
  const pageComponents: Record<Page, JSX.Element> = {
    surveillance: <SurveillancePage />,
    pathogens:    <PathogenLibraryPage />,
    dengue:       <DenguePage />,
    pharmacology: <PharmacologyPage />,
    about:        <AboutPage />,
  }

  return (
    <>
      {/* NavBar is sticky — stays at top during scroll */}
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main content area — renders the current page */}
      <main>
        {/* Keying on currentPage triggers React's reconciler to
            unmount the old page and mount the new one cleanly,
            resetting all internal state (search boxes, etc.) */}
        <div key={currentPage}>
          {pageComponents[currentPage]}
        </div>
      </main>

      {/* MrProg floating widget — visible on all pages */}
      <MrProgWidget alerts={mockAlerts} />
    </>
  )
}

export default App
