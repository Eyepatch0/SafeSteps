import { useMemo, useState } from 'react'

const BASE_ROUTES = [
  {
    label: 'Lantern Walk',
    duration: 18,
    distance: 1.4,
    safetyScore: 92,
    riskLevel: 'low',
    description: 'Prioritizes main streets with campus lighting and late-night cafes.',
    riskFactors: ['Well-lit blocks', 'Student foot traffic'],
    path: [
      { lat: 38.9897, lng: -76.9378 },
      { lat: 38.9899, lng: -76.9364 },
      { lat: 38.9908, lng: -76.935 },
      { lat: 38.9921, lng: -76.9358 },
      { lat: 38.9931, lng: -76.9372 },
    ],
  },
  {
    label: 'Aurora Loop',
    duration: 21,
    distance: 1.6,
    safetyScore: 87,
    riskLevel: 'medium',
    description: 'Balances lighting with quieter blocks, avoiding recent incident zones.',
    riskFactors: ['Residential watch', 'Community patrol'],
    path: [
      { lat: 38.9889, lng: -76.9399 },
      { lat: 38.9896, lng: -76.9381 },
      { lat: 38.9904, lng: -76.9372 },
      { lat: 38.9915, lng: -76.9378 },
      { lat: 38.9924, lng: -76.9393 },
    ],
  },
  {
    label: 'Beacon Path',
    duration: 23,
    distance: 1.8,
    safetyScore: 81,
    riskLevel: 'high',
    description: 'Adds an extra block near open businesses for more visibility.',
    riskFactors: ['Shopfront lighting', 'Emergency call boxes'],
    path: [
      { lat: 38.9882, lng: -76.9387 },
      { lat: 38.9889, lng: -76.9368 },
      { lat: 38.9896, lng: -76.9346 },
      { lat: 38.9907, lng: -76.9338 },
      { lat: 38.9918, lng: -76.9354 },
    ],
  },
]

const DEFAULT_QUERY = {
  start: 'North Campus Commons',
  destination: 'Aurora Station',
}

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
  const [routes, setRoutes] = useState(() => createMockRoutes(DEFAULT_QUERY))
  const [activeRouteId, setActiveRouteId] = useState(routes[0]?.id ?? null)

  const activeRoute = useMemo(
    () => routes.find((route) => route.id === activeRouteId) ?? null,
    [routes, activeRouteId],
  )

  const planRoutes = ({ start = '', destination = '' }) => {
    const trimmedQuery = {
      start: start.trim() || DEFAULT_QUERY.start,
      destination: destination.trim() || DEFAULT_QUERY.destination,
    }

    const generated = createMockRoutes(trimmedQuery).map((route, index) => ({
      ...route,
      // add subtle differentiation so they feel unique per plan
      duration: route.duration + index,
      safetyScore: Math.max(70, route.safetyScore - index * 2),
    }))

    setQuery(trimmedQuery)
    setRoutes(generated)
    setActiveRouteId(generated[0]?.id ?? null)

    return { routes: generated, query: trimmedQuery }
  }

  return {
    routes,
    activeRouteId,
    setActiveRouteId,
    activeRoute,
    planRoutes,
    lastQuery: query,
  }
}


