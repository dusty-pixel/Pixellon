/**
 * Pixellon Vault record — the identity layer.
 *
 * The Vault never depends on a single API. External sources only
 * enrich a normalized Pixellon record keyed by `pxId`, carrying
 * `externalIds` + per-field `provenance` so any source can be
 * swapped later (incl. a future Postgres migration).
 *
 *   record = buildVaultRecord({ rawg, wikidata, steamAppId, deals, streams })
 */

let pxCounter = 0

export function pxIdFor(source, sourceId) {
  const seed = `${source}:${sourceId}`
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return `PX-${String(Math.abs(h) % 90000 + 10000)}`
}

function first(...vals) {
  return vals.find((v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))
}

export function buildVaultRecord({ rawg = null, wikidata = null, steamAppId = null, deals = null, streams = [] } = {}) {
  const title = first(rawg?.name, wikidata?.title, 'Unknown Title')
  const provenance = {}
  const mark = (field, src) => {
    provenance[field] = src
  }

  const record = {
    pxId: pxCounter ? `PX-SESSION-${++pxCounter}` : `PX-${Date.now().toString(36).toUpperCase()}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    facts: {},
    externalIds: {},
    provenance,
    deals,
    streams: (streams || []).slice(0, 4),
    sources: [],
  }

  if (wikidata) {
    record.sources.push('wikidata (CC0)')
    record.externalIds.wikidata = wikidata.qid
    if (wikidata.releaseDate) { record.facts.releaseDate = wikidata.releaseDate; mark('releaseDate', 'wikidata') }
    if (wikidata.developers?.length) { record.facts.developers = wikidata.developers; mark('developers', 'wikidata') }
    if (wikidata.publishers?.length) { record.facts.publishers = wikidata.publishers; mark('publishers', 'wikidata') }
    if (wikidata.platforms?.length) { record.facts.platforms = wikidata.platforms; mark('platforms', 'wikidata') }
    if (wikidata.genres?.length) { record.facts.genres = wikidata.genres; mark('genres', 'wikidata') }
    if (wikidata.series?.length) { record.facts.series = wikidata.series; mark('series', 'wikidata') }
    if (wikidata.website) { record.facts.website = wikidata.website; mark('website', 'wikidata') }
    if (wikidata.steamAppId) { record.externalIds.steam = wikidata.steamAppId; mark('steamAppId', 'wikidata') }
  }

  if (rawg) {
    record.sources.push('rawg')
    if (rawg.id) record.externalIds.rawg = rawg.id
    for (const [field, value, src] of [
      ['developers', rawg.developers?.map((d) => d.name), 'rawg'],
      ['publishers', rawg.publishers?.map((p) => p.name), 'rawg'],
      ['releaseDate', rawg.released, 'rawg'],
      ['genres', rawg.genres?.map((g) => g.name), 'rawg'],
      ['platforms', rawg.parent_platforms?.map((p) => p.platform.name), 'rawg'],
      ['metacritic', rawg.metacritic, 'rawg'],
      ['cover', rawg.background_image, 'rawg'],
      ['website', rawg.website, 'rawg'],
    ]) {
      if (!record.facts[field] && value?.length !== 0 && value !== undefined && value !== null) {
        record.facts[field] = value
        mark(field, src)
      }
    }
    if (rawg.description_raw) { record.facts.overview = rawg.description_raw; mark('overview', 'rawg') }
  }

  if (steamAppId) {
    record.externalIds.steam = String(steamAppId)
    mark('steamAppId', record.externalIds.steam && wikidata?.steamAppId ? 'wikidata' : 'rawg-stores')
  }

  if (deals) {
    record.sources.push('cheapshark')
    mark('deals', 'cheapshark')
  }
  if (streams?.length) {
    record.sources.push('twitch')
    mark('streams', 'twitch')
  }

  return record
}
