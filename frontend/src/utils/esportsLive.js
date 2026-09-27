/**
 * OpenDota — keyless, CORS-open Dota 2 pro + live data.
 * Recent pro results and in-progress games, mapped to the
 * PandaScore shape the Esports page already renders.
 * PandaScore (key-gated) remains the multi-title source when configured.
 */

const BASE = 'https://api.opendota.com/api'
const withTimeout = (ms = 10000) => ({ signal: AbortSignal.timeout(ms) })

const acronymOf = (name) =>
  (name || '')
    .split(/[\s._-]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase() || 'DOT'

const side = (name, fallback) => {
  const clean = (name || '').trim()
  return {
    opponent: {
      name: clean || fallback,
      acronym: clean ? acronymOf(clean) : fallback.slice(0, 3).toUpperCase(),
      image_url: null,
    },
  }
}

/** Recent pro results → finished matches. */
export async function getDotaProMatches(limit = 8) {
  try {
    const res = await fetch(`${BASE}/proMatches`, withTimeout())
    if (!res.ok) throw new Error('proMatches failed')
    const list = await res.json()
    return (list || []).slice(0, limit).map((m) => ({
      id: `dota-pro-${m.match_id}`,
      name: `${m.radiant_name || 'Radiant'} vs ${m.dire_name || 'Dire'}`,
      status: 'finished',
      videogame: { name: 'Dota 2', slug: 'dota2' },
      league: { name: m.league_name || 'Pro Circuit' },
      serie: { full_name: m.league_name || 'Pro match' },
      opponents: [side(m.radiant_name, 'Radiant'), side(m.dire_name, 'Dire')],
      results: [{ score: m.radiant_score ?? 0 }, { score: m.dire_score ?? 0 }],
      begin_at: new Date((m.start_time || 0) * 1000).toISOString(),
      winner: m.radiant_win ? m.radiant_name : m.dire_name,
      source: 'opendota',
      liveData: null,
    }))
  } catch (err) {
    console.error('OpenDota pro matches failed:', err)
    return []
  }
}

/** In-progress games → running matches (league games first). */
export async function getDotaLiveGames(limit = 8) {
  try {
    const res = await fetch(`${BASE}/live`, withTimeout())
    if (!res.ok) throw new Error('live failed')
    const list = await res.json()
    return (list || [])
      .sort((a, b) => (b.league_id || 0) - (a.league_id || 0) || (b.spectators || 0) - (a.spectators || 0))
      .slice(0, limit)
      .map((g) => {
        const named = g.team_name_radiant || g.team_name_dire
        return {
          id: `dota-live-${g.match_id}`,
          name: named
            ? `${g.team_name_radiant || 'Radiant'} vs ${g.team_name_dire || 'Dire'}`
            : `Ranked Live · ${g.average_mmr || '????'} AVG MMR`,
          status: 'running',
          videogame: { name: 'Dota 2', slug: 'dota2' },
          league: { name: g.league_id ? `League #${g.league_id}` : 'Ranked Matchmaking' },
          serie: { full_name: g.league_id ? 'Tournament game' : 'Live pubstomp' },
          opponents: [side(g.team_name_radiant, 'Radiant'), side(g.team_name_dire, 'Dire')],
          results: [{ score: g.radiant_score ?? 0 }, { score: g.dire_score ?? 0 }],
          begin_at: new Date((g.activate_time || 0) * 1000).toISOString(),
          source: 'opendota-live',
          liveData: {
            spectators: g.spectators || 0,
            gameTime: g.game_time || 0,
            team1Rounds: g.radiant_score ?? 0,
            team2Rounds: g.dire_score ?? 0,
          },
        }
      })
  } catch (err) {
    console.error('OpenDota live failed:', err)
    return []
  }
}

export async function getEsportsLive() {
  const [live, pro] = await Promise.all([getDotaLiveGames(), getDotaProMatches()])
  return { live, pro }
}
