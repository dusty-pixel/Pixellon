# Smooth 3D cat companion

`PixelCat.jsx` retains the original component import, but lazy-loads `CatScene.js`.
The live companion now uses a textured, skinned GLB with smooth shading,
antialiasing, three-point lighting, and a transparent shadow receiver.

The original pixel renderer, cursor chasing, squash/stretch, random tricks and
CSS flipping are no longer imported by the live component. The legacy files and
`cat:check` remain for reference; that command tests the old behavior, not 3D.

The cat stays at the lower left and plays a quiet 18-second skeletal idle.
Head and tail poses are authored in `scripts/author-cat-idle.mjs` and baked into
`public/models/cat/companion.glb`; the browser only plays the animation clip.
Reduced motion displays a still pose. Hidden tabs pause rendering. Resources and
listeners are released on unmount. WebGL/load failures omit the decoration.

Source: Fripouille by guillaume bolis, CC BY 4.0. Attribution is accessible from
the footer at `/models/cat/credits.html` and embedded in the GLB metadata.
To rebuild the animation, download the original model from the linked source
and run `node scripts/author-cat-idle.mjs path/to/original.glb` from the repo root.

Verification: `npm run build`, `npm run lint`, and visual browser inspection.
