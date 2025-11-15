import { useEffect, useState } from 'react'
import Card from '../common/Card.jsx'

const DEFAULT_SETTINGS = {
  highContrast: false,
  largeText: false,
}

const TOGGLES = [
  {
    key: 'highContrast',
    label: 'High contrast mode',
    description: 'Boost contrast, reduce glow, and sharpen edges.',
  },
  {
    key: 'largeText',
    label: 'Larger text mode',
    description: 'Increase text sizing for improved readability.',
  },
]

export default function AccessibilityToggle({
  value = DEFAULT_SETTINGS,
  onChange,
}) {
  const [settings, setSettings] = useState(value)

  useEffect(() => {
    setSettings(value)
  }, [value])

  const toggleSetting = (key) => {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next)
    onChange?.(next)
  }

  return (
    <Card className="bg-night-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            Accessibility
          </p>
          <p className="mt-1 text-base text-slate-100">
            Personalize contrast and typography.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {TOGGLES.map((toggle) => {
          const enabled = settings[toggle.key]

          return (
            <button
              key={toggle.key}
              type="button"
              onClick={() => toggleSetting(toggle.key)}
              aria-pressed={enabled}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-night-900/40 px-4 py-3 text-left transition hover:border-ember/40"
            >
              <div>
                <p className="font-medium text-slate-100">{toggle.label}</p>
                <p className="text-sm text-slate-400">{toggle.description}</p>
              </div>
              <span
                role="switch"
                aria-checked={enabled}
                aria-label={toggle.label}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  enabled ? 'bg-ember/80' : 'bg-white/10'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}


