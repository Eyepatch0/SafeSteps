import { useMemo, useState } from 'react'
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
  } = useRouteData()
  const [accessibilitySettings, setAccessibilitySettings] = useState(
    DEFAULT_ACCESSIBILITY,
  )
  const [routeSummary, setRouteSummary] = useState(
    'Select your start and destination to preview illuminated routes.',
  )
  const [currentView, setCurrentView] = useState(VIEWS.home)

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
    const { query } = planRoutes(formData)

    setRouteSummary(
      `Exploring safer options from ${query.start} to ${query.destination}. We prioritize lighting, activity, and recent community safety signals.`,
    )
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
        routeSummary={routeSummary}
        routeStats={stats}
        accessibilitySettings={accessibilitySettings}
        lastQuery={lastQuery}
      />
    )
  }

  return (
    <AppLayout
      currentView={currentView}
      onNavigateHome={() => setCurrentView(VIEWS.home)}
      onNavigateSettings={() => setCurrentView(VIEWS.settings)}
    >
      {renderView()}
    </AppLayout>
  )
}

export default App
