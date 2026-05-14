import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { label: 'Overview', id: 'overview' },
  { label: 'Squad',    id: 'squad' },
]

export default function Header({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-brand-dark'
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center font-black text-brand-dark text-sm leading-none select-none">
            K
          </div>
          <div>
            <p className="font-black text-white text-lg leading-tight tracking-tight">Kingmakers</p>
            <p className="text-brand-muted text-xs">Liga de las Empresas</p>
          </div>
        </div>
        <span className="text-brand-muted text-xs">
          {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Tab nav */}
      <nav className="flex border-b border-brand-border px-4">
        {NAV_ITEMS.map(({ label, id }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className={`relative pb-3 pt-1 mr-6 text-sm font-semibold transition-colors ${
                isActive ? 'text-brand-green' : 'text-brand-muted hover:text-white'
              }`}
            >
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-full" />
              )}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
