import clsx from 'clsx'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-twilight to-rose-500 focus-visible:ring-twilight/70 text-white shadow-glow',
  secondary:
    'bg-transparent border border-white/30 text-white focus-visible:ring-white/50 hover:border-ember/60 hover:text-ember',
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

