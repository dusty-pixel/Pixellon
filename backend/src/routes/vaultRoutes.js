import express from 'express'

const router = express.Router()

/**
 * Vault live-stats cache. Upstream APIs (Steam) are rate-limited and
 * key-gated, so the backend fetches periodically and serves cached
 * values to browsers. In-memory TTL — swap for Redis when scaling.
 */
const cache = new Map()
const TTL_MS = 5 * 60 * 1000

function getCached(key) {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data
  cache.delete(key)
  return null
}

function setCached(key, data) {
  if (cache.size > 500) cache.clear()
  cache.set(key, { at: Date.now(), data })
}

// GET /api/vault/steam-players/:appid → { appId, players, cachedAt }
router.get('/steam-players/:appid', async (req, res) => {
  const { appid } = req.params
  if (!/^\d+$/.test(appid)) {
    return res.status(400).json({ error: 'Invalid app id' })
  }
  const key = `steam-players:${appid}`
  const hit = getCached(key)
  if (hit) return res.json({ ...hit, cached: true })

  const apiKey = process.env.STEAM_API_KEY
  if (!apiKey) {
    // Key not configured — tell the frontend to hide live stats.
    return res.status(204).end()
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const upstream = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}&key=${apiKey}`,
      { signal: controller.signal }
    )
    clearTimeout(timer)
    if (!upstream.ok) throw new Error(`Steam responded ${upstream.status}`)
    const data = await upstream.json()
    const players = data?.response?.player_count
    if (typeof players !== 'number') throw new Error('No player count in response')
    const payload = { appId: appid, players, cachedAt: new Date().toISOString() }
    setCached(key, payload)
    return res.json({ ...payload, cached: false })
  } catch (error) {
    console.warn(`[Vault] Steam players fetch failed for ${appid}: ${error.message}`)
    return res.status(502).json({ error: 'Live stats unavailable' })
  }
})

export default router
