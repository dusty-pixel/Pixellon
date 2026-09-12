/**
 * PixelCat — the only React surface of the cat system.
 *
 *   PixelCat (mount, lifecycle, responsive caps)
 *     └ CatBehavior   (intent: state machine, position, decisions)
 *         └ CatAnimation (visual: pose channels, clips, smoothing)
 *             └ CatRenderer (pixel drawing)
 *         └ CursorTracker (pointer input)
 *
 * All animation state lives outside React — the component renders once and the
 * rAF loop mutates a canvas and one transform. Debug text is written straight to
 * a DOM node so the overlay never triggers a re-render either.
 */
import { useEffect, useRef } from 'react';
import { ART, CAT_CONFIG } from './catConfig.js';
import CatRenderer from './CatRenderer.js';
import CatAnimation from './CatAnimation.js';
import CatBehavior from './CatBehavior.js';
import CursorTracker from './CursorTracker.js';
import { S } from './catStates.js';
import { CLIPS } from './catAnimations.js';

const scaleForWidth = (w) => {
  const { scale, breakpoints } = CAT_CONFIG;
  if (w < breakpoints.mobile) return scale.mobile;
  if (w < breakpoints.tablet) return scale.tablet;
  return scale.desktop;
};

const DEBUG_KEYS = {
  i: S.IDLE,
  w: S.WALKING,
  h: S.HIDDEN,
  p: S.PEEKING,
  n: S.ENTERING,
  c: S.WATCHING_CURSOR,
  o: S.POUNCING,
  s: S.SITTING,
  z: S.SLEEPING,
  e: S.EXITING,
  r: S.RARE,
  u: S.CURSOR_CURIOUS,
};

export default function PixelCat() {
  const canvasRef = useRef(null);
  const debugRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const debugMode = new URLSearchParams(window.location.search).get('catDebug') === 'true';
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const caps = {
      motion: !motionQuery.matches,
      cursor: hoverQuery.matches && window.innerWidth >= CAT_CONFIG.breakpoints.tablet,
      rare: window.innerWidth >= CAT_CONFIG.breakpoints.mobile && !motionQuery.matches,
    };

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let scale = scaleForWidth(vw);
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const renderer = new CatRenderer(canvas);
    renderer.resize(scale, dpr);

    const anim = new CatAnimation();
    const tracker = new CursorTracker();
    tracker.enabled = caps.cursor;
    if (caps.cursor) tracker.attach();

    const behavior = new CatBehavior({ anim, tracker, scale, vw, vh, caps });

    // reduced motion: skip the sneaking-in act, just sit quietly on the right
    if (!caps.motion) {
      behavior.x = Math.max(vw - 160, vw * 0.72);
      behavior.offY = 0;
      behavior.facing = -1;
      behavior.go(S.IDLE);
    }

    /* ── the loop ─────────────────────────────────────────────── */
    let raf = 0;
    let last = performance.now();
    let lastDebug = 0;
    let lastTransform = '';

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); // cap after tab switches
      last = now;
      if (document.hidden) return;

      tracker.update(dt);
      behavior.update(dt);
      anim.update(dt);
      renderer.draw(anim.pose);

      const left = Math.round((behavior.x - (ART.W * scale) / 2) * dpr) / dpr;
      const top = Math.round(behavior.offY * dpr) / dpr;
      const transform =
        'translate3d(' +
        left +
        'px,' +
        top +
        'px,0) scale(' +
        (behavior.facing < 0 ? -1 : 1) +
        ',' +
        (behavior.flipY ? -1 : 1) +
        ')';
      if (transform !== lastTransform) {
        canvas.style.transform = transform;
        lastTransform = transform;
      }

      if (debugMode && debugRef.current && now - lastDebug > 150) {
        lastDebug = now;
        const aim = tracker.seen ? behavior.aim() : { dist: Infinity };
        debugRef.current.textContent =
          'state    ' + behavior.state + (behavior.phase ? ' / ' + behavior.phase : '') +
          '\nanim     ' + anim.clipName +
          '\nx        ' + Math.round(behavior.x) + '  offY ' + Math.round(behavior.offY) +
          '\ntarget   ' + (behavior.targetX != null ? Math.round(behavior.targetX) : '—') +
          '  facing ' + (behavior.facing > 0 ? '→' : '←') +
          '\ntimer    ' + Math.max(0, Math.round(behavior.timer)) + 'ms' +
          '\ncursor   ' + (caps.cursor ? Math.round(aim.dist) + 'px  v=' + Math.round(tracker.speed) : 'off') +
          '\nnoticed  ' + behavior.noticed +
          '\nscale    ' + scale + '  caps ' + JSON.stringify(caps);
      }
    };
    raf = requestAnimationFrame(frame);

    /* ── viewport + visibility ────────────────────────────────── */
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        vw = window.innerWidth;
        vh = window.innerHeight;
        const next = scaleForWidth(vw);
        caps.cursor = hoverQuery.matches && vw >= CAT_CONFIG.breakpoints.tablet;
        caps.rare = vw >= CAT_CONFIG.breakpoints.mobile && !motionQuery.matches;
        tracker.enabled = caps.cursor;
        if (next !== scale) {
          scale = next;
          renderer.resize(scale, dpr);
        }
        behavior.setViewport(vw, vh, scale);
        lastTransform = '';
      }, 120);
    };

    const onVisibility = () => {
      last = performance.now(); // don't let a background tab bank up a huge dt
    };

    const onMotionChange = () => {
      caps.motion = !motionQuery.matches;
      caps.rare = caps.rare && caps.motion;
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotionChange);

    /* ── debug shortcuts ──────────────────────────────────────── */
    const gestureNames = Object.keys(CLIPS);
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;
      const key = event.key.toLowerCase();
      if (DEBUG_KEYS[key]) behavior.force(DEBUG_KEYS[key]);
      else if (key === 'g') behavior.forceGesture(gestureNames[Math.floor(Math.random() * gestureNames.length)]);
      else if (key === 'q') behavior.forceGesture('startled');
    };
    if (debugMode) {
      window.addEventListener('keydown', onKey);
      window.__pixelCat = { behavior, anim, renderer, tracker, caps };
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('keydown', onKey);
      tracker.detach();
      delete window.__pixelCat;
    };
  }, []);

  const debugMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('catDebug') === 'true';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 w-full select-none"
      style={{ height: ART.H * CAT_CONFIG.scale.desktop, zIndex: CAT_CONFIG.zIndex }}
    >
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0"
        style={{ imageRendering: 'pixelated', willChange: 'transform' }}
      />
      {debugMode && (
        <div
          className="pointer-events-auto absolute bottom-2 left-2 rounded border border-brand-primary/60 bg-brand-bg/90 p-2 font-mono text-[10px] leading-relaxed text-brand-accent2"
          style={{ whiteSpace: 'pre' }}
        >
          <div ref={debugRef}>cat debug…</div>
          <div className="mt-1 text-brand-muted">
            keys: i idle · w walk · h hide · p peek · c cursor · o pounce · s sit · z sleep · e exit ·
            r rare · g gesture · q startle
          </div>
        </div>
      )}
    </div>
  );
}
