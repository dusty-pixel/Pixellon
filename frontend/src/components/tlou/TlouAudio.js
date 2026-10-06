/**
 * Web Audio ambient generator for The Last of Us cinematic vibe.
 * Plays a gentle, warm acoustic harmonic resonance and wind ambiance
 * without needing external MP3 downloads.
 */

let audioCtx = null
let ambientNodes = []
let isPlaying = false

export function toggleTlouAudio() {
  if (isPlaying) {
    stopTlouAudio()
    return false
  } else {
    startTlouAudio()
    return true
  }
}

export function startTlouAudio() {
  if (isPlaying) return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    // Warm chord notes (E minor acoustic resonance: E2, B2, E3, G3, B3)
    const freqs = [82.41, 123.47, 164.81, 196.0, 246.94]
    ambientNodes = []

    const masterGain = audioCtx.createGain()
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime)
    masterGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3)
    masterGain.connect(audioCtx.destination)

    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      const filter = audioCtx.createBiquadFilter()

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450 + idx * 80, audioCtx.currentTime)

      gain.gain.setValueAtTime(0.04 / (idx + 1), audioCtx.currentTime)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      osc.start()
      ambientNodes.push({ osc, gain })
    })

    isPlaying = true
  } catch (e) {
    console.warn('AudioContext playback error', e)
  }
}

export function stopTlouAudio() {
  if (!isPlaying || !audioCtx) return
  try {
    ambientNodes.forEach(({ osc, gain }) => {
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1)
      setTimeout(() => {
        try {
          osc.stop()
        } catch (_) {}
      }, 1000)
    })
    ambientNodes = []
    isPlaying = false
  } catch (e) {
    isPlaying = false
  }
}
