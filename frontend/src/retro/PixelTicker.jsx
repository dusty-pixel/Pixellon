import { useTicker } from './TickerProvider'

/**
 * Signature retro LED ticker. Pure breaking-news band —
 * navigation lives in the navbar below.
 */
export default function PixelTicker() {
  const { message, alert } = useTicker()
  const loop = `${message} ${message} `

  return (
    <div className="led-ticker relative z-[60] hidden sm:block" role="status" aria-label="Pixellon system ticker">
      <div className="mx-auto flex max-w-[1600px] items-stretch gap-0 px-4 sm:px-6">
        {/* scrolling message band */}
        <div className="relative flex-1 overflow-hidden">
          <div className="led-dots pointer-events-none absolute inset-0 z-10" />
          <div className="flex h-full items-center overflow-hidden pl-4">
            <div className="led-ticker-track font-pixel text-sm tracking-[0.2em]">
              <span className={`led-ticker-text pr-8 ${alert ? 'text-red-400' : ''}`} style={alert ? { color: '#ff6b5e' } : undefined}>
                {loop}
              </span>
              <span aria-hidden className={`led-ticker-text pr-8 ${alert ? '' : ''}`} style={alert ? { color: '#ff6b5e' } : undefined}>
                {loop}
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#05070b] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#05070b] to-transparent" />
        </div>
      </div>
    </div>
  )
}
