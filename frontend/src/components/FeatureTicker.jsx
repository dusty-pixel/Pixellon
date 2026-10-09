const ITEMS = [
  'Free game drops',
  'Indie radar',
  'Vault wiki',
  'Honest reviews',
  'Live esports',
  'Stream directory',
  'Deals vault',
  'Release calendar',
  'Beginner gateway',
  'Community lobby',
  'Top rated picks',
  'Discord alerts',
]

/**
 * Site-wide feature ticker strip — mono uppercase items with square
 * separators on an infinite smooth marquee. Rendered in the app shell
 * so it appears on every screen. Pauses on hover.
 */
export default function FeatureTicker() {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 overflow-hidden border-b border-surface-700 bg-brand-surface"
    >
      <div className="marquee-track py-2" style={{ '--marquee-duration': '50s' }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-8 pr-8">
            {ITEMS.map((item) => (
              <span key={item} className="flex shrink-0 items-center gap-8">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-muted">
                  {item}
                </span>
                <span className="h-1 w-1 shrink-0 bg-brand-primary" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
