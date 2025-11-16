import clsx from 'clsx'

export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={clsx(
        'surface-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-xl transition hover:border-ember/30 hover:shadow-glow',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

