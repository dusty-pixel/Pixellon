import { useState } from 'react'
import TlouAtmosphere from './TlouAtmosphere'
import TlouNav from './TlouNav'
import TlouHeroLeft from './TlouHeroLeft'
import TlouAwardsSidebar from './TlouAwardsSidebar'
import TlouTrailerCard from './TlouTrailerCard'
import TlouTrailerModal from './TlouTrailerModal'
import { toggleTlouAudio } from './TlouAudio'

/**
 * Master Spotlight Hero Component
 * Perfectly renders the immersive The Last of Us UI layout
 * with complete dynamic data injection, video trailer modal, and sound ambiance.
 */
export default function TlouSpotlightHero({
  game,
  spotlightList,
  activeId,
  onSelectGame,
  onOpenSearch,
}) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const handleToggleAudio = () => {
    const newState = toggleTlouAudio()
    setIsAudioPlaying(newState)
  }

  return (
    <section
      id="hero"
      className="relative w-full mx-auto max-w-[1720px] px-2 sm:px-4 lg:px-6 py-2 sm:py-4 select-none"
    >
      {/* ── Outer Framed Container ── */}
      <div className="relative w-full rounded-2xl overflow-hidden tlou-cinematic-frame bg-[#060A08] flex flex-col">
        {/* ── Dynamic Atmospheric Background & Backdrop ───────────── */}
        <TlouAtmosphere bgImage={game?.heroImage} />

        {/* ── Top Navigation Bar ──────────────────────────────────── */}
        <TlouNav
          game={game}
          spotlightList={spotlightList}
          activeId={activeId}
          onSelectGame={onSelectGame}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          onOpenSearch={onOpenSearch}
        />

        {/* ── Main Grid Layout (Left Column & Right Column) ────────── */}
        <div className="relative z-20 px-5 sm:px-8 lg:px-10 py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center">
          {/* Left Column: Title, Synopsis, CTA, Socials */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <TlouHeroLeft
              game={game}
              onWatchTrailer={() => setIsTrailerOpen(true)}
            />
          </div>

          {/* Right Column: Awards at top, Release Trailer below */}
          <div className="lg:col-span-4 flex flex-col space-y-4 lg:items-end w-full">
            {/* Awards & Accolades */}
            <div className="w-full max-w-sm">
              <TlouAwardsSidebar game={game} />
            </div>

            {/* Embedded Release Trailer Preview Card */}
            <div className="w-full max-w-sm">
              <TlouTrailerCard
                game={game}
                onPlayTrailer={() => setIsTrailerOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Trailer Modal ──────────────────────────────── */}
      <TlouTrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailer={game?.trailer}
        gameTitle={game?.title}
      />
    </section>
  )
}
