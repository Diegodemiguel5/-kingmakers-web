import { useState, useEffect } from 'react'
import { standings as fallbackStandings, matches } from '../data/mockData'

// Matches always come from mockData (bundled into the app) so they are
// never affected by CDN caching. Only standings are fetched live.
export function useTeamData() {
  const [data, setData] = useState({
    standings: fallbackStandings,
    matches,
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
        setData(d => ({
          ...d,
          standings:   json.standings?.length ? json.standings : fallbackStandings,
          lastUpdated: json.lastUpdated ?? null,
          loading:     false,
          error:       null,
        }))
      })
      .catch(err => {
        setData(d => ({ ...d, loading: false, error: err.message }))
      })
  }, [])

  return data
}
