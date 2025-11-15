import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function AppLayout({
  children,
  currentView,
  onNavigateHome,
  onNavigateSettings,
}) {
  return (
    <div className="min-h-screen bg-night-900 text-slate-100">
      <div className="relative min-h-screen bg-night-gradient">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="grid-overlay h-full w-full" />
        </div>

        <Header
          currentView={currentView}
          onNavigateHome={onNavigateHome}
          onNavigateSettings={onNavigateSettings}
        />

        <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-10">
          {children}
        </main>

        <Footer />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-72 bg-gradient-to-t from-night-900 via-night-900/70 to-transparent" />
      </div>
    </div>
  )
}

