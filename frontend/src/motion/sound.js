/**
 * Minimal WebAudio synth for arena micro-sounds.
 * Default OFF — AudioContext is created only after the user enables sound.
 */
const SOUND_KEY = 'pixellon_sound'

let ctx = null
let enabled = localStorage.getItem(SOUND_KEY) === 'on'

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function blip({ freq = 440, end = null, dur = 0.07, type = 'square', gain = 0.04, when = 0 }) {
  const c = ac()
  const t = c.currentTime + when
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (end) o.frequency.exponentialRampToValueAtTime(end, t + dur)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.02)
}

const PRESETS = {
  hover: () => blip({ freq: 880, dur: 0.03, gain: 0.015 }),
  click: () => blip({ freq: 520, end: 760, dur: 0.08 }),
  xp: () => {
    blip({ freq: 660, dur: 0.07 })
    blip({ freq: 990, dur: 0.1, when: 0.07 })
  },
  portal: () => blip({ freq: 180, end: 880, dur: 0.5, type: 'sawtooth', gain: 0.03 }),
  discovery: () => {
    blip({ freq: 523, dur: 0.09 })
    blip({ freq: 784, dur: 0.12, when: 0.09 })
  },
}

export const sound = {
  isEnabled: () => enabled,
  setEnabled(next) {
    enabled = next
    localStorage.setItem(SOUND_KEY, next ? 'on' : 'off')
    if (next) {
      try {
        ac()
      } catch {
        /* audio unsupported — stay silent */
      }
    }
  },
  play(name) {
    if (!enabled || !PRESETS[name]) return
    try {
      PRESETS[name]()
    } catch {
      /* ignore audio errors */
    }
  },
}
