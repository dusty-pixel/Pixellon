import { Link } from 'react-router-dom'

export default function Footer() {
 return (
 <footer className="border-t border-surface-700 bg-surface-900">
 <div className="mx-auto max-w-7xl px-6 py-12">
 <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
 {/* Brand */}
 <div className="space-y-4">
 <Link to="/" className="inline-flex items-center gap-2">
 <div className="flex h-8 w-8 items-center justify-center rounded-none bg-pixel-blue/15">
 <span className="text-base font-bold text-pixel-blue">P</span>
 </div>
 <span className="font-display text-lg font-bold text-text-primary">
 Pixellon
 </span>
 </Link>
 <p className="text-sm leading-relaxed text-text-muted">
 Your portal to the gaming universe — news, reviews, indie gems, and a welcoming gateway for new players.
 </p>
 </div>

 {/* Explore */}
 <div>
 <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">Explore</h4>
 <ul className="space-y-2.5">
 {[
 { to: '/', label: 'Home' },
 { to: '/indie', label: 'Indie Spotlights' },
 { to: '/reviews', label: 'Reviews' },
 { to: '/calendar', label: 'Release Calendar' },
 ].map((link) => (
 <li key={link.to}>
 <Link to={link.to} className="text-sm text-text-secondary transition-colors hover:text-pixel-blue">
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* New Here? */}
 <div>
 <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">New Here?</h4>
 <ul className="space-y-2.5">
 <li>
 <Link to="/gateway" className="text-sm text-text-secondary transition-colors hover:text-signal-blue">
 The Gateway
 </Link>
 </li>
 <li>
 <span className="text-sm text-text-muted">Beginner Guides</span>
 </li>
 <li>
 <span className="text-sm text-text-muted">Cozy Games</span>
 </li>
 </ul>
 </div>

 {/* Stay Updated */}
 <div>
 <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">Stay Updated</h4>
 <p className="mb-3 text-sm text-text-secondary">Get weekly gaming picks in your inbox.</p>
 <div className="flex gap-2">
 <input
 type="email"
 placeholder="you@email.com"
 id="newsletter-email"
 className="flex-1 rounded-none border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-pixel-blue/50"
 />
 <button
 id="newsletter-subscribe"
 className="rounded-none bg-pixel-blue px-4 py-2 text-sm font-medium text-white transition-all hover:bg-pixel-blue/85 active:scale-95"
 >
 Join
 </button>
 </div>
 </div>
 </div>

 <div className="mt-10 border-t border-surface-700 pt-6 text-center text-xs text-text-muted">
 © {new Date().getFullYear()} Pixellon. Built for gamers, by gamers.
 </div>
 </div>
 </footer>
 )
}
