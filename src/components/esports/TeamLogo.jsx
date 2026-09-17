import { useState } from 'react'

export default function TeamLogo({
  src,
  name = 'Team',
  acronym = '',
  color = '#2563EB',
  size = 'md',
  className = '',
}) {
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    xs: 'h-7 w-7',
    sm: 'h-9 w-9',
    md: 'h-14 w-14',
    lg: 'h-16 w-16 sm:h-20 sm:w-20',
    xl: 'h-20 w-20 sm:h-24 sm:w-24',
  }

  const containerSize = sizeClasses[size] || sizeClasses.md
  const monogram = (acronym || name.slice(0, 3) || 'TM').toUpperCase()

  // Ensure color has a fallback
  const accentColor = color && color !== '#FFFFFF' && color !== '#000000' ? color : '#38BDF8'

  if (!src || hasError) {
    return (
      <div
        className={`relative flex items-center justify-center select-none transition-transform ${containerSize} ${className}`}
        title={name}
      >
        {/* Ambient backlight */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 scale-125 transition-opacity group-hover:opacity-60"
          style={{ background: accentColor }}
        />
        {/* Stylized Esports Crest */}
        <div
          className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl p-2 border font-mono font-black tracking-wider transition-all group-hover:scale-105"
          style={{
            background: `linear-gradient(145deg, #182030 0%, #0E121B 100%)`,
            borderColor: `${accentColor}55`,
            boxShadow: `0 8px 24px rgba(0,0,0,0.6), inset 0 1px 1px ${accentColor}40`,
          }}
        >
          <span
            className="truncate font-black text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            style={{ color: accentColor }}
          >
            {monogram}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group/logo relative flex items-center justify-center select-none transition-transform duration-300 ${containerSize} ${className}`}
      title={name}
    >
      {/* Signature Team Ambient Light / Aura */}
      <div
        className="absolute inset-1 rounded-full blur-xl opacity-30 scale-110 pointer-events-none transition-all duration-300 group-hover:scale-135 group-hover:opacity-60"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Floating High-Res Team Emblem */}
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className="relative z-10 h-full w-full object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.75)] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]"
        loading="lazy"
      />
    </div>
  )
}
