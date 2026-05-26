import { useState, useEffect } from 'react'
import { standings as fallbackStandings, matches as fallbackMatches } from '../data/mockData'

// Fields that only exist in mockData (can't be scraped) — merge these
// from the bundled data into whatever the live JSON returns.
const STATIC_MATCH_FIELDS = ['lineupImage']

function mergeMatches(liveMatches, staticMatches) {
  return liveMatches.map(liveMatch => {
    const staticMatch = staticMatches.find(m => m.id === liveMatch.id)
    if (!staticMatch) return liveMatch
    const extras = {}
    STATIC_MATCH_FIELDS.forEach(field => {
      if (staticMatch[field] != null) extras[field] = staticMatch[field]
    })
    return { ...liveMatch, ...extras }
  })
}

export function useTeamData() {
  const [data, setData] = useState({
    standings: fallbackStandings,
    matches: fallbackMatches,
    lastUpdated: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch(`/data/liveData.json?v=${Date.now()}`, { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(json => {
        const liveMatches = json.matches?.length ? json.matches : fallbackMatches
        setData({
          standings:   json.standings?.length ? json.standings : fallbackStandings,
          matches:     mergeMatches(liveMatches, fallbackMatches),
          lastUpdated: json.lastUpdated ?? null,
          loading:     false,
          error:       null,
        })
      })
      .catch(err => {
        setData(d => ({ ...d, loading: false, error: err.message }))
      })
  }, [])

  return data
}
