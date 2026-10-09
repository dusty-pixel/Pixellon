import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE_URL = 'https://pixellon.in'
export const SITE_NAME = 'Pixellon'

const TITLE_SUFFIX = 'Pixellon'

/** Per-route SEO: title (<60 chars), description (150-160 chars). */
export const ROUTE_SEO = {
  '/': {
    title: 'Free Games, Indie Games, Deals & Esports',
    description:
      'Pixellon is a free gaming discovery hub: 100% free PC game giveaways, indie game spotlights, game deals, honest reviews, release calendar and live esports.',
  },
  '/free-games': {
    title: 'Free PC Games & Giveaways This Week',
    description:
      'Track 100% free PC game drops across Steam, Epic Games Store and GOG. Verified giveaways updated daily with Discord alerts.',
  },
  '/news': {
    title: 'Latest Gaming News & Industry Wire',
    description:
      'Breaking gaming news, industry analysis and studio reporting — a live rotating wire of what matters in games right now.',
  },
  '/esports': {
    title: 'Live Esports Scores, Schedule & Results',
    description:
      'Follow live esports matches across CS2, VALORANT, League of Legends, Dota 2 and more — scores, schedules and results.',
  },
  '/deals': {
    title: 'PC Game Deals & Discount Tracker',
    description:
      'Compare PC game prices across stores and find the cheapest deals, historical lows and limited-time discounts.',
  },
  '/indie': {
    title: 'Indie Game Spotlights & Hidden Gems',
    description:
      'Discover the best indie games and hidden gems — hand-picked spotlights on bold ideas from independent studios.',
  },
  '/reviews': {
    title: 'Honest Game Reviews & Ratings',
    description:
      'In-depth, honest game reviews with clear verdicts, pros and cons — find out what is actually worth playing.',
  },
  '/calendar': {
    title: 'New Game Release Dates & Calendar',
    description:
      'Every confirmed and rumored game release date in one calendar — filter by PS5, Xbox, PC and Switch 2.',
  },
  '/streams': {
    title: 'Live Game Streams Directory',
    description:
      'Browse live gaming streams by category with viewer counts — find your next favorite streamer.',
  },
  '/vault': {
    title: 'Game Wiki & Codex Hub',
    description:
      'Community game wiki with guides, lore, metadata and verdicts — explore the Vault or contribute your own pages.',
  },
  '/gateway': {
    title: 'Beginner Friendly Games & Starter Guides',
    description:
      'New to gaming? Start with curated cozy and beginner friendly games plus jargon-free guides. No experience needed.',
  },
  '/profile': {
    title: 'Your Player Profile',
    description: 'Your Pixellon player card — badges, game library, battle station and community stats.',
  },
  '/signin': {
    title: 'Sign In to Pixellon',
    description: 'Sign in or create a free Pixellon account to track games, earn badges and join the community.',
  },
}

function matchRoute(pathname) {
  if (ROUTE_SEO[pathname]) return ROUTE_SEO[pathname]
  if (pathname.startsWith('/vault/')) return ROUTE_SEO['/vault']
  if (pathname.startsWith('/codex')) return ROUTE_SEO['/vault']
  return ROUTE_SEO['/']
}

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const m = selector.match(/\[(\w+)="([^"]+)"\]/)
    if (m) el.setAttribute(m[1], m[2])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Syncs document title, description, canonical and OG tags with the route. */
export function RouteSEO() {
  const { pathname } = useLocation()
  useEffect(() => {
    const { title, description } = matchRoute(pathname)
    const fullTitle = `${title} | ${TITLE_SUFFIX}`
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setCanonical(canonical)
  }, [pathname])
  return null
}

/** Injects a JSON-LD block (e.g. FAQPage). Removed on unmount. */
export function useJsonLd(id, data) {
  useEffect(() => {
    if (!data) return
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    el.textContent = JSON.stringify(data)
    document.head.appendChild(el)
    return () => {
      document.getElementById(id)?.remove()
    }
  }, [id, data])
}
