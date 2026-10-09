import { useState, useEffect } from 'react'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import PageTransition from '../components/PageTransition'
import { SectionReveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import { PixelPatternBg } from '../components/BrandDecorations'
import TlouSpotlightHero from '../components/tlou/TlouSpotlightHero'

const FALLBACK_UPCOMING = {
  id: 'upcoming-steam',
  slug: 'upcoming-steam',
  ranking: 'SOON',
  rankingBadge: '🔥 STEAM UPCOMING RELEASES',
  title: 'LOADING UPCOMING...',
  subtitle: 'UPCOMING RELEASES',
  edition: 'UPCOMING FEED',
  developer: 'Steam Network',
  publisher: 'Various',
  producedBy: 'STEAM DEVELOPERS',
  releaseDate: 'Coming Soon',
  genres: ['Upcoming', 'Anticipated'],
  rating: 'N/A',
  metacritic: 0,
  ageRating: 'RP - Rating Pending',
  heroImage: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/page_bg_raw.jpg',
  synopsis: 'Loading the most highly anticipated upcoming releases directly from the Steam database.',
  logline: 'The future of gaming, updated live.',
  trailer: {
    title: 'Upcoming Trailer',
    youtubeId: 'Kg-j7IxRvGY',
    youtubeUrl: 'https://www.youtube.com/watch?v=Kg-j7IxRvGY',
    channel: 'Steam',
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/page_bg_raw.jpg',
    duration: '2:00',
    source: 'Trailer TV',
    verified: true,
  },
  awards: [
    { organization: 'Steam Database', award: 'Top Anticipated Title', date: 'Upcoming' },
    { organization: 'Community Wishlist', award: 'High Wishlist Count', date: 'Current' },
    { organization: 'Next Fest', award: 'Featured Demo', date: 'Soon' }
  ],
  milestones: {
    activePlayers: '0',
    criticalScore: 'TBA',
    communityMilestone: 'Wishlisted',
    verifiedStatus: 'Pre-Release',
  },
  platforms: ['PC', 'Steam'],
  cta: { primary: 'PRE-ORDER', primaryUrl: '#', secondary: 'WATCH TRAILER' },
  dataSource: { name: 'Steam API', isLive: true, lastUpdated: new Date().toISOString().split('T')[0] },
}

export default function Indie() {
  const [indies, setIndies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSpotlightId, setActiveSpotlightId] = useState(null)
  const [spotlightGame, setSpotlightGame] = useState(FALLBACK_UPCOMING)
  const [spotlightList, setSpotlightList] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const base = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${base}/vault/upcoming-steam`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setIndies(data)
            
            // Map for the Spotlight top bar
            const mappedList = data.slice(0, 5).map((g, i) => ({
              id: g.id,
              ranking: 'SOON',
              rankingBadge: '🔥 STEAM UPCOMING',
              title: g.title.toUpperCase(),
              subtitle: 'ANTICIPATED',
              developer: 'Steam Developer',
              metacritic: 0,
              heroImage: g.image,
              isLiveApi: true,
            }))
            setSpotlightList(mappedList)
            
            // Map the first game for the Hero
            setActiveSpotlightId(data[0].id)
            setSpotlightGame(mapSteamToRich(data[0]))
          }
        }
      } catch (err) {
        console.error('Failed to load upcoming steam games', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const mapSteamToRich = (game) => {
    return {
      ...FALLBACK_UPCOMING,
      id: game.id,
      title: game.title.toUpperCase(),
      heroImage: game.heroImage || game.image,
      trailer: { ...FALLBACK_UPCOMING.trailer, thumbnail: game.image || game.heroImage },
      synopsis: `Experience ${game.title}, one of the most highly anticipated upcoming releases on Steam. Add it to your wishlist today.`,
      cta: { primary: 'WISHLIST', primaryUrl: '#', secondary: 'WATCH TRAILER' }
    }
  }

  const handleSelectSpotlight = (id) => {
    const selected = indies.find(g => g.id === id)
    if (selected) {
      setActiveSpotlightId(id)
      setSpotlightGame(mapSteamToRich(selected))
    }
  }

  if (loading) {
    return (
      <PageTransition className="mx-auto max-w-[1720px] px-6 py-20 flex justify-center items-center min-h-[50vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-brand-primary"></div>
      </PageTransition>
    )
  }

  const otherIndies = indies.slice(1)

  return (
    <PageTransition className="mx-auto max-w-[1720px] pb-12 space-y-16">
      
      {/* ── Cinematic Hero ── */}
      <TlouSpotlightHero
        game={spotlightGame}
        spotlightList={spotlightList}
        activeId={activeSpotlightId}
        onSelectGame={handleSelectSpotlight}
      />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <SectionReveal>
        <section id="indie-header" className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-8 sm:p-12 text-center">
          <PixelPatternBg />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-xs font-mono font-semibold text-brand-accent tracking-wide">
              <span>STEAM API SYNC</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text">
              Indie Game Spotlights & Upcoming Releases
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-brand-muted leading-relaxed">
              Discover standout releases, innovative mechanics, and highly anticipated titles pulled directly from the Steam database.
            </p>
          </div>
        </section>
        </SectionReveal>

        <section id="indie-grid">
          <SectionHeader
            title="More Upcoming Titles"
            subtitle="Top recommended games to add to your wishlist."
            accent="accent"
          />
          {otherIndies.length ? (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {otherIndies.map((game) => (
                <StaggerItem key={game.id} className="h-full">
                  <GameCard {...game} tagColor="accent" />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-surface-700 bg-brand-surface p-12 text-center">
              <p className="font-display text-lg font-bold text-brand-text">No upcoming titles right now</p>
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  )
}
