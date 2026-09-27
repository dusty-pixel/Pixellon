/**
 * Wikidata — the CC0 open foundation of the Vault.
 * Titles, releases, developers, publishers, platforms, genres,
 * series, websites + cross-IDs (Steam App ID, IGDB ID).
 * Browser-safe: both endpoints send CORS `*`.
 */

const WB_API = 'https://www.wikidata.org/w/api.php'
const SPARQL = 'https://query.wikidata.org/sparql'
const GAME_QID = 'Q7889' // video game

const withTimeout = (ms = 10000) => ({ signal: AbortSignal.timeout(ms) })

async function sparqlSelect(query) {
  const url = `${SPARQL}?format=json&query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    ...withTimeout(),
    headers: { Accept: 'application/sparql-results+json' },
  })
  if (!res.ok) throw new Error(`Wikidata SPARQL failed: ${res.status}`)
  return res.json()
}

function splitPipe(v) {
  return (v?.value || '').split('|').map((s) => s.trim()).filter(Boolean)
}

/** Batch-check which QIDs are (subclasses of) video game. Returns a Set. */
async function filterGameQids(qids) {
  if (!qids.length) return new Set()
  const values = qids.map((q) => `wd:${q}`).join(' ')
  const data = await sparqlSelect(
    `SELECT ?g WHERE { VALUES ?g { ${values} } ?g wdt:P31/wdt:P279* wd:${GAME_QID}. }`
  )
  return new Set(
    (data.results?.bindings || []).map((b) => b.g.value.split('/').pop())
  )
}

/**
 * Search Wikidata for video games by title.
 * Returns Vault-card-shaped results with `wd-` prefixed ids.
 */
export async function searchWikidataGames(query, limit = 6) {
  try {
    const url =
      `${WB_API}?action=wbsearchentities&search=${encodeURIComponent(query)}` +
      `&language=en&format=json&origin=*&limit=12`
    const res = await fetch(url, withTimeout())
    if (!res.ok) throw new Error('Wikidata search failed')
    const data = await res.json()
    const hits = (data.search || []).filter((h) => h.id?.startsWith('Q'))
    const games = await filterGameQids(hits.map((h) => h.id))
    return hits
      .filter((h) => games.has(h.id))
      .slice(0, limit)
      .map((h) => ({
        id: `wd-${h.id}`,
        qid: h.id,
        title: h.label,
        genre: (h.description || 'Video game').split(',')[0].slice(0, 28),
        platform: [],
        rating: null,
        image:
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
        excerpt: h.description || h.label,
        source: 'wikidata',
      }))
  } catch (err) {
    console.error('Wikidata search failed:', err)
    return []
  }
}

/** Resolve a game title to its Wikidata QID (first verified game hit). */
export async function findWikidataGameId(title) {
  try {
    const url =
      `${WB_API}?action=wbsearchentities&search=${encodeURIComponent(title)}` +
      `&language=en&format=json&origin=*&limit=5`
    const res = await fetch(url, withTimeout())
    if (!res.ok) return null
    const data = await res.json()
    const ids = (data.search || []).map((h) => h.id).filter((id) => id?.startsWith('Q'))
    const games = await filterGameQids(ids)
    // Prefer exact label match, else first verified game.
    const exact = (data.search || []).find(
      (h) => games.has(h.id) && h.label?.toLowerCase() === title.toLowerCase()
    )
    return exact?.id || ids.find((id) => games.has(id)) || null
  } catch (err) {
    console.error('Wikidata resolve failed:', err)
    return null
  }
}

/** Full normalized record for one game QID. */
export async function getWikidataGame(qid) {
  try {
    const clean = String(qid).replace(/^wd-/, '')
    const data = await sparqlSelect(`
      SELECT ?game ?gameLabel ?gameDescription ?pubDate ?website ?steamId
        (GROUP_CONCAT(DISTINCT ?devLabel; SEPARATOR="|") AS ?developers)
        (GROUP_CONCAT(DISTINCT ?pubLabel; SEPARATOR="|") AS ?publishers)
        (GROUP_CONCAT(DISTINCT ?platLabel; SEPARATOR="|") AS ?platforms)
        (GROUP_CONCAT(DISTINCT ?genreLabel; SEPARATOR="|") AS ?genres)
        (GROUP_CONCAT(DISTINCT ?seriesLabel; SEPARATOR="|") AS ?series)
      WHERE {
        VALUES ?game { wd:${clean} }
        OPTIONAL { ?game wdt:P577 ?pubDate. }
        OPTIONAL { ?game wdt:P856 ?website. }
        OPTIONAL { ?game wdt:P1733 ?steamId. }
        OPTIONAL { ?game wdt:P178 ?dev. ?dev rdfs:label ?devLabel. FILTER(LANG(?devLabel) = "en") }
        OPTIONAL { ?game wdt:P123 ?pub. ?pub rdfs:label ?pubLabel. FILTER(LANG(?pubLabel) = "en") }
        OPTIONAL { ?game wdt:P400 ?plat. ?plat rdfs:label ?platLabel. FILTER(LANG(?platLabel) = "en") }
        OPTIONAL { ?game wdt:P136 ?g. ?g rdfs:label ?genreLabel. FILTER(LANG(?genreLabel) = "en") }
        OPTIONAL { ?game wdt:P179 ?s. ?s rdfs:label ?seriesLabel. FILTER(LANG(?seriesLabel) = "en") }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      GROUP BY ?game ?gameLabel ?gameDescription ?pubDate ?website ?steamId
    `)
    const b = data.results?.bindings?.[0]
    if (!b) return null
    const date = b.pubDate?.value || ''
    return {
      qid: clean,
      title: b.gameLabel?.value || '',
      description: b.gameDescription?.value || '',
      releaseDate: date.slice(0, 10) || null,
      year: date.slice(0, 4) || null,
      developers: splitPipe(b.developers),
      publishers: splitPipe(b.publishers),
      platforms: splitPipe(b.platforms),
      genres: splitPipe(b.genres),
      series: splitPipe(b.series),
      website: b.website?.value || null,
      steamAppId: b.steamId?.value || null,
      wikidataUrl: `https://www.wikidata.org/wiki/${clean}`,
    }
  } catch (err) {
    console.error('Wikidata record fetch failed:', err)
    return null
  }
}
