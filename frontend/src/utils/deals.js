/**
 * CheapShark — keyless public PC-deals API.
 * Current offers per store + historical cheapest price.
 * Deal links must route through CheapShark redirects (see `url`).
 */

const BASE = 'https://www.cheapshark.com/api/1.0'
const withTimeout = (ms = 8000) => ({ signal: AbortSignal.timeout(ms) });

let storeCache = null
async function storeNames() {
  if (storeCache) return storeCache
  try {
    const res = await fetch(`${BASE}/stores`, withTimeout())
    if (!res.ok) throw new Error('stores failed')
    const list = await res.json()
    storeCache = Object.fromEntries((list || []).map((s) => [String(s.storeID), s.storeName]))
  } catch {
    storeCache = {}
  }
  return storeCache
}

/**
 * Price matrix for a game title.
 * Returns null when unavailable — callers must degrade gracefully.
 */
export async function getGameDeals(title) {
  try {
    const search = await fetch(
      `${BASE}/games?title=${encodeURIComponent(title)}&limit=1`,
      withTimeout()
    )
    if (!search.ok) throw new Error('deal search failed')
    const hits = await search.json()
    if (!hits?.length) return null

    const detail = await fetch(`${BASE}/games?id=${hits[0].gameID}`, withTimeout())
    if (!detail.ok) throw new Error('deal detail failed')
    const info = await detail.json()
    const names = await storeNames()

    const deals = (info.deals || [])
      .map((d) => ({
        store: names[String(d.storeID)] || `Store ${d.storeID}`,
        price: Number(d.price),
        retail: Number(d.retailPrice),
        savings: Number(d.savings),
        url: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`,
      }))
      .sort((a, b) => a.price - b.price)
      .slice(0, 6)

    return {
      title: info.info?.title || title,
      thumb: info.info?.thumb || null,
      historicalLow: info.cheapestPriceEver ? Number(info.cheapestPriceEver.price) : null,
      historicalLowDate: info.cheapestPriceEver
        ? new Date(info.cheapestPriceEver.date * 1000).toISOString().slice(0, 10)
        : null,
      deals,
      source: 'cheapshark',
    }
  } catch (err) {
    console.error('CheapShark fetch failed:', err)
    return null
  }
}
