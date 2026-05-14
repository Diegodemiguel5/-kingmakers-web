import { useState, useEffect } from 'react'
import { standings as fallbackStandings, matches as fallbackMatches } from '../data/mockData'

export function useTeamData() {
  const [data, setData] = useState({
    standings: fallbackStandings,
    matches: fallbackMatches,
    lastUpdated: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch('/data/liveData.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(json => {
        setData({
          standings: json.standings?.length ? json.standings : fallbackStandings,
          matches:   json.matches?.length   ? json.matches   : fallbackMatches,
          lastUpdated: json.lastUpdated ?? null,
          loading: false,
          error: null,
        })
      })
      .catch(err => {
        // Live fetch failed — silently fall back to bundled mock data
        setData(d => ({ ...d, loading: false, error: err.message }))
      })
  }, [])

  return data
}
