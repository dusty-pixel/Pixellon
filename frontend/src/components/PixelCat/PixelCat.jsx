import { useEffect, useRef } from 'react';

/** Decorative 3D companion; original import retained for compatibility. */
export default function PixelCat() {
  const canvasRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    let dispose;
    import('./CatScene.js').then(async ({ mountCat }) => {
      if (cancelled) return;
      dispose = await mountCat(canvasRef.current);
      if (cancelled) dispose();
    }).catch((error) => console.warn('Cat companion could not be loaded:', error));
    return () => { cancelled = true; dispose?.(); };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-2 z-40 select-none"
      style={{ width: 'clamp(170px, 22vw, 270px)', aspectRatio: '1.25' }}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
