/**
 * Fetches live standings and fixtures from laligadelasempresas.com
 * and writes them to public/data/liveData.json.
 *
 * Run:  npm run update-data
 * Also runs automatically before every build (prebuild hook).
 */

import * as cheerio from 'cheerio'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, '../public/data/liveData.json')

const STANDINGS_URL = 'https://www.laligadelasempresas.com/mod/soccer/situation.aspx?itm=15503'
const CALENDAR_URL  = 'https://www.laligadelasempresas.com/mod/soccer/calendar.aspx?itm=15503'

const OWN_TEAM  = 'KINGMAKERS'
const OWN_GROUP = 'GRUPO A'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'es-ES,es;q=0.9',
}

// ── helpers ────────────────────────────────────────────────────────────────────

function toTitleCase(str) {
  const lowers = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'e', 'o'])
  return str
    .toLowerCase()
    .split(' ')
    .map((w, i) => (i === 0 || !lowers.has(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

function parseDDMMYYYY(str) {
  const m = str.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

function isNumeric(str) {
  return /^\d+$/.test((str || '').trim())
}

function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  return Math.round((d - today) / (1000 * 60 * 60 * 24))
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.text()
}

// ── standings ──────────────────────────────────────────────────────────────────
//
// Page structure (situation.aspx):
//   div.uiUserControl  (one per widget)
//     div.uiEncabezado370 > span  →  "Clasificación"
//     ...
//     table
//       tr  →  Grupo A header row  (contains <span>/"Grupo A" text, no numeric pos)
//       tr  →  team row:  td[1]=position  td[3]=team name  td[4]=points

async function fetchStandings() {
  console.log('  Fetching standings…')
  const html = await fetchHtml(STANDINGS_URL)
  const $ = cheerio.load(html)

  // Find the Clasificación widget
  let classifBlock = null
  $('div.uiUserControl').each((_, block) => {
    const header = $(block).find('.uiEncabezado370 span').first().text().trim()
    if (/clasificaci/i.test(header)) { classifBlock = $(block); return false }
  })

  if (!classifBlock) {
    console.warn('  ⚠ Could not find Clasificación block — keeping existing standings')
    return null
  }

  // Find the Grupo A span (may be inside <b> or plain <span>)
  const grupoAEl = classifBlock.find('*').filter((_, el) =>
    $(el).text().trim().toUpperCase() === OWN_GROUP
  ).first()

  if (!grupoAEl.length) {
    console.warn('  ⚠ Could not find Grupo A label — keeping existing standings')
    return null
  }

  // The Grupo A div is in a <td>, and its sibling <td> holds the standings table.
  // parent() = td  →  parent().parent() = tr  →  find the <table> within that row.
  const grupoARow = grupoAEl.parent().parent()
  const table = grupoARow.find('table').first()
  if (!table.length) {
    console.warn('  ⚠ Could not find Grupo A table — keeping existing standings')
    return null
  }

  const rows = []

  table.find('tr').each((_, row) => {
    const cells = $(row).find('td')
    if (cells.length < 5) return

    // td[1] = position number, td[3] = team name, td[4] = points (PT)
    const pos  = $(cells[1]).text().trim()
    const name = $(cells[3]).text().trim()
    const pts  = $(cells[4]).text().trim()

    if (!name || !isNumeric(pos)) return

    rows.push({
      position: parseInt(pos, 10),
      team: toTitleCase(name),
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0,
      points: isNumeric(pts) ? parseInt(pts, 10) : 0,
    })
  })

  if (!rows.length) {
    console.warn('  ⚠ Standings table found but no rows parsed — keeping existing')
    return null
  }

  console.log(`  ✓ Parsed ${rows.length} teams in Group A`)
  return rows
}

// ── calendar / fixtures ────────────────────────────────────────────────────────
//
// Page structure (calendar.aspx):
//   div.jornada
//     span.bold  →  "Jornada 1"
//     table
//       tr  →  match row:
//         td[0]: status icon
//         td[1]: date  (DD.MM.YYYY inside a <span>)
//         td[2]: time  (HH:MM inside a <span>)
//         td[3]: venue code  (RG1, RG2…)
//         td[4]: home team link
//         td[5]: "-"
//         td[6]: away team link

async function fetchMatches() {
  console.log('  Fetching calendar…')
  const html = await fetchHtml(CALENDAR_URL)
  const $ = cheerio.load(html)

  const matches = []
  let matchId = 1

  // Each jornada lives in its own div.jornada
  $('div.jornada').each((_, jornada) => {
    const roundText = $(jornada).find('span.bold').first().text().trim()
    const m = roundText.match(/jornada\s+(\d+)/i)
    const currentRound = m ? `Jornada ${m[1]}` : 'Jornada ?'

    $(jornada).find('tr').each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length < 6) return

      const cellTexts = []
      cells.each((_, td) => cellTexts.push($(td).text().trim()))

      // Must have a date cell
      const dateRaw = cellTexts.find(t => /\d{2}\.\d{2}\.\d{4}/.test(t))
        ?.match(/\d{2}\.\d{2}\.\d{4}/)?.[0]
      if (!dateRaw) return

      // Must have two team links
      const teamLinks = $(row).find('a[href*="team.aspx"]')
      if (teamLinks.length < 2) return

      const home = teamLinks.eq(0).text().trim().toUpperCase()
      const away = teamLinks.eq(1).text().trim().toUpperCase()
      if (home !== OWN_TEAM && away !== OWN_TEAM) return

      const timeRaw = cellTexts.find(t => /^\d{2}:\d{2}$/.test(t)) ?? ''
      const venue   = cellTexts.find(t => /^[A-Z]{1,3}\d$/.test(t)) ?? ''
      const dateISO = parseDDMMYYYY(dateRaw)
      if (!dateISO) return

      // Parse score from the separator cell (e.g. "12  -  1")
      const scoreRaw = cellTexts[6] ?? ''
      const scoreMatch = scoreRaw.match(/(\d+)\s*-\s*(\d+)/)
      const score  = scoreMatch ? { home: parseInt(scoreMatch[1], 10), away: parseInt(scoreMatch[2], 10) } : null
      const status = score ? 'Ended' : null

      const entry = {
        id: matchId++,
        home: toTitleCase(home),
        away: toTitleCase(away),
        date: dateISO,
        time: timeRaw,
        venue: venue ? `Campo ${venue}` : 'Mirasierra',
        round: currentRound,
        isNext: false,
      }
      if (score)  entry.score  = score
      if (status) entry.status = status

      matches.push(entry)
    })
  })

  // Mark the next upcoming match
  const upcoming = matches
    .filter(m => daysUntil(m.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (upcoming.length) upcoming[0].isNext = true

  if (!matches.length) {
    console.warn('  ⚠ No Kingmakers fixtures found — keeping existing matches')
    return null
  }

  console.log(`  ✓ Parsed ${matches.length} Kingmakers fixtures`)
  return matches
}

// ── main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔄 Updating Liga de las Empresas data…\n')

  // Load existing data as fallback
  let existing = {}
  if (existsSync(OUT_PATH)) {
    try { existing = JSON.parse(readFileSync(OUT_PATH, 'utf8')) } catch {}
  }

  const [standings, matches] = await Promise.allSettled([
    fetchStandings(),
    fetchMatches(),
  ])

  const output = {
    lastUpdated: new Date().toISOString(),
    standings: standings.status === 'fulfilled' && standings.value
      ? standings.value
      : (existing.standings ?? []),
    matches: matches.status === 'fulfilled' && matches.value
      ? matches.value
      : (existing.matches ?? []),
  }

  if (standings.status === 'rejected') console.warn('  ⚠ Standings fetch failed:', standings.reason?.message)
  if (matches.status === 'rejected')   console.warn('  ⚠ Matches fetch failed:',   matches.reason?.message)

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))
  console.log(`\n✅ Saved to public/data/liveData.json`)
  console.log(`   Standings: ${output.standings.length} teams`)
  console.log(`   Matches:   ${output.matches.length} fixtures`)
  console.log(`   Updated:   ${output.lastUpdated}\n`)
}

main().catch(err => {
  console.error('\n❌ fetch-data failed:', err.message)
  process.exit(1)
})
