import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const navLinks = [
 { to: '/', label: 'Home' },
 { to: '/news', label: 'News' },
 { to: '/free-games', label: 'Free' },
 { to: '/streams', label: 'Streams' },
 { to: '/esports', label: 'Esports' },
 { to: '/indie', label: 'Indie' },
 { to: '/deals', label: 'Deals' },
 { to: '/codex', label: 'Codex' },
 { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
 const [mobileOpen, setMobileOpen] = useState(false)

 return (
 <nav className="sticky top-0 z-50 border-b border-surface-700 bg-surface-950">
 <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
 {/* Logo */}
 <Link to="/" className="flex items-center gap-2.5 group">
 <div className="flex h-9 w-9 items-center justify-center rounded-none bg-pixel-blue/15 transition-colors group-hover:bg-pixel-blue/25">
 <span className="text-lg font-bold text-pixel-blue">P</span>
 </div>
 <span className="font-display text-xl font-bold tracking-tight text-text-primary">
 Pixellon
 </span>
 </Link>

 {/* Desktop Links */}
 <div className="hidden items-center gap-1 md:flex">
 {navLinks.map((link) => (
 <NavLink
 key={link.to}
 to={link.to}
 end={link.to === '/'}
 className={({ isActive }) =>
 `rounded-none px-4 py-2 text-sm font-medium transition-all duration-200 ${
 isActive
 ? 'bg-pixel-blue/12 text-pixel-blue'
 : 'text-text-secondary hover:bg-surface-800 hover:text-text-primary'
 }`
 }
 >
 {link.label}
 </NavLink>
 ))}
 </div>

 {/* Mobile Toggle */}
 <button
 id="mobile-menu-toggle"
 onClick={() => setMobileOpen(!mobileOpen)}
 className="flex h-10 w-10 items-center justify-center rounded-none text-text-secondary transition-colors hover:bg-surface-800 hover:text-text-primary md:hidden"
 aria-label="Toggle menu"
 >
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
 {mobileOpen ? (
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 ) : (
 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
 )}
 </svg>
 </button>
 </div>

 {/* Mobile Menu */}
 {mobileOpen && (
 <div className="border-t border-surface-700 bg-surface-950 md:hidden">
 <div className="flex flex-col gap-1 px-4 py-3">
 {navLinks.map((link) => (
 <NavLink
 key={link.to}
 to={link.to}
 end={link.to === '/'}
 onClick={() => setMobileOpen(false)}
 className={({ isActive }) =>
 `rounded-none px-4 py-2.5 text-sm font-medium transition-colors ${
 isActive
 ? 'bg-pixel-blue/12 text-pixel-blue'
 : 'text-text-secondary hover:bg-surface-800 hover:text-text-primary'
 }`
 }
 >
 {link.label}
 </NavLink>
 ))}
 </div>
 </div>
 )}
 </nav>
 )
}
