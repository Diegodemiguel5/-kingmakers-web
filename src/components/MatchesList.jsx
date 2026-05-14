const OWN_TEAM = 'Kingmakers'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const match = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((match - today) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff < 0) return null
  return `In ${diff} days`
}

export default function MatchesList({ matches = [] }) {
  return (
    <section className="animate-slide-up">
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">
        Upcoming Matches
      </h2>
      <div className="flex flex-col gap-3">
        {matches.map((match) => {
          const countdown = daysUntil(match.date)
          const opponent = match.home === OWN_TEAM ? match.away : match.home
          const isHome = match.home === OWN_TEAM

          return (
            <div
              key={match.id}
              className={`bg-brand-card rounded-2xl border p-4 transition-transform hover:scale-[1.01] ${
                match.isNext ? 'border-brand-green/40' : 'border-brand-border'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-brand-muted text-xs font-medium">{match.round}</span>
                <div className="flex items-center gap-2">
                  {isHome
                    ? <span className="text-brand-green/70 text-xs font-semibold">Home</span>
                    : <span className="text-brand-muted text-xs font-semibold">Away</span>
                  }
                  {match.isNext && (
                    <span className="bg-brand-green text-brand-dark text-xs font-black px-2 py-0.5 rounded-full">
                      NEXT
                    </span>
                  )}
                </div>
              </div>

              {/* Teams row */}
              <div className="flex items-center justify-between gap-2">
                {/* Home team */}
                <div className="flex-1 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mx-auto mb-1 ${
                    match.home === OWN_TEAM ? 'bg-brand-green text-brand-dark' : 'bg-brand-border text-white'
                  }`}>
                    {match.home.charAt(0)}
                  </div>
                  <p className={`font-semibold text-sm ${match.home === OWN_TEAM ? 'text-brand-green' : 'text-white'}`}>
                    {match.home}
                  </p>
                </div>

                {/* VS + date */}
                <div className="text-center px-2">
                  <p className="text-brand-muted text-xs font-bold">VS</p>
                  <p className="text-white text-sm font-semibold mt-1">{match.time}</p>
                  <p className="text-brand-muted text-xs">{formatDate(match.date)}</p>
                </div>

                {/* Away team */}
                <div className="flex-1 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mx-auto mb-1 ${
                    match.away === OWN_TEAM ? 'bg-brand-green text-brand-dark' : 'bg-brand-border text-white'
                  }`}>
                    {match.away.charAt(0)}
                  </div>
                  <p className={`font-semibold text-sm ${match.away === OWN_TEAM ? 'text-brand-green' : 'text-white'}`}>
                    {match.away}
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
                <span className="text-brand-muted text-xs">{match.venue}</span>
                {countdown && (
                  <span className="text-brand-green text-xs font-semibold">{countdown}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
