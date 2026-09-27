/**
 * Multi-platform live aggregator for the Streams radar.
 *
 *  Twitch   — Helix when keys exist, else curated fallback (see utils/api).
 *  Kick     — keyless public channel API, resolved over a watchlist.
 *  YouTube  — activates with VITE_YOUTUBE_API_KEY, else empty.
 *
 * Every source normalizes to one shape; the UI never branches on
 * raw provider payloads.
 */

import { getTopStreams } from './api'

const withTimeout = (ms = 8000) => ({ signal: AbortSignal.timeout(ms) })

// Well-established Kick channels (slugs). Each resolves fail-soft;
// dead/renamed slugs simply contribute nothing.
const KICK_WATCHLIST = [
  'xqc',
  'n3on',
  'stableronaldo',
  'lacy',
  'adinross',
  'westcol',
  'trainwreckstv',
  'roshtein',
  'zackrawrr',
  'casinodaddy',
  'xposed',
  'esfandtv',
  'nmplol',
  'extraemily',
  'nickmercs',
  'sketch',
]

function normalizeKick(channel) {
  const live = channel?.livestream
  if (!live || live.is_live === false) return null
  const slug = channel.slug || channel.user?.username
  if (!slug) return null
  return {
    id: `kick-${channel.id || slug}`,
    platform: 'kick',
    user_login: slug,
    user_name: channel.user?.username || slug,
    game_name: live.categories?.[0]?.name || 'Just Chatting',
    title: live.session_title || `${slug} is live`,
    viewer_count: Number(live.viewer_count) || 0,
    thumbnail_url: live.thumbnail?.url || null,
    avatar_url: channel.user?.profile_pic || null,
    url: `https://kick.com/${slug}`,
    language: live.language || 'en',
    started_at: live.created_at || null,
    verified: (channel.followers_count || 0) > 100000,
    tags: [],
  }
}

async function fetchKickChannel(slug) {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${slug}`, {
      headers: { Accept: 'application/json' },
      ...withTimeout(),
    })
    if (!res.ok) return null
    return normalizeKick(await res.json())
  } catch {
    return null
  }
}

export async function getKickStreams() {
  try {
    const results = await Promise.all(KICK_WATCHLIST.map(fetchKickChannel))
    return results
      .filter(Boolean)
      .sort((a, b) => b.viewer_count - a.viewer_count)
  } catch (err) {
    console.error('Kick feed failed:', err)
    return []
  }
}

/** YouTube live gaming — dormant until VITE_YOUTUBE_API_KEY is set. */
export async function getYouTubeStreams(maxResults = 12) {
  try {
    const key = import.meta.env?.VITE_YOUTUBE_API_KEY
    if (!key) return []
    const url =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live` +
      `&type=video&videoCategoryId=20&maxResults=${maxResults}&key=${key}`
    const res = await fetch(url, withTimeout())
    if (!res.ok) throw new Error('YouTube search failed')
    const data = await res.json()
    return (data.items || []).map((it) => ({
      id: `yt-${it.id?.videoId}`,
      platform: 'youtube',
      user_login: it.id?.videoId,
      user_name: it.snippet?.channelTitle || 'YouTube Gaming',
      game_name: 'Live Gaming',
      title: it.snippet?.title || 'Live stream',
      viewer_count: 0,
      thumbnail_url:
        it.snippet?.thumbnails?.high?.url || it.snippet?.thumbnails?.default?.url || null,
      avatar_url: null,
      url: `https://www.youtube.com/watch?v=${it.id?.videoId}`,
      language: 'en',
      started_at: it.snippet?.publishedAt || null,
      verified: false,
      tags: [],
    }))
  } catch (err) {
    console.error('YouTube feed failed:', err)
    return []
  }
}

function tagTwitch(s) {
  return {
    ...s,
    platform: 'twitch',
    url: `https://twitch.tv/${s.user_login}`,
  }
}

/** All platforms merged + sorted. Never rejects to empty — Twitch fallback persists. */
export async function getLiveStreams() {
  const [twitch, kick, youtube] = await Promise.all([
    getTopStreams().catch(() => []),
    getKickStreams(),
    getYouTubeStreams(),
  ])
  return [...twitch.map(tagTwitch), ...kick, ...youtube].sort(
    (a, b) => (b.viewer_count || 0) - (a.viewer_count || 0)
  )
}
