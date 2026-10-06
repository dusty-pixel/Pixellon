import SectionHeader from '../SectionHeader'
import { Stagger, StaggerItem } from '../motion/Reveal'
import { useDiscovery } from '../../gamification/XPProvider'
import { curatedStreams } from '../../data/mockStreams'
import LobbyChat from './LobbyChat'

const SEEDS = ['Nova', 'Rook', 'Byte', 'Pixel', 'Volt', 'Echo']

function fmtViewers(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

/** Multiplayer lobby preview: who's online and what they're playing. */
export default function CommunityLobby() {
  const discover = useDiscovery('community-lobby', 'COMMUNITY LOBBY', 10)
  const players = curatedStreams.slice(0, 6)

  return (
    <section id="community" ref={discover}>
      <SectionHeader index="04" title="The Lobby" subtitle="A multiplayer lobby that never sleeps. Pull up a chair." />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 overflow-hidden rounded-2xl border border-surface-700 bg-surface-900">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-surface-700 bg-brand-surface px-4 py-3 font-pixel text-xs tracking-[0.2em] sm:px-6">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              128 PLAYERS ONLINE
            </span>
            <span className="text-brand-muted">24 WORLDS ACTIVE</span>
            <span className="ml-auto hidden text-brand-muted sm:block">WELCOME TO THE LOBBY</span>
          </div>
          <Stagger className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:p-6" stagger={0.06}>
            {players.map((s, i) => (
              <StaggerItem key={s.id}>
                <div className="group flex items-center gap-3 rounded-xl border border-surface-700 bg-brand-surface p-3 transition-all hover:border-brand-primary/60 hover:shadow-md">
                  <div className="relative shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${SEEDS[i % SEEDS.length]}`}
                      alt={`${s.user_name} avatar`}
                      className="h-11 w-11 rounded-lg border border-brand-primary/40 bg-surface-800"
                      loading="lazy"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-brand-surface bg-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-brand-text">
                      {s.user_name}
                      <span className="ml-2 font-mono text-[10px] font-medium text-emerald-400">● PLAYER</span>
                    </p>
                    <p className="truncate text-xs text-brand-muted">
                      {s.game_name} • {fmtViewers(s.viewer_count)} watching
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
          <LobbyChat />
        </div>
      </div>
    </section>
  )
}
