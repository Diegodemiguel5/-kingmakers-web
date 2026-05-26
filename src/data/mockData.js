// ─── STANDINGS ────────────────────────────────────────────────────────────────
// Source: https://www.laligadelasempresas.com/mod/soccer/situation.aspx?itm=15503
// Group A — FÚTBOL 7 | LA CHAMPIONS DE LAS EMPRESAS | MIRASIERRA 1
// Season starts 18 May 2026
export const standings = [
  { position: 1, team: 'Celonis',               played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { position: 2, team: 'Dckinesis Fisioterapia', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { position: 3, team: 'Intrum',                 played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { position: 4, team: 'Kingmakers',             played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
]

// ─── UPCOMING MATCHES ─────────────────────────────────────────────────────────
// Source: https://www.laligadelasempresas.com/mod/soccer/calendar.aspx?itm=15503
// All Kingmakers fixtures — Group A · MIRASIERRA 1
export const matches = [
  {
    id: 1,
    home: 'Intrum',
    away: 'Kingmakers',
    date: '2026-05-18',
    time: '20:55',
    venue: 'Campo RG1',
    round: 'Jornada 1',
    isNext: false,
    score: { home: 12, away: 1 },
    status: 'Ended',
    lineupImage: '/squad-list/Match 1_Intrum.jpg',
  },
  {
    id: 2,
    home: 'Celonis',
    away: 'Kingmakers',
    date: '2026-05-25',
    time: '21:50',
    venue: 'Campo RG2',
    round: 'Jornada 2',
    isNext: false,
    score: { home: 12, away: 0 },
    status: 'Ended',
  },
  {
    id: 3,
    home: 'Kingmakers',
    away: 'Dckinesis Fisioterapia',
    date: '2026-06-01',
    time: '20:00',
    venue: 'Campo RG2',
    round: 'Jornada 3',
    isNext: false,
  },
]

// ─── PLAYERS ──────────────────────────────────────────────────────────────────
// Images live in public/players/ — filenames must match exactly (case-sensitive)
// country / positions read directly from the FIFA-style card artwork
export const players = [
  { id: 1,  name: 'David',         fullName: 'David Martín',       image: '/players/David.jpg',         country: 'Spain',     positions: ['Goalkeeper', 'Defender'] },
  { id: 2,  name: 'Carlos',        fullName: 'Carlos Jiménez',     image: '/players/Carlos.jpg',        country: 'Spain',     positions: ['Defender', 'Midfielder', 'Forward'] },
  { id: 3,  name: 'Nico',          fullName: 'Nicolaz Pérez',      image: '/players/NICO.jpg',          country: 'Colombia',  positions: ['Defender', 'Midfielder'] },
  { id: 4,  name: 'Adrián',        fullName: 'Adrián Milberberg',  image: '/players/ADRIAN.jpg',        country: 'Cuba',      positions: ['Defender'] },
  { id: 5,  name: 'Iván',          fullName: 'Iván Carracedo',     image: '/players/Ivan.jpg',          country: 'Spain',     positions: ['Defender', 'Midfielder', 'Forward'] },
  { id: 6,  name: 'Tomás',         fullName: 'Tomas Rosemberg',    image: '/players/TOMAS.jpg',         country: 'Brazil',    positions: ['Defender', 'Midfielder'] },
  { id: 7,  name: 'Jorge',         fullName: 'Jorge Astiaso',      image: '/players/Jorge.jpg',         country: 'Spain',     positions: ['Midfielder'] },
  { id: 8,  name: 'Dimitry',       fullName: 'Dmitry Poklonsky',   image: '/players/DIMITRY.jpg',       country: 'Russia',    positions: ['Defender'] },
  { id: 9,  name: 'Vicente',       fullName: 'Vicente Peluso',     image: '/players/VICENTE.jpg',       country: 'Venezuela', positions: ['Defender', 'Midfielder', 'Forward'] },
  { id: 10, name: 'Héctor',        fullName: 'Héctor Romero',      image: '/players/HECTOR.jpg',        country: 'Peru',      positions: ['Striker'] },
  { id: 11, name: 'Juan Escalona', fullName: 'Juan Escalona',      image: '/players/JUAN ESCALONA.jpg', country: 'Mexico',    positions: ['Defender', 'Midfielder'] },
  { id: 12, name: 'Diego',         fullName: 'Diego de Miguel',    image: '/players/Diego.jpg',         country: 'Spain',     positions: ['Defender', 'Midfielder'] },
  { id: 13, name: 'Guille',        fullName: 'Guillermo Noain',    image: '/players/Guille.jpg',        country: 'Spain',     positions: ['Goalkeeper'] },
  { id: 14, name: 'Kelvin',        fullName: 'Kelvin Oliveira',    image: '/players/KELVIN.jpg',        country: 'Brazil',    positions: ['Midfielder', 'Forward'] },
  { id: 15, name: 'Abioye',        fullName: 'Abioye Bankole',     image: '/players/ABIOYE.jpg',        country: 'Nigeria',   positions: ['Defender'] },
  { id: 16, name: 'Aleksandr',     fullName: 'Aleksandr Gorelov',  image: '/players/ALEKSANDR.jpg',     country: 'Russia',    positions: ['Midfielder'] },
  { id: 17, name: 'Juan Martínez', fullName: 'Juan Martínez',      image: '/players/Juan martinez.jpg', country: 'Spain',     positions: ['Coach'] },
  { id: 18, name: 'Isra',          fullName: 'Israel Fernández',   image: '/players/Isra.jpg',          country: 'Spain',     positions: ['Midfielder', 'Forward'] },
  { id: 19, name: 'Gonzalo',       fullName: 'Gonzalo Alcaide',    image: '/players/Gonzalo.jpg',       country: 'Spain',     positions: ['Defender'] },
]

// ─── LINEUP IMAGE ─────────────────────────────────────────────────────────────
// Drop the next match lineup into public/squad-list/ and update these two lines.
// Set lineupImage to null when no lineup is ready yet.
export const lineupImage = null
export const lineupLabel = 'vs Dckinesis Fisioterapia — Jornada 3'
