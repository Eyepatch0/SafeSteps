export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-night-900/80 py-6 text-sm text-slate-400 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-10">
        <p>Built at Technica 2025</p>
        <div className="flex items-center gap-4">
          <a
            className="text-slate-200 transition hover:text-ember"
            href="https://devpost.com"
            target="_blank"
            rel="noreferrer"
          >
            Devpost
          </a>
          <span className="text-white/20">•</span>
          <a
            className="text-slate-200 transition hover:text-ember"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

