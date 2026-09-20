import React from 'react'
import { Activity, Tag, TrendingUp, Sparkles, Monitor, Gamepad2, Smartphone, Users, Check } from 'lucide-react'

/* ── Status Badges ─────────────────────────────────────────── */
export function BadgeLive({ label = 'LIVE', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border border-red-500/50 bg-red-950/40 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-red-400 backdrop-blur-sm ${className}`}>
      <span className="h-2 w-2 rounded-full bg-red-500 animate-none" />
      <span>{label}</span>
    </span>
  )
}

export function BadgeDiscount({ label = '100% OFF', icon: Icon = Tag, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wide text-emerald-400 backdrop-blur-sm ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </span>
  )
}

export function BadgeTrending({ label = 'TRENDING', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border border-blue-500/50 bg-blue-950/40 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wide text-blue-400 backdrop-blur-sm ${className}`}>
      <TrendingUp className="h-3.5 w-3.5" />
      <span>{label}</span>
    </span>
  )
}

export function BadgeNew({ label = 'NEW', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border border-purple-500/50 bg-purple-950/40 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wide text-purple-400 backdrop-blur-sm ${className}`}>
      <Sparkles className="h-3.5 w-3.5" />
      <span>{label}</span>
    </span>
  )
}

/* ── Platform & Category Filter Chips ──────────────────────── */
export function FilterChip({ icon: Icon, label, active = false, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
        active
          ? 'border-brand-primary bg-brand-primary/15 text-white shadow-[0_0_12px_rgba(2,132,199,0.35)]'
          : 'border-surface-700 bg-brand-surface text-brand-muted hover:border-brand-primary/50 hover:text-brand-text'
      } ${className}`}
    >
      {Icon && <Icon className={`h-4 w-4 ${active ? 'text-brand-accent' : 'text-brand-muted'}`} />}
      <span>{label}</span>
    </button>
  )
}

/* ── Interactive Form Controls ─────────────────────────────── */
export function ToggleSwitch({ checked, onChange, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
        checked ? 'bg-brand-primary' : 'bg-surface-700'
      } ${className}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export function CustomCheckbox({ checked, onChange, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!checked)}
      className={`flex h-5 w-5 items-center justify-center rounded-[4px] border transition-colors cursor-pointer disabled:opacity-50 ${
        checked
          ? 'border-brand-primary bg-brand-primary text-white shadow-[0_0_8px_rgba(2,132,199,0.3)]'
          : 'border-surface-600 bg-surface-900 text-transparent hover:border-brand-primary/50'
      } ${className}`}
    >
      <Check className="h-3.5 w-3.5 stroke-[3]" />
    </button>
  )
}

export function ProgressBar({ value = 0, max = 100, showLabel = true, className = '' }) {
  const percent = Math.min(Math.max(Math.round((value / max) * 100), 0), 100)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-2 w-full flex-1 overflow-hidden rounded-full bg-surface-700">
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-xs font-bold text-brand-text min-w-[32px] text-right">
          {percent}%
        </span>
      )}
    </div>
  )
}
