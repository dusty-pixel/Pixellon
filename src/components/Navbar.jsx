import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { PixellonLogo } from './PixellonLogo'
import DiscordWebhookModal from './DiscordWebhookModal'
import { isWebhookConfigured } from '../utils/discordWebhook'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/news', label: 'News' },
  { to: '/free-games', label: 'Free Games' },
  { to: '/streams', label: 'Streams' },
  { to: '/esports', label: 'Esports' },
  { to: '/indie', label: 'Indie' },
  { to: '/deals', label: 'Deals' },
  { to: '/codex', label: 'Codex' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
  const [hasDiscord, setHasDiscord] = useState(isWebhookConfigured())
  const { toggleColorMode, isDark } = useTheme()

  useEffect(() => {
    // Check initial status
    setHasDiscord(isWebhookConfigured())
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-surface-700 bg-brand-bg/95 backdrop-blur-md w-full transition-colors duration-200">
        <div className="flex w-full items-center justify-between px-4 sm:px-8 lg:px-12 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center group transition-transform duration-200 hover:scale-[1.02]">
            <PixellonLogo size="md" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:gap-2 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium transition-all duration-150 rounded-lg ${
                    isActive
                      ? 'bg-brand-primary/15 text-brand-accent border border-brand-primary/30 shadow-[0_0_12px_rgba(0,210,255,0.25)]'
                      : 'text-brand-muted hover:bg-brand-surface hover:text-brand-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleColorMode}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark and light mode"
              className="relative inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer border border-surface-700 bg-brand-surface text-brand-text hover:border-brand-accent/50 hover:shadow-xs"
            >
              {isDark ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-brand-accent" />
                  <span className="hidden lg:inline text-brand-muted">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span className="hidden lg:inline text-slate-700 font-semibold">Light</span>
                </>
              )}
            </button>

            {/* Discord Button */}
            <button
              onClick={() => setIsDiscordModalOpen(true)}
              title="Discord Bot & Alerts Settings"
              className={`relative inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer border ${
                hasDiscord
                  ? 'border-[#5865F2]/50 bg-[#5865F2]/15 text-[#8a94fd] hover:bg-[#5865F2]/25 shadow-[0_0_12px_rgba(88,101,242,0.2)]'
                  : 'border-surface-700 bg-brand-surface text-brand-muted hover:border-[#5865F2]/40 hover:text-brand-text'
              }`}
            >
              <svg className="h-4 w-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Discord</span>
              {hasDiscord ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <span className="text-[10px] text-brand-muted bg-surface-700/50 px-1 rounded">Connect</span>
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-surface-900 hover:text-brand-text md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
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
          <div className="border-t border-surface-700 bg-brand-surface px-4 py-3 md:hidden space-y-1 shadow-xl">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-primary/15 text-brand-accent border border-brand-primary/30'
                      : 'text-brand-muted hover:bg-surface-900 hover:text-brand-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-surface-700 space-y-2">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-xs text-brand-muted font-mono">Theme Mode</span>
                <button
                  onClick={toggleColorMode}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono border border-surface-700 bg-brand-surface text-brand-text"
                >
                  {isDark ? (
                    <>
                      <Moon className="h-3.5 w-3.5 text-brand-accent" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-500" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileOpen(false)
                  setIsDiscordModalOpen(true)
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 px-3 py-2 text-xs font-mono text-[#8a94fd]"
              >
                <svg className="h-4 w-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Discord Bot & Alerts</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Global Discord Webhook Modal */}
      <DiscordWebhookModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
        onWebhookUpdated={(url) => setHasDiscord(Boolean(url))}
      />
    </>
  )
}
