/**
 * Pixellon Official Brand Logo Component
 * Strictly built to Pixellon Brand Kit v1.0 specifications
 * Primary Color: #2563EB | Accents: #60A5FA, #93C5FD, #DBEAFE | Text: #F8FAFC
 */

export function PixellonIcon({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Outer rounded squircle in Brand Blue */}
      <rect width="128" height="128" rx="36" fill="#2563EB" />
      
      {/* Inner White Container */}
      <rect x="32" y="32" width="64" height="64" rx="20" fill="#FFFFFF" />
      
      {/* Pixellon Smile & Sparkle Star Emblem */}
      <path
        d="M 50 56 C 50 74, 78 74, 78 56"
        stroke="#2563EB"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Left Star */}
      <path
        d="M 50 48 Q 50 54 44 54 Q 50 54 50 60 Q 50 54 56 54 Q 50 54 50 48 Z"
        fill="#2563EB"
      />
      
      {/* Right Star */}
      <path
        d="M 78 48 Q 78 54 72 54 Q 78 54 78 60 Q 78 54 84 54 Q 78 54 78 48 Z"
        fill="#2563EB"
      />
    </svg>
  );
}


export function PixellonLogo({
  withTagline = false,
  taglineText = 'Play. Share. Belong.',
  size = 'md',
  className = '',
}) {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="inline-flex items-center gap-2.5">
        {/* Pixel 'P' Logo Mark */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={isLg ? 44 : isSm ? 26 : 34}
            height={isLg ? 44 : isSm ? 26 : 34}
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base Pixel P Frame */}
            {/* Top Loop */}
            <rect x="6" y="4" width="28" height="24" rx="3" fill="#2563EB" />
            {/* Stem */}
            <rect x="6" y="24" width="10" height="16" rx="2" fill="#2563EB" />
            
            {/* Inner Face badge in white */}
            <rect x="14" y="10" width="14" height="12" rx="2" fill="#F8FAFC" />
            
            {/* Smiley Face (Star/dot eyes & happy curved smile) */}
            <path
              d="M17.5 14L18 15L17.5 16L17 15Z"
              fill="#0B0F17"
            />
            <path
              d="M24.5 14L25 15L24.5 16L24 15Z"
              fill="#0B0F17"
            />
            <circle cx="18" cy="15" r="1.1" fill="#0B0F17" />
            <circle cx="24" cy="15" r="1.1" fill="#0B0F17" />
            <path
              d="M17.2 18 C19.5 20.2, 22.5 20.2, 24.8 18"
              stroke="#0B0F17"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Pixel accents around P */}
            <rect x="36" y="4" width="4" height="4" fill="#60A5FA" />
            <rect x="38" y="10" width="4" height="4" fill="#93C5FD" />
            <rect x="2" y="28" width="3.5" height="3.5" fill="#60A5FA" />
            <rect x="2" y="33" width="3" height="3" fill="#2563EB" />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="flex items-baseline">
          <span
            className={`font-display font-extrabold tracking-tight text-brand-text ${
              isLg ? 'text-3xl' : isSm ? 'text-lg' : 'text-2xl'
            }`}
          >
            pixell<span className="text-brand-accent">o</span>n
          </span>
          {/* Pixel Cross Dot Motif */}
          <span className="ml-1 inline-block h-1.5 w-1.5 bg-brand-accent rounded-none transform rotate-45" />
        </div>
      </div>

      {/* Brand Tagline */}
      {withTagline && (
        <span
          className={`font-sans tracking-wide text-brand-accent2 font-medium ${
            isLg ? 'text-xs pl-1 mt-1' : 'text-[11px] pl-0.5 mt-0.5'
          }`}
        >
          {taglineText}
        </span>
      )}
    </div>
  );
}

export default PixellonLogo;
