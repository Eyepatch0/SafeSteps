import Badge from '../components/common/Badge.jsx'
import Card from '../components/common/Card.jsx'
import AccessibilityToggle from '../components/controls/AccessibilityToggle.jsx'

export default function Settings({
  accessibilitySettings,
  onAccessibilityChange,
}) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3">
        <Badge tone="info" className="w-fit tracking-[0.35em]">
          Night Guide
        </Badge>
        <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
          Tune your experience.
        </h1>
        <p className="max-w-2xl text-base text-slate-300">
          Configure accessibility, visual focus, and upcoming safety alerts. Your
          preferences stay local so you can quickly personalize SafeSteps at any
          kiosk or device.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-night-900/70">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Visual comfort
            </p>
            <p className="text-xl text-white">Accessibility controls</p>
            <p className="text-sm text-slate-400">
              Toggle contrast, glow, and typography to fit your needs. These
              settings will soon propagate across the entire routing experience.
            </p>
          </div>

          <div className="mt-6">
            <AccessibilityToggle
              value={accessibilitySettings}
              onChange={onAccessibilityChange}
            />
          </div>
        </Card>

        <Card className="bg-night-900/70">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Coming soon
            </p>
            <p className="text-xl text-white">Alert & escort preferences</p>
            <p className="text-sm text-slate-400">
              Subscribe to campus alerts, community escorts, or lantern checkpoints.
              We&apos;ll plug these features into backend services in the next
              milestone.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Choose quiet hours and notification channels.</li>
              <li>Enable auto-sharing of your route ETA with guardians.</li>
              <li>Preview escort availability near your destination.</li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  )
}


