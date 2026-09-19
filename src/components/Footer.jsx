import { Link } from 'react-router-dom'
import { PixellonLogo } from './PixellonLogo'
import { BrandPillarsBar, PixelCross } from './BrandDecorations'

export default function Footer() {
  return (
    <footer className="border-t border-surface-700 bg-surface-900 w-full">
      {/* Brand Pillars Strip */}
      <div className="border-b border-surface-700 bg-brand-surface/40 py-3.5 px-6 sm:px-10 lg:px-12 w-full">
        <BrandPillarsBar />
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-12 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
              <PixellonLogo withTagline={true} taglineText="Play. Share. Belong." size="md" />
            </Link>
            <p className="text-sm leading-relaxed text-brand-muted">
              Built for every player — small pixels, big possibilities.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-accent2">
              <PixelCross size={12} />
              <span>GAMES × COMMUNITY</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest font-mono text-brand-accent">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/news', label: 'News & Updates' },
                { to: '/free-games', label: 'Free Games' },
                { to: '/streams', label: 'Live Streams' },
                { to: '/esports', label: 'Esports' },
                { to: '/indie', label: 'Indie Spotlights' },
                { to: '/deals', label: 'Game Deals' },
                { to: '/codex', label: 'The Codex' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* New Here? */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest font-mono text-brand-accent">
              Community
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/gateway"
                  className="text-sm font-medium text-brand-accent hover:text-brand-accent2 transition-colors"
                >
                  The Gateway (Starter Zone)
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors"
                >
                  Honest Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors"
                >
                  Player Profile
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-xs text-brand-muted block">Brand Philosophy</span>
                <span className="text-xs italic text-brand-accent2 font-sans">
                  "Small pixels. Big possibilities."
                </span>
              </li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest font-mono text-brand-accent">
              Get Updates
            </h4>
            <p className="mb-3 text-sm text-brand-muted">
              Get weekly gaming drops, free claim alerts, and community picks.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="player@pixellon.gg"
                id="newsletter-email"
                className="flex-1 rounded-lg border border-surface-700 bg-brand-surface px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
              <button
                id="newsletter-subscribe"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-primary/85 shadow-[0_0_12px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer font-sans"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted font-mono">
          <div>
            © {new Date().getFullYear()} Pixellon. Play. Share. Belong.
          </div>
          <div className="text-brand-muted">
            All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
