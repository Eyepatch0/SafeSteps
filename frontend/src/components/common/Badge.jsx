import clsx from 'clsx'

const INTENSITY_STYLES = {
  low: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40',
  medium: 'bg-amber-500/15 text-amber-200 border-amber-400/40',
  high: 'bg-rose-500/15 text-rose-200 border-rose-400/40',
  info: 'bg-white/10 text-slate-200 border-white/20',
}

export default function Badge({
  tone = 'info',
  className = '',
  children,
  ...props
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide',
        INTENSITY_STYLES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

