import { useMemo } from 'react'
import clsx from 'clsx'
import { GoogleMap, Polyline, useJsApiLoader, Marker } from '@react-google-maps/api'
import nightMapStyle from '../../styles/mapStyles.js'
import policeStations from '../../data/policeStations'

const MAP_CENTER = { lat: 38.9897, lng: -76.9378 }
const SAFETY_COLORS = {
  safe: '#4ade80', // >75
  caution: '#facc15', // >20 && <=75
  risk: '#ef4444', // <=20
}

function getSafetyColor(score = 0) {
  const numericScore =
    typeof score === 'string' ? parseFloat(score.replace(/[^\d.]/g, '')) : score
  if (numericScore <= 20) return SAFETY_COLORS.risk
  if (numericScore <= 75) return SAFETY_COLORS.caution
  return SAFETY_COLORS.safe
}

export default function MapView({
  routes = [],
  activeRouteId,
  onRouteHover,
  onRouteSelect,
  accessibilitySettings,
  highlightedRoute,
}) {
  const accentBorder = accessibilitySettings?.highContrast
    ? 'border-white/40'
    : 'border-white/15'
  const textScale = accessibilitySettings?.largeText ? 'text-base' : 'text-sm'
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'safesteps-map',
    googleMapsApiKey: apiKey,
  })

  const mapOptions = useMemo(
    () => ({
      styles: nightMapStyle,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      backgroundColor: '#050816',
    }),
    [],
  )

  const routesSignature = useMemo(
    () =>
      routes
        .map((route) => {
          const start = route.path?.[0] ?? {}
          const end = route.path?.[route.path.length - 1] ?? {}
          return [
            route.id,
            route.path?.length ?? 0,
            start.lat ?? 0,
            start.lng ?? 0,
            end.lat ?? 0,
            end.lng ?? 0,
          ].join(':')
        })
        .join('|'),
    [routes],
  )

  const mapCenter = routes[0]?.path?.[0] ?? MAP_CENTER
  const canRenderMap = Boolean(apiKey) && isLoaded && !loadError

  return (
    <div
      className={clsx(
        'relative h-full overflow-hidden rounded-[36px] border bg-night-900/70 shadow-card backdrop-blur-2xl',
        accentBorder,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(248,197,82,0.2),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(107,91,255,0.3),transparent_45%),linear-gradient(180deg,rgba(5,4,13,0.7),rgba(5,4,13,0.95))]" />

      <div className="relative flex h-full flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Map Preview
            </p>
            <h2
              className={clsx(
                'font-heading text-2xl text-white',
                accessibilitySettings?.largeText && 'text-3xl',
              )}
            >
              Night Safe routes
            </h2>
          </div>
        </div>

        <div className="relative flex-1 rounded-[28px] border border-white/10 bg-night-900/50 p-4 min-h-[420px]">
          <div className="absolute inset-6 rounded-[24px] border border-white/5 bg-night-900/90 shadow-inner">
            <div className="relative h-full w-full overflow-hidden rounded-[24px]">
              {canRenderMap ? (
                <GoogleMap
                  key={routesSignature}
                  options={mapOptions}
                  center={mapCenter}
                  zoom={14.8}
                  mapContainerClassName="h-full w-full"
                >
                  {routes.map((route) => {
                    if (!route.path?.length) return null
                    const isActive = route.id === activeRouteId
                    const strokeColor = getSafetyColor(route.safetyScore)
                    const pathSignature = [
                      route.path?.[0]?.lat ?? 0,
                      route.path?.[0]?.lng ?? 0,
                      route.path?.[route.path.length - 1]?.lat ?? 0,
                      route.path?.[route.path.length - 1]?.lng ?? 0,
                      route.path?.length ?? 0,
                    ].join('-')

                    return (
                      <Polyline
                        key={`${route.id}-${pathSignature}`}
                        path={route.path}
                        options={{
                          strokeColor,
                          strokeOpacity: isActive ? 0.95 : 0.6,
                          strokeWeight: isActive ? 6 : 4,
                          zIndex: isActive ? 3 : 1,
                        }}
                        onMouseOver={() => onRouteHover?.(route.id)}
                        onClick={() => onRouteSelect?.(route.id)}
                      />
                    )
                  })}

                  {/* Police station markers */}
                  {canRenderMap && policeStations.map((station, idx) => (
                    <Marker
                      key={`police-${idx}`}
                      position={{ lat: station.lat, lng: station.lng }}
                      label={{
                        text: '🅿️',
                        color: '#ffffff',
                        fontSize: '20px',
                      }}
                      title={station.name}
                      zIndex={5}
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="transparent"/></svg>'),
                        scaledSize: { width: 1, height: 1 },
                        anchor: { x: 0, y: 0 }
                      }}
                    />
                  ))}

                  {/* Start/End markers for the focused route */}
                  {highlightedRoute?.path?.length > 0 ? (
                    <>
                      <Marker
                        position={highlightedRoute.path[0]}
                        label={{ text: 'S', color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Marker
                        position={highlightedRoute.path[highlightedRoute.path.length - 1]}
                        label={{ text: 'D', color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </>
                  ) : null}
                </GoogleMap>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[24px] bg-night-900/70 text-center text-slate-400">
                  <span className="h-10 w-32 animate-pulse rounded-full bg-white/10" />
                  <p className="text-xs uppercase tracking-[0.4em]">
                    Loading map
                  </p>
                  {!apiKey && (
                    <p className="text-[11px] text-rose-200/80">
                      Add VITE_GOOGLE_MAPS_API_KEY to load tiles.
                    </p>
                  )}
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_60%)]" />
            </div>
          </div>

          <div className="absolute inset-y-6 right-6 flex w-64 flex-col gap-3 pointer-events-none">
            {routes.map((route) => {
              const active = route.id === activeRouteId

              return (
                <button
                  key={route.id}
                  type="button"
                  aria-pressed={active}
                  className={clsx(
                    'pointer-events-auto',
                    'transform rounded-2xl border px-4 py-3 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900',
                    active
                      ? 'border-ember/70 bg-ember/15 text-white shadow-glow scale-[1.02]'
                      : 'border-white/10 bg-night-900/60 text-slate-200 hover:border-white/30 hover:scale-[1.01]',
                  )}
                  onMouseEnter={() => onRouteHover?.(route.id)}
                  onFocus={() => onRouteHover?.(route.id)}
                  onClick={() => onRouteSelect?.(route.id)}
                >
                  <p className="font-heading text-lg">{route.label}</p>
                  <p className={clsx('mt-1 font-medium', textScale)}>
                    {route.duration} min • {route.distance} mi
                  </p>
                  <p className="text-xs text-slate-400">
                    Safety score {route.safetyScore}%
                  </p>
                </button>
              )
            })}
          </div>

          {highlightedRoute ? (
            <div className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-night-900/80 px-4 py-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-200">
                Focused route
              </p>
              <p className="text-lg text-white">{highlightedRoute.label}</p>
              <p className="text-slate-400">{highlightedRoute.description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}


