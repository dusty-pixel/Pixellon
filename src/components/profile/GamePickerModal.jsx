import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Check, Plus, Gamepad2 } from 'lucide-react'
import { POPULAR_GAMES_CATALOG } from '../../data/popularGamesCatalog'

export default function GamePickerModal({ isOpen, onClose, onSelectGame, currentFavorites = [] }) {
  const [search, setSearch] = useState('')
  const [customTitle, setCustomTitle] = useState('')

  if (!isOpen) return null

  const filtered = POPULAR_GAMES_CATALOG.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.genre.toLowerCase().includes(search.toLowerCase())
  )

  const handleCustomAdd = (e) => {
    e.preventDefault()
    if (!customTitle.trim()) return

    onSelectGame({
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      genre: 'Custom Favorite',
      platform: 'PC / Console',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
    })
    setCustomTitle('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl rounded-2xl border border-surface-700 bg-brand-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[85vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-brand-muted hover:text-brand-text p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-accent">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-text">
                Pick a Favorite Game
              </h3>
              <p className="text-xs text-brand-muted">
                Pin your all-time favorite titles to your player profile showcase.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search popular games (e.g. Elden Ring, CS2, Cyberpunk)..."
              className="w-full rounded-xl border border-surface-700 bg-surface-900 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-primary focus:outline-none"
            />
          </div>

          {/* Games Grid (Scrollable) */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((game) => {
                const isAlreadyFavorite = currentFavorites.some((f) => f.title === game.title)
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => {
                      onSelectGame(game)
                      onClose()
                    }}
                    className={`group relative overflow-hidden rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                      isAlreadyFavorite
                        ? 'border-brand-primary/60 bg-brand-primary/10'
                        : 'border-surface-700 bg-surface-900 hover:border-brand-accent/50 hover:bg-surface-800'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-surface-700 mb-2 bg-brand-surface">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-xs font-bold text-brand-text truncate group-hover:text-brand-accent transition-colors">
                          {game.title}
                        </h4>
                        <p className="text-[10px] font-mono text-brand-muted truncate">
                          {game.genre}
                        </p>
                      </div>
                      {isAlreadyFavorite ? (
                        <span className="shrink-0 h-4 w-4 rounded-full bg-brand-primary text-white flex items-center justify-center">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      ) : (
                        <span className="shrink-0 text-brand-muted group-hover:text-brand-accent">
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-8 text-center text-xs font-mono text-brand-muted">
                No catalog game found matching "{search}". Add it manually below!
              </div>
            )}
          </div>

          {/* Custom Game Adder */}
          <form onSubmit={handleCustomAdd} className="mt-4 pt-3.5 border-t border-surface-700 flex gap-2 shrink-0">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Can't find your game? Type title here..."
              className="flex-1 rounded-xl border border-surface-700 bg-surface-900 px-3.5 py-2 text-xs font-mono text-brand-text placeholder:text-brand-muted focus:border-brand-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customTitle.trim()}
              className="rounded-xl bg-brand-primary px-4 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-brand-primary/90 disabled:opacity-40 cursor-pointer"
            >
              Add Custom
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
