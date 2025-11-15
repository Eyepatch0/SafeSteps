import { useMemo } from 'react'
import clsx from 'clsx'

export default function Header({
  currentView = 'home',
  onNavigateHome,
  onNavigateSettings,
}) {
  const lights = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, index) => ({
        id: index,
        delay: `${index * 0.6}s`,
        left: `${10 + index * 15}%`,
      })),
    [],
  )

  const viewingSettings = currentView === 'settings'

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-night-900/70 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-left transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
          aria-label="Return to planner"
        >
          <p className="font-heading text-2xl font-semibold text-white">
            SafeSteps
          </p>
          <span className="text-sm text-slate-300">
            Illuminate your path. Walk with confidence.
          </span>
        </button>

        <button
          type="button"
          onClick={onNavigateSettings}
          aria-pressed={viewingSettings}
          className={clsx(
            'flex items-center gap-3 rounded-full border px-3 py-2 text-left text-xs uppercase tracking-[0.35em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900',
            viewingSettings ? 'border-ember/60 text-ember' : 'border-white/20 text-slate-300',
          )}
        >
          <div className="relative h-10 w-10 rounded-full border border-white/20 bg-twilight/20 p-2 shadow-inner shadow-twilight/50">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-twilight/25 blur-lg" />
            <div className="relative h-full w-full rounded-full bg-gradient-to-br from-ember to-twilight shadow-glow" />
          </div>
          <p>Night Guide</p>
        </button>
      </div>

      <div className="relative h-1 w-full overflow-hidden bg-white/5">
        {lights.map((light) => (
          <span
            key={light.id}
            className="absolute top-0 h-full w-24 animate-pulse-glow bg-gradient-to-r from-transparent via-ember/50 to-transparent"
            style={{
              animationDelay: light.delay,
              left: light.left,
            }}
          />
        ))}
      </div>
    </header>
  )
}

