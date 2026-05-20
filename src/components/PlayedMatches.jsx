const OWN_TEAM = 'Kingmakers'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getResult(match) {
  if (!match.score) return null
  const ownScore    = match.home === OWN_TEAM ? match.score.home : match.score.away
  const theirScore  = match.home === OWN_TEAM ? match.score.away : match.score.home
  if (ownScore > theirScore) return 'W'
  if (ownScore < theirScore) return 'L'
  return 'D'
}

export default function PlayedMatches({ matches = [] }) {
  const played = matches.filter(m => m.score)
  if (!played.length) return null

  return (
    <section className="animate-slide-up">
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">
        Played Matches
      </h2>
      <div className="flex flex-col gap-3">
        {played.map((match) => {
          const result  = getResult(match)
          const isHome  = match.home === OWN_TEAM

          const borderColor =
            result === 'W' ? 'border-brand-green/40' :
            result === 'L' ? 'border-red-500/40' :
            'border-yellow-500/40'

          const resultBadgeClass =
            result === 'W' ? 'bg-brand-green text-brand-dark' :
            result === 'L' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'

          const resultLabel =
            result === 'W' ? 'Win' :
            result === 'L' ? 'Loss' :
            'Draw'

          return (
            <div
              key={match.id}
              className={`bg-brand-card rounded-2xl border p-4 ${borderColor}`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-brand-muted text-xs font-medium">{match.round}</span>
                <div className="flex items-center gap-2">
                  {isHome
                    ? <span className="text-brand-green/70 text-xs font-semibold">Home</span>
                    : <span className="text-brand-muted text-xs font-semibold">Away</span>
                  }
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${resultBadgeClass}`}>
                    {resultLabel}
                  </span>
                </div>
              </div>

              {/* Teams + Score row */}
              <div className="flex items-center justify-between gap-2">
                {/* Home team */}
                <div className="flex-1 text-center">
                  <p className="text-4xl font-black text-white mb-1 tabular-nums">
                    {match.score.home}
                  </p>
                  <p className={`font-semibold text-sm ${match.home === OWN_TEAM ? 'text-brand-green' : 'text-white'}`}>
                    {match.home}
                  </p>
                </div>

                {/* Status + date */}
                <div className="text-center px-2">
                  <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">
                    {match.status ?? 'Ended'}
                  </p>
                  <p className="text-brand-muted text-xs mt-1">{formatDate(match.date)}</p>
                </div>

                {/* Away team */}
                <div className="flex-1 text-center">
                  <p className="text-4xl font-black text-white mb-1 tabular-nums">
                    {match.score.away}
                  </p>
                  <p className={`font-semibold text-sm ${match.away === OWN_TEAM ? 'text-brand-green' : 'text-white'}`}>
                    {match.away}
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
                <span className="text-brand-muted text-xs">{match.venue}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
