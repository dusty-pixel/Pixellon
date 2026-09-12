# PixelCat

A small blue pixel cat that lives along the bottom edge of the site.

    PixelCat.jsx      mount, rAF loop, responsive caps, debug overlay
    CatBehavior.js    intent  — state machine, position, decisions
    CatAnimation.js   visuals — pose channels, clip playback, smoothing
    CatRenderer.js    pixel drawing (canvas 2D, integer art grid)
    CursorTracker.js  pointer position / speed / stillness
    catConfig.js      all tuning: sizes, timings, weights, palette
    catStates.js      state vocabulary + weighted rolls
    catAnimations.js  the clip library (gestures)
    selfcheck.mjs     headless simulation — `npm run cat:check`

**Tuning** lives entirely in `catConfig.js` (decision intervals, walk speed,
cursor interest, weights). Nothing else needs editing to change personality.

**Debug mode**: append `?catDebug=true` for a live state readout plus keyboard
shortcuts (i idle, w walk, h hide, p peek, c cursor, o pounce, s sit, z sleep,
e exit, r rare, g gesture, q startle). `window.__pixelCat` is exposed too.

**Swapping in real sprite art**: the cat is drawn procedurally today. When a
sprite sheet exists, load it and call
`renderer.setSpriteSheet({ image, frameW, frameH, frames: { walk: [[0,0],[1,0]], idle: [[0,1]] } })`.
Any pose whose `anim` name has frames is blitted from the sheet; everything else
keeps falling back to the procedural parts, so the swap can be done one
animation at a time. Clip names in `catAnimations.js` are the frame keys.
