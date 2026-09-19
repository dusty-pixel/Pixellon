import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, User, Briefcase, MapPin, Monitor, Sparkles } from 'lucide-react'

export const PRESET_AVATARS = [
  { id: 'av-cat', name: 'Pixel Cat', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowCat' },
  { id: 'av-knight', name: 'Retro Knight', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NeonKnight' },
  { id: 'av-samurai', name: 'Cyber Samurai', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CyberSamurai' },
  { id: 'av-arcade', name: 'Arcade Player', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=RetroGamer' },
  { id: 'av-mecha', name: 'Tactical Mecha', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MechaZero' },
  { id: 'av-ghost', name: 'Ghost Operative', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=GhostSniper' },
]

export default function EditProfileModal({ isOpen, onClose, currentProfile, onSave }) {
  const [formData, setFormData] = useState({
    name: currentProfile.name || 'PlayerOne',
    headline: currentProfile.headline || 'Competitive FPS Entry Fragger • Soulslike Veteran • Lore Contributor on Pixellon',
    bio: currentProfile.bio || 'Passionate gamer focused on tactical communication, co-op raids, and deep lore explorations. Always down for competitive queues or co-op playthroughs.',
    location: currentProfile.location || 'Tokyo, Japan',
    battleStation: currentProfile.battleStation || 'Custom PC (RTX 4070) & Steam Deck',
    openToPlay: currentProfile.openToPlay ?? true,
    avatar: currentProfile.avatar || PRESET_AVATARS[0].url,
    skills: currentProfile.skills || 'Entry Fragging, Raid Leading, Clutch Plays, Boss Soloing',
  })

  const [customAvatarInput, setCustomAvatarInput] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleApplyCustomAvatar = () => {
    if (customAvatarInput.trim()) {
      setFormData({ ...formData, avatar: customAvatarInput.trim() })
      setCustomAvatarInput('')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl rounded-2xl border border-surface-700 bg-brand-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-brand-muted hover:text-brand-text p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-9 w-9 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-accent">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-text">
                Edit Gamer Profile & Intro
              </h3>
              <p className="text-xs text-brand-muted">
                Update your gamer headline, battle station, and LFG status.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Open to Play Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>#OpenToPlay / Looking For Group (LFG)</span>
                </div>
                <p className="text-[11px] text-brand-muted">
                  Displays the green status ring showing teammates you're ready to squad up.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, openToPlay: !formData.openToPlay })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.openToPlay ? 'bg-emerald-500' : 'bg-surface-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.openToPlay ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-mono font-semibold text-brand-text uppercase mb-2">
                Gamer Avatar
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {PRESET_AVATARS.map((av) => {
                  const isSelected = formData.avatar === av.url
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av.url })}
                      className={`relative h-13 w-13 rounded-xl overflow-hidden border-2 transition-all p-1 bg-surface-900 cursor-pointer ${
                        isSelected
                          ? 'border-brand-primary scale-105 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                          : 'border-surface-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av.url} alt={av.name} className="h-full w-full object-contain" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-brand-accent" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Custom Image URL Option */}
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="url"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="flex-1 rounded-xl border border-surface-700 bg-surface-900 px-3 py-1.5 text-xs font-mono text-brand-text placeholder:text-brand-muted focus:border-brand-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomAvatar}
                  disabled={!customAvatarInput.trim()}
                  className="rounded-xl border border-surface-700 bg-surface-900 px-3 py-1.5 text-xs font-mono text-brand-accent hover:border-brand-primary/50 disabled:opacity-40 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Gamer Name */}
            <div>
              <label className="block text-xs font-mono font-semibold text-brand-muted mb-1">
                Gamer Name / Tag
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-surface-700 bg-surface-900 px-3.5 py-2 text-xs sm:text-sm text-brand-text focus:border-brand-primary focus:outline-none"
                required
              />
            </div>

            {/* LinkedIn-style Headline */}
            <div>
              <label className="block text-xs font-mono font-semibold text-brand-muted mb-1">
                Player Headline (LinkedIn Style)
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Competitive FPS Entry Fragger • Soulslike Veteran • Lore Archivist"
                className="w-full rounded-xl border border-surface-700 bg-surface-900 px-3.5 py-2 text-xs sm:text-sm text-brand-text focus:border-brand-primary focus:outline-none"
                required
              />
            </div>

            {/* Location & Battle Station */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-brand-muted mb-1">
                  Region / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-muted" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Tokyo, Japan"
                    className="w-full rounded-xl border border-surface-700 bg-surface-900 py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-brand-muted mb-1">
                  Primary Battle Station / Rig
                </label>
                <div className="relative">
                  <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-muted" />
                  <input
                    type="text"
                    value={formData.battleStation}
                    onChange={(e) => setFormData({ ...formData, battleStation: e.target.value })}
                    placeholder="e.g. Custom PC (RTX 4070) & PS5"
                    className="w-full rounded-xl border border-surface-700 bg-surface-900 py-2 pl-9 pr-3 text-xs text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div>
              <label className="block text-xs font-mono font-semibold text-brand-muted mb-1">
                About / Summary
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-xl border border-surface-700 bg-surface-900 px-3.5 py-2 text-xs sm:text-sm text-brand-text focus:border-brand-primary focus:outline-none resize-none leading-relaxed"
                placeholder="Tell teammates about your playstyle, favorite genres, or squad goals..."
              />
            </div>

            {/* Skills & Specialties */}
            <div>
              <label className="block text-xs font-mono font-semibold text-brand-muted mb-1">
                Specialties & Combat Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. Entry Fragging, Raid Leading, Clutch Plays"
                className="w-full rounded-xl border border-surface-700 bg-surface-900 px-3.5 py-2 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-surface-700 bg-surface-900 px-4 py-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand-primary px-5 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-brand-primary/90 transition-all cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
