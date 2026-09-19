import { useState } from 'react'
import { Palette, Sparkles, Image as ImageIcon, X, Check, ExternalLink, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const PALETTES = [
  {
    id: 'cyan',
    name: 'Electric Cyan',
    badge: 'Apex Tech (Default)',
    primary: '#0284C7',
    accent: '#00D2FF',
    bg: '#070B12',
    screenshot: '/trial-electric-cyan.jpg',
  },
  {
    id: 'emerald',
    name: 'Tactical Emerald',
    badge: 'Razer / Stealth',
    primary: '#10B981',
    accent: '#00FF87',
    bg: '#080D0A',
    screenshot: '/trial-emerald-mint.jpg',
  },
  {
    id: 'violet',
    name: 'Twilight Violet',
    badge: 'Twitch / Discord',
    primary: '#8B5CF6',
    accent: '#EC4899',
    bg: '#0C0A14',
    screenshot: '/trial-twilight-violet.jpg',
  },
  {
    id: 'inferno',
    name: 'Inferno Amber',
    badge: 'Match Point',
    primary: '#FF4655',
    accent: '#F59E0B',
    bg: '#0E0C0E',
    screenshot: '/trial-inferno-amber.jpg',
  },
]

export default function ThemeTrialBar() {
  const { toggleColorMode, isDark, palette: activeTheme, setPalette: setActiveTheme } = useTheme()
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState('/trial-electric-cyan.jpg')
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {/* Floating Theme Switcher Dock */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 print:hidden select-none">
        {expanded && (
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-brand-surface/95 backdrop-blur-md border border-surface-700 shadow-2xl shadow-black/60 animate-fade-up">
            <div className="flex items-center gap-1 px-2 border-r border-surface-700 text-xs font-mono text-brand-muted">
              <Palette className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
              <span className="hidden sm:inline">Theme Trials</span>
            </div>

            {/* Dark / Light Toggle in Dock */}
            <button
              onClick={toggleColorMode}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border border-surface-700 bg-brand-bg text-brand-text hover:border-brand-accent/50 mr-1"
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="text-brand-muted">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-700 font-semibold">Light</span>
                </>
              )}
            </button>

            {/* Theme Swatch Pills */}
            <div className="flex items-center gap-1.5 border-l border-surface-700 pl-1.5">
              {PALETTES.map((p) => {
                const isActive = activeTheme === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveTheme(p.id)}
                    title={`${p.name} (${p.badge})`}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-primary/15 text-brand-accent border border-brand-primary/40 shadow-sm scale-105'
                        : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg border border-transparent'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40 flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${p.primary} 0%, ${p.accent} 100%)`,
                      }}
                    >
                      {isActive && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </span>
                    <span className="hidden md:inline">{p.name.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>

            {/* Screenshots Gallery Button */}
            <button
              onClick={() => setGalleryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-semibold shadow-md hover:brightness-110 transition-all cursor-pointer ml-1"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Screenshots</span>
            </button>
          </div>
        )}

        {/* Toggle Minimize/Expand Pill */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-surface/95 hover:bg-surface-900 text-brand-muted hover:text-brand-text text-xs font-mono border border-surface-700 backdrop-blur-md shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-brand-accent" />
          <span>{expanded ? 'Hide Palette Dock' : 'Palette Trials'}</span>
        </button>
      </div>

      {/* Screenshot Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-up">
          <div className="relative w-full max-w-5xl rounded-2xl bg-brand-surface border border-surface-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700 bg-surface-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-brand-accent" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-text font-display">Palette Trial Screenshots</h3>
                  <p className="text-xs text-brand-muted font-mono">Real renders of the Player Profile across all 4 palettes</p>
                </div>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Tabs + Main Preview */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Palette Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PALETTES.filter((p) => p.id !== 'default').map((p) => {
                  const isCur = selectedScreenshot === p.screenshot
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedScreenshot(p.screenshot)
                        setActiveTheme(p.id)
                      }}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isCur
                          ? 'border-brand-accent bg-brand-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'border-surface-700 bg-surface-900 hover:border-brand-accent/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/40"
                          style={{
                            background: `linear-gradient(135deg, ${p.primary} 0%, ${p.accent} 100%)`,
                          }}
                        />
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-700/50 text-brand-muted">
                          {p.badge}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-brand-text">{p.name}</div>
                        <div className="text-[11px] text-brand-accent font-mono mt-0.5">Click to Preview</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Large Image Showcase */}
              <div className="relative rounded-xl border border-surface-700 overflow-hidden bg-black/60 group">
                <img
                  src={selectedScreenshot}
                  alt="Palette Preview Screenshot"
                  className="w-full h-auto object-cover rounded-xl"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={selectedScreenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-mono backdrop-blur-md border border-white/20 hover:bg-black"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Image</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-surface-700 bg-surface-900 text-xs">
              <span className="text-brand-muted">
                Tip: Selecting a palette here also changes the live theme of the site!
              </span>
              <button
                onClick={() => setGalleryOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-surface-700 bg-brand-surface hover:bg-surface-900 text-brand-text font-medium transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
