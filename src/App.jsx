import { useState } from 'react'
import Header from './components/Header'
import StandingsTable from './components/StandingsTable'
import MatchesList from './components/MatchesList'
import LineupSection from './components/LineupSection'
import PlayedMatches from './components/PlayedMatches'
import PlayersGallery from './components/PlayersGallery'
import { useTeamData } from './hooks/useTeamData'

function formatUpdated(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const { standings, matches, lastUpdated, loading } = useTeamData()

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="h-[88px]" />

      <main className="max-w-2xl mx-auto px-4 pb-16">

        {activeTab === 'overview' && (
          <div className="pt-6 space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Kingmakers <span className="text-brand-green">FC</span>
              </h1>
              <p className="text-brand-muted text-sm mt-1">Liga de las Empresas · 2025–2026</p>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-brand-muted text-sm py-4">
                <span className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                Loading latest data…
              </div>
            ) : (
              <>
                <StandingsTable standings={standings} />
                <MatchesList matches={matches} />
                <PlayedMatches matches={matches} />
              </>
            )}

            <LineupSection />

            <footer className="pt-4 text-center text-brand-muted text-xs space-y-1">
              <p className="font-semibold text-white/30">Kingmakers FC</p>
              {lastUpdated
                ? <p>Data updated: {formatUpdated(lastUpdated)}</p>
                : <p>Last updated: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              }
            </footer>
          </div>
        )}

        {activeTab === 'squad' && (
          <div className="animate-fade-in">
            <PlayersGallery />
          </div>
        )}

      </main>
    </div>
  )
}
