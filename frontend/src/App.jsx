import { useEffect, useMemo, useState } from 'react'
import AppLayout from './components/layout/AppLayout.jsx'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import useRouteData from './hooks/useRouteData.js'
import './App.css'

const DEFAULT_ACCESSIBILITY = {
  highContrast: false,
  largeText: false,
}

const VIEWS = {
  home: 'home',
  settings: 'settings',
}

function App() {
  const {
    routes,
    activeRouteId,
    setActiveRouteId,
    activeRoute,
    planRoutes,
    lastQuery,
    loading,
    error,
    clearRoutes,
  } = useRouteData()
  const [accessibilitySettings, setAccessibilitySettings] = useState(
    DEFAULT_ACCESSIBILITY,
  )
  const [routeSummary, setRouteSummary] = useState(
    'Select your destination',
  )
  const [currentView, setCurrentView] = useState(VIEWS.home)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.dataset.highContrast = accessibilitySettings.highContrast
      ? 'true'
      : 'false'
    root.dataset.largeText = accessibilitySettings.largeText ? 'true' : 'false'
    root.style.setProperty(
      '--app-font-scale',
      accessibilitySettings.largeText ? '1.1' : '1',
    )
  }, [accessibilitySettings])

  const stats = useMemo(() => {
    if (!activeRoute) {
      return null
    }

    return {
      duration: `${activeRoute.duration} min`,
      distance: `${activeRoute.distance} mi`,
      safetyScore: `${activeRoute.safetyScore}%`,
    }
  }, [activeRoute])

  const handlePlanRoute = (formData) => {
    clearRoutes()
    ; (async () => {
      setRouteSummary(`Exploring safer options...`)
      try {
        const { query } = await planRoutes(formData)
        setRouteSummary(
          `Exploring safer options from ${query.start} to ${query.destination}. We prioritize lighting, activity, and recent community safety signals.`,
        )
      } catch (err) {
        console.error(err)
        setRouteSummary('Unable to fetch live routes — showing demo data.')
      }
    })()
  }

  const renderView = () => {
    if (currentView === VIEWS.settings) {
      return (
        <Settings
          accessibilitySettings={accessibilitySettings}
          onAccessibilityChange={setAccessibilitySettings}
        />
      )
    }

    return (
      <Home
        onPlanRoute={handlePlanRoute}
        routes={routes}
        activeRouteId={activeRouteId}
        onRouteFocus={setActiveRouteId}
        onClearRoutes={clearRoutes}
        routeSummary={routeSummary}
        routeStats={stats}
        accessibilitySettings={accessibilitySettings}
        lastQuery={lastQuery}
        isSubmitting={loading}
        apiError={error}
      />
    )
  }

  return (
    <AppLayout
      currentView={currentView}
      onNavigateHome={() => setCurrentView(VIEWS.home)}
      onNavigateSettings={() => setCurrentView(VIEWS.settings)}
      accessibilitySettings={accessibilitySettings}
    >
      {renderView()}
    </AppLayout>
  )
}

export default App
