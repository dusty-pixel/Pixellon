import { MaskHeading, SectionReveal } from './motion/Reveal'

const ACCENT_BARS = {
  blue: 'bg-brand-primary',
  accent: 'bg-brand-accent',
  cyan: 'bg-brand-accent2',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
}

/**
 * Section header with masked title reveal, pixel accent and index label.
 */
export default function SectionHeader({ title, subtitle, accent = 'blue', index, className = '' }) {
  const bar = ACCENT_BARS[accent] || ACCENT_BARS.blue
  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-2 flex items-center gap-3">
        {/* Pixel Block Accent */}
        <div className="flex items-center gap-1" aria-hidden>
          <span className={`h-5 w-1.5 rounded-none ${bar}`} />
          <span className="h-2 w-1.5 rounded-none bg-brand-accent" />
        </div>
        {index && (
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-brand-primary">
            {index}
          </span>
        )}
        <MaskHeading className="font-display text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
          {title}
        </MaskHeading>
      </div>
      {subtitle && (
        <SectionReveal delay={0.1}>
          <p className="ml-5 text-sm font-normal text-brand-muted sm:text-base">{subtitle}</p>
        </SectionReveal>
      )}
    </div>
  )
}
