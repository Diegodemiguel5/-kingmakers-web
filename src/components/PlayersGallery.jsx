import { useState } from 'react'
import { players } from '../data/mockData'

const COUNTRY_FLAGS = {
  Spain:     '🇪🇸',
  Brazil:    '🇧🇷',
  Russia:    '🇷🇺',
  Colombia:  '🇨🇴',
  Cuba:      '🇨🇺',
  Venezuela: '🇻🇪',
  Peru:      '🇵🇪',
  Mexico:    '🇲🇽',
  Nigeria:   '🇳🇬',
}

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Striker']

// Build sorted country list from actual player data
const ALL_COUNTRIES = [...new Set(players.map(p => p.country))].sort()

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
        active
          ? 'bg-brand-green text-brand-dark border-brand-green'
          : 'bg-transparent text-brand-muted border-brand-border hover:border-white/30 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

export default function PlayersGallery() {
  const [lightbox, setLightbox]           = useState(null)
  const [activeCountry, setActiveCountry] = useState(null)
  const [activePosition, setActivePosition] = useState(null)

  const filtered = players.filter(p => {
    const countryMatch   = !activeCountry  || p.country === activeCountry
    const positionMatch  = !activePosition || p.positions.includes(activePosition)
    return countryMatch && positionMatch
  })

  const toggleCountry  = c => setActiveCountry(prev  => prev === c ? null : c)
  const togglePosition = p => setActivePosition(prev => prev === p ? null : p)

  const lightboxPlayers = filtered // navigate only within filtered set

  return (
    <section id="squad" className="pt-6 animate-slide-up">

      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Squad</h2>
          <p className="text-brand-muted text-sm">
            {filtered.length === players.length
              ? `${players.length} players`
              : `${filtered.length} of ${players.length} players`}
          </p>
        </div>
        {(activeCountry || activePosition) && (
          <button
            onClick={() => { setActiveCountry(null); setActivePosition(null) }}
            className="text-brand-green text-xs font-semibold hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Country filter ── */}
      <div className="mb-2">
        <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-2">Country</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {ALL_COUNTRIES.map(country => (
            <FilterChip
              key={country}
              label={`${COUNTRY_FLAGS[country] ?? '🏳'} ${country}`}
              active={activeCountry === country}
              onClick={() => toggleCountry(country)}
            />
          ))}
        </div>
      </div>

      {/* ── Position filter ── */}
      <div className="mb-5">
        <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-2">Position</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {POSITIONS.map(pos => (
            <FilterChip
              key={pos}
              label={pos}
              active={activePosition === pos}
              onClick={() => togglePosition(pos)}
            />
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-brand-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-white">No players found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((player) => (
            <button
              key={player.id}
              onClick={() => setLightbox(player)}
              className="group relative rounded-2xl overflow-hidden bg-brand-card border border-brand-border aspect-[3/4] hover:border-brand-green/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-green/10"
            >
              <img
                src={player.image}
                alt={player.name}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 border-2 border-brand-green/0 group-hover:border-brand-green/40 rounded-2xl transition-colors duration-300" />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.image}
            alt={lightbox.fullName}
            className="max-w-sm w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          <div className="text-center mt-4" onClick={e => e.stopPropagation()}>
            <p className="text-white font-black text-xl">{lightbox.fullName}</p>
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              <span className="text-lg">{COUNTRY_FLAGS[lightbox.country] ?? ''}</span>
              <span className="text-brand-muted text-sm">{lightbox.country}</span>
              {lightbox.positions[0] !== 'Coach' && (
                <>
                  <span className="text-brand-border">·</span>
                  <span className="text-brand-green text-sm font-semibold">
                    {lightbox.positions.join(' / ')}
                  </span>
                </>
              )}
              {lightbox.positions[0] === 'Coach' && (
                <>
                  <span className="text-brand-border">·</span>
                  <span className="text-yellow-400 text-sm font-semibold">Coach</span>
                </>
              )}
            </div>
          </div>

          <button
            className="absolute top-4 right-4 text-white bg-white/10 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>

          {/* Prev / Next within filtered set */}
          <div className="flex gap-3 mt-5" onClick={e => e.stopPropagation()}>
            <button
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              onClick={() => {
                const idx = lightboxPlayers.findIndex(p => p.id === lightbox.id)
                setLightbox(lightboxPlayers[(idx - 1 + lightboxPlayers.length) % lightboxPlayers.length])
              }}
            >
              ← Prev
            </button>
            <button
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              onClick={() => {
                const idx = lightboxPlayers.findIndex(p => p.id === lightbox.id)
                setLightbox(lightboxPlayers[(idx + 1) % lightboxPlayers.length])
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
