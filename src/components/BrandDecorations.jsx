/**
 * Brand motifs and geometric pixel decorations strictly from Pixellon Brand Kit v1.0
 */

export function PixelCornerBadge({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Top Left Corner */}
      <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-brand-primary pointer-events-none" />
      {/* Top Right Corner */}
      <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-brand-accent pointer-events-none" />
      {/* Bottom Left Corner */}
      <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-brand-accent pointer-events-none" />
      {/* Bottom Right Corner */}
      <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-brand-primary pointer-events-none" />
      {children}
    </div>
  );
}

export function PixelCross({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`text-brand-accent ${className}`}
    >
      <rect x="6" y="0" width="4" height="16" />
      <rect x="0" y="6" width="16" height="4" />
      <rect x="6" y="6" width="4" height="4" fill="#DBEAFE" />
    </svg>
  );
}

export function BrandPillarsBar({ className = '' }) {
  const pillars = ['GAMES', 'PEOPLE', 'CULTURE', 'COMMUNITY'];
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 text-xs tracking-widest uppercase font-mono font-semibold text-brand-muted ${className}`}>
      {pillars.map((pillar, idx) => (
        <span key={pillar} className="flex items-center gap-3">
          <span className="text-brand-text hover:text-brand-accent transition-colors">
            {pillar}
          </span>
          {idx < pillars.length - 1 && (
            <span className="text-brand-primary font-bold">×</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function PixelPatternBg({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Pixel floating blocks */}
      <div className="absolute top-8 left-12 h-3 w-3 bg-brand-primary/40 animate-float" />
      <div className="absolute top-20 right-16 h-4 w-4 bg-brand-accent/30 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-16 left-1/4 h-2.5 w-2.5 bg-brand-accent2/30 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-10 right-1/3 h-3 w-3 bg-brand-accent3/20 animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Subtle pixel dots matching website background pattern */}
      <div className="absolute inset-0 opacity-40 [background-image:var(--theme-bg-pattern)] [background-size:30px_30px]" />
    </div>
  );
}
