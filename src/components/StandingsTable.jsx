const OWN_TEAM = 'Kingmakers'

export default function StandingsTable({ standings = [] }) {
  const seasonStarted = standings.some((r) => r.played > 0)
  return (
    <section className="animate-slide-up">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-muted">
          Group A · Standings
        </h2>
        {!seasonStarted && (
          <span className="text-brand-green text-xs font-semibold">Starts 18 May</span>
        )}
      </div>

      <div className="bg-brand-card rounded-2xl overflow-hidden border border-brand-border">
        {/* Header row */}
        <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2.5rem] gap-x-2 px-4 py-2 border-b border-brand-border">
          <span className="text-brand-muted text-xs font-semibold text-center">#</span>
          <span className="text-brand-muted text-xs font-semibold">Team</span>
          <span className="text-brand-muted text-xs font-semibold text-center">P</span>
          <span className="text-brand-muted text-xs font-semibold text-center">W</span>
          <span className="text-brand-muted text-xs font-semibold text-center">L</span>
          <span className="text-brand-muted text-xs font-semibold text-right">Pts</span>
        </div>

        {standings.map((row, i) => {
          const isUs = row.team === OWN_TEAM
          return (
            <div
              key={row.position}
              className={`grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2.5rem] gap-x-2 px-4 py-3 items-center transition-colors ${
                isUs
                  ? 'bg-brand-green/10 border-l-2 border-brand-green'
                  : 'border-l-2 border-transparent'
              } ${i !== standings.length - 1 ? 'border-b border-brand-border' : ''}`}
            >
              <span className={`text-xs font-bold text-center ${row.position <= 2 ? 'text-brand-green' : 'text-brand-muted'}`}>
                {row.position}
              </span>
              <span className={`text-sm font-semibold truncate ${isUs ? 'text-brand-green' : 'text-white'}`}>
                {isUs ? `★ ${row.team}` : row.team}
              </span>
              <span className="text-brand-muted text-xs text-center">{row.played}</span>
              <span className="text-brand-muted text-xs text-center">{row.won}</span>
              <span className="text-brand-muted text-xs text-center">{row.lost}</span>
              <span className={`text-sm font-black text-right ${isUs ? 'text-brand-green' : 'text-white'}`}>
                {row.points}
              </span>
            </div>
          )
        })}
      </div>

      {!seasonStarted && standings.length > 0 && (
        <p className="text-brand-muted text-xs mt-2 text-center">
          No matches played yet — table will update once the season kicks off
        </p>
      )}
    </section>
  )
}
