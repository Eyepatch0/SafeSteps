import { useId, useMemo } from 'react'
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
          <NightGuideMoon active={viewingSettings} />
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

function NightGuideMoon({ active }) {
  const id = useId()
  const glowId = `${id}-glow`
  const textureId = `${id}-texture`
  const sheenId = `${id}-sheen`
  const haloId = `${id}-halo`
  const clipId = `${id}-clip`

  return (
    <div className="relative h-12 w-12" aria-hidden="true">
      <div
        className={clsx(
          'absolute inset-0 -z-10 rounded-full blur-xl transition duration-700',
          active ? 'bg-ember/40 opacity-80' : 'bg-twilight/40 opacity-60',
        )}
      />

      <svg
        viewBox="0 0 120 120"
        className="relative h-full w-full drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
        role="presentation"
        focusable="false"
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fffbea" stopOpacity="1" />
            <stop
              offset="55%"
              stopColor={active ? '#ffe6b3' : '#dcd6ff'}
              stopOpacity="0.95"
            />
            <stop offset="100%" stopColor="#3d2a55" stopOpacity="0.95" />
          </radialGradient>
          <radialGradient id={textureId} cx="20%" cy="25%" r="85%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="45%" stopColor="rgba(120,105,160,0.28)" />
            <stop offset="100%" stopColor="rgba(49,34,87,0.65)" />
          </radialGradient>
          <linearGradient id={sheenId} x1="0%" x2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id={haloId} cx="50%" cy="50%" r="75%">
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            <stop
              offset="100%"
              stopColor={
                active ? 'rgba(251,146,60,0.45)' : 'rgba(118,82,227,0.3)'
              }
            />
          </radialGradient>
          <clipPath id={clipId}>
            <circle cx="60" cy="60" r="44" />
          </clipPath>
        </defs>

        <circle cx="60" cy="60" r="54" fill={`url(#${haloId})`} opacity="0.35" />
        <circle
          cx="60"
          cy="60"
          r="44"
          fill={`url(#${glowId})`}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        <circle cx="60" cy="60" r="44" fill={`url(#${textureId})`} opacity="0.85" />

        <g clipPath={`url(#${clipId})`}>
          <rect
            x="22"
            y="10"
            width="18"
            height="100"
            fill={`url(#${sheenId})`}
            opacity="0.8"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 60 60"
              to="360 60 60"
              dur={active ? '8s' : '12s'}
              repeatCount="indefinite"
            />
          </rect>
        </g>

        <g opacity="0.55">
          <circle cx="45" cy="58" r="6.5" fill="rgba(54,33,82,0.55)" />
          <circle cx="79" cy="48" r="5" fill="rgba(54,33,82,0.45)" />
          <circle cx="70" cy="74" r="4" fill="rgba(54,33,82,0.35)" />
          <circle cx="50" cy="80" r="3" fill="rgba(54,33,82,0.4)" />
          <circle cx="38" cy="40" r="3.5" fill="rgba(54,33,82,0.5)" />
        </g>

        <g opacity="0.25">
          <circle cx="43" cy="54" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="77" cy="44" r="3" fill="rgba(255,255,255,0.25)" />
          <circle cx="67" cy="70" r="2.4" fill="rgba(255,255,255,0.28)" />
        </g>

        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeDasharray="6 12"
        />

        <g opacity="0.65">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={active ? 'rgba(251,146,60,0.35)' : 'rgba(128,90,213,0.35)'}
            strokeWidth="1.5"
            strokeDasharray="160 12"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 60 60"
              to="360 60 60"
              dur={active ? '14s' : '18s'}
              repeatCount="indefinite"
            />
          </circle>
        </g>

        <circle cx="60" cy="60" r="42" fill="transparent" />
        <circle
          cx="60"
          cy="12"
          r="3.8"
          fill="#fde68a"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur={active ? '9s' : '11s'}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  )
}

