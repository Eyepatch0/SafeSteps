import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'

const LEGEND_ITEMS = [
  {
    label: 'Illuminated paths',
    detail: 'Streetlights, open storefronts, call boxes.',
    tone: 'low',
  },
  {
    label: 'Community signals',
    detail: 'Crowds, campus escorts, mutual aid.',
    tone: 'medium',
  },
  {
    label: 'Recent alerts',
    detail: '911 calls, campus notices (flag for review).',
    tone: 'high',
  },
]

export default function SafetyLegend() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-6">
      <Card className="pointer-events-auto w-60 bg-night-900/85 p-4 text-sm shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Safety Legend
          </p>
          <Badge tone="info" className="text-[10px]">
            Layers
          </Badge>
        </div>

        <ul className="mt-3 space-y-3 text-slate-200">
          {LEGEND_ITEMS.map((item) => (
            <li key={item.label} className="space-y-1">
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-slate-400">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}


