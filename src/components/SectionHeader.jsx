/**
 * Section header with title, optional subtitle, and brand accent decoration.
 */
export default function SectionHeader({ title, subtitle, accent = 'blue', className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {/* Pixel Block Accent */}
        <div className="flex items-center gap-1">
          <span className="h-5 w-1.5 bg-brand-primary rounded-none" />
          <span className="h-2 w-1.5 bg-brand-accent rounded-none" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-brand-text">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="ml-5 text-sm sm:text-base text-brand-muted font-normal">{subtitle}</p>
      )}
    </div>
  )
}
