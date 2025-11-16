import { useMemo, useState } from 'react'
import createMockRoutesSource from './useRouteData.mock.js'
import { planSafeRoutes } from '../services/api'

const { BASE_ROUTES, DEFAULT_QUERY } = createMockRoutesSource

function createMockRoutes({ start, destination }) {
  return BASE_ROUTES.map((route, index) => ({
    ...route,
    id: `route-${index + 1}`,
    start,
    destination,
    crowdScore: 60 + index * 7,
  }))
}

export default function useRouteData() {
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [routes, setRoutes] = useState([])
  const [activeRouteId, setActiveRouteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeRoute = useMemo(
    () => routes.find((route) => route.id === activeRouteId) ?? null,
    [routes, activeRouteId],
  )

  async function planRoutes({ start = '', destination = '' }) {
    const trimmedQuery = {
      start: start.trim() || DEFAULT_QUERY.start,
      destination: destination.trim() || DEFAULT_QUERY.destination,
    }

    setLoading(true)
    setError(null)

    // Clear currently-displayed routes immediately so old polylines vanish
    // while the new plan request is in-flight.
    setRoutes([])
    setActiveRouteId(null)

    try {
      const resp = await planSafeRoutes({ origin: trimmedQuery.start, destination: trimmedQuery.destination, mode: 'WALK' })

      // map backend SafeRouteResponse -> frontend route shape
      const mapped = resp.map((r, i) => ({
        id: `route-${i + 1}`,
        label: r.label,
        duration: r.duration,
        distance: r.distance,
        safetyScore: r.safetyScore,
        riskLevel: r.riskLevel,
        description: r.description,
        riskFactors: r.riskFactors,
        path: r.path,
      }))

      setQuery(trimmedQuery)
      setRoutes(mapped)
      setActiveRouteId(mapped[0]?.id ?? null)

      return { routes: mapped, query: trimmedQuery }
    } catch (err) {
      // fallback to mock data on error
      const generated = createMockRoutes(trimmedQuery).map((route, index) => ({
        ...route,
        duration: route.duration + index,
        safetyScore: Math.max(70, route.safetyScore - index * 2),
      }))
      setQuery(trimmedQuery)
      setRoutes(generated)
      setActiveRouteId(generated[0]?.id ?? null)
      setError(err?.message ?? String(err))
      return { routes: generated, query: trimmedQuery, error: err }
    } finally {
      setLoading(false)
    }
  }

  function clearRoutes() {
    setRoutes([])
    setActiveRouteId(null)
  }

  return {
    routes,
    activeRouteId,
    setActiveRouteId,
    activeRoute,
    planRoutes,
    lastQuery: query,
    loading,
    error,
    clearRoutes,
  }
}



