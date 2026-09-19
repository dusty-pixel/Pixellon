import { Shield, Trophy, Zap, Gift, BookOpen, CheckCircle, Flame, Target } from 'lucide-react'

export const BADGES = [
  {
    id: 'b-founder',
    title: 'Founder #084',
    category: 'Legendary',
    icon: Shield,
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    description: 'One of the first 100 players who joined the Pixellon alpha platform.',
    unlockedAt: 'August 2026',
  },
  {
    id: 'b-esports',
    title: 'Esports Oracle',
    category: 'Epic',
    icon: Trophy,
    color: 'text-brand-accent border-brand-primary/40 bg-brand-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]',
    description: 'Accurately predicted 10+ pro match outcomes in the Arena.',
    unlockedAt: 'September 2026',
  },
  {
    id: 'b-veteran',
    title: '1,000h Club',
    category: 'Epic',
    icon: Zap,
    color: 'text-purple-400 border-purple-500/40 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    description: 'Logged over 1,000 recorded hours across verified Steam titles.',
    unlockedAt: 'July 2026',
  },
  {
    id: 'b-vault',
    title: 'Vault Hunter',
    category: 'Rare',
    icon: Gift,
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    description: 'Claimed 10+ free weekly drops from the Free Games Vault.',
    unlockedAt: 'September 2026',
  },
  {
    id: 'b-codex',
    title: 'Codex Scribe',
    category: 'Rare',
    icon: BookOpen,
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    description: 'Authored and contributed community guides to the Game Codex.',
    unlockedAt: 'August 2026',
  },
  {
    id: 'b-steam',
    title: 'Steam Verified',
    category: 'Special',
    icon: CheckCircle,
    color: 'text-blue-400 border-blue-500/40 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    description: 'Verified public 64-bit Steam ID connected with live stats sync.',
    unlockedAt: 'September 2026',
  },
  {
    id: 'b-streak',
    title: 'Night Owl Streak',
    category: 'Common',
    icon: Flame,
    color: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    description: 'Maintained a 7-day continuous active presence in the Pixellon hub.',
    unlockedAt: 'September 2026',
  },
  {
    id: 'b-sharpshooter',
    title: 'Ace Marksman',
    category: 'Rare',
    icon: Target,
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    description: 'Achieved an above-average precision rating in tactical FPS titles.',
    unlockedAt: 'August 2026',
  },
]

export default function ProfileBadges() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-brand-text">
            Trophy Case & Achievements
          </h3>
          <p className="text-xs text-brand-muted">
            Badges earned through gameplay, community participation, and tournament challenges.
          </p>
        </div>
        <span className="rounded-lg bg-surface-900 border border-surface-700 px-3 py-1 font-mono text-xs font-semibold text-brand-accent">
          {BADGES.length} Badges Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BADGES.map((badge) => {
          const Icon = badge.icon
          return (
            <div
              key={badge.id}
              className="group relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-5 transition-all hover:border-brand-primary/50 hover:bg-surface-900"
            >
              <div className="flex items-start justify-between mb-3.5">
                <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${badge.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-muted">
                  {badge.category}
                </span>
              </div>

              <h4 className="font-display text-sm font-bold text-brand-text group-hover:text-brand-accent transition-colors">
                {badge.title}
              </h4>
              <p className="mt-1 text-xs text-brand-muted leading-relaxed line-clamp-2">
                {badge.description}
              </p>

              <div className="mt-4 pt-3 border-t border-surface-700 flex items-center justify-between text-[10px] font-mono text-brand-muted">
                <span>Earned</span>
                <span className="text-brand-text font-medium">{badge.unlockedAt}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
