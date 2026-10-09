/**
 * Section header with title, optional subtitle, and optional accent color.
 */
export default function SectionHeader({ title, subtitle, accent = 'violet', className = '' }) {
  const accentMap = {
    violet: 'bg-accent-violet',
    cyan: 'bg-accent-cyan',
    amber: 'bg-accent-amber',
    rose: 'bg-accent-rose',
    emerald: 'bg-accent-emerald',
  }

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`h-5 w-1 rounded-full ${accentMap[accent]}`} />
        <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">{title}</h2>
      </div>
      {subtitle && (
        <p className="ml-4 text-sm text-text-secondary">{subtitle}</p>
      )}
    </div>
  )
}
