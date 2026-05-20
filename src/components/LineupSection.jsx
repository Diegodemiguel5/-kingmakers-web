import { useState } from 'react'
import { lineupImage, lineupLabel } from '../data/mockData'

export default function LineupSection() {
  const [lightbox, setLightbox] = useState(false)

  return (
    <section className="animate-slide-up">
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">
        Lineup
      </h2>

      <div className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-brand-border">
          <p className="text-white font-semibold text-sm">Kingmakers</p>
          <span className="text-brand-muted text-xs">{lineupLabel}</span>
        </div>

        {lineupImage ? (
          <button
            onClick={() => setLightbox(true)}
            className="w-full relative group block"
            aria-label="View full lineup"
          >
            <img
              src={lineupImage}
              alt="Squad lineup"
              className="w-full object-cover max-h-96 transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Tap to enlarge
              </span>
            </div>
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-white font-semibold text-sm">Lineup not published yet</p>
            <p className="text-brand-muted text-xs mt-1">Check back closer to match day</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && lineupImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(false)}
        >
          <img
            src={lineupImage}
            alt="Squad lineup fullscreen"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white bg-white/10 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>
        </div>
      )}
    </section>
  )
}
