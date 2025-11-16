import RouteForm from '../components/controls/RouteForm.jsx'
import Card from '../components/common/Card.jsx'
import Badge from '../components/common/Badge.jsx'
import MapView from '../components/map/MapView.jsx'

export default function Home({
  onPlanRoute,
  routes = [],
  activeRouteId = null,
  onRouteFocus,
  onClearRoutes,
  routeSummary,
  routeStats,
  accessibilitySettings,
  lastQuery,
  isSubmitting = false,
  apiError = null,
}) {
  const activeRoute = routes.find((route) => route.id === activeRouteId)

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <Badge tone="info" className="uppercase tracking-[0.35em]">
          Demo
        </Badge>
        <p>Mock data only — backend integration coming next.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-ember">
              Plan a safer route
            </p>
            <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
              Illuminate your walk before you set out.
            </h1>
            <p className="text-base text-slate-300">
              We surface safer walking options by blending lighting coverage,
              active corridors, and recent community safety signals. Enter a test
              route to preview how SafeSteps will guide you soon.
            </p>
          </header>

          <RouteForm
            key={`${lastQuery?.start ?? ''}-${lastQuery?.destination ?? ''}`}
            onSubmit={onPlanRoute}
            initialValues={lastQuery}
            isSubmitting={isSubmitting}
            onInputChange={onClearRoutes}
          />

          {apiError ? (
            <div className="mt-4 rounded-md border border-rose-400 bg-rose-900/10 px-4 py-3 text-sm text-rose-200">
              {String(apiError)}
            </div>
          ) : null}

          <Card className="bg-night-900/60">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                  Route summary
                </p>
                <p className="mt-2 text-lg text-slate-100">{routeSummary}</p>
              </div>
              {routeStats ? (
                <div className="flex flex-col gap-3 text-right text-sm text-slate-300">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Duration
                    </span>
                    <p className="text-base text-white">{routeStats.duration}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Distance
                    </span>
                    <p className="text-base text-white">{routeStats.distance}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Safety
                    </span>
                    <p className="text-base text-white">
                      {routeStats.safetyScore}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <MapView
          routes={routes}
          activeRouteId={activeRouteId}
          onRouteHover={onRouteFocus}
          onRouteSelect={onRouteFocus}
          accessibilitySettings={accessibilitySettings}
          highlightedRoute={activeRoute}
        />
      </div>
    </section>
  )
}


