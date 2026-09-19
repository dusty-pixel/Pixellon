import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Gift, Clock, ExternalLink } from 'lucide-react'

export default function SidebarFreeDrops() {
  // 18h 42m countdown simulation that ticks every second
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 24, minutes: 0, seconds: 0 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-2xl border border-surface-700 bg-brand-surface p-5 shadow-xl transition-all hover:border-brand-primary/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-emerald-400" />
          <h3 className="font-display text-sm font-bold text-brand-text">
            Free Games Radar
          </h3>
        </div>
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
          100% OFF
        </span>
      </div>

      {/* Drop Item */}
      <div className="relative overflow-hidden rounded-xl border border-surface-700 bg-surface-900 p-3.5">
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-surface-700 bg-brand-surface">
            <img
              src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1070560/header.jpg"
              alt="Deadshot"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200'
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-muted mb-0.5">
              <span className="rounded bg-brand-surface px-1.5 py-0.5 border border-surface-700 text-brand-text">
                Steam
              </span>
              <span>•</span>
              <span className="text-brand-muted">FPS / Retro</span>
            </div>
            <h4 className="font-display text-xs font-bold text-brand-text truncate">
              Deadshot Giveaway
            </h4>
            <div className="mt-1 flex items-center gap-2 text-xs font-mono">
              <span className="line-through text-brand-muted text-[11px]">₹419</span>
              <span className="font-bold text-emerald-400">FREE</span>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="mt-3 pt-2.5 border-t border-surface-700 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-brand-muted text-[11px]">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Ends in:</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-amber-400 text-xs">
            <span className="rounded bg-brand-surface px-1.5 py-0.5 border border-amber-500/20">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="rounded bg-brand-surface px-1.5 py-0.5 border border-amber-500/20">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="rounded bg-brand-surface px-1.5 py-0.5 border border-amber-500/20">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        to="/free-games"
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:brightness-110 active:scale-95"
      >
        <span>Claim Free Drop</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
