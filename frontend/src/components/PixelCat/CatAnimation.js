/**
 * CatAnimation — owns the *look*: pose channels, smoothing, and clip playback.
 *
 * Every frame the target pose is rebuilt from NEUTRAL + the behavior's intent, the
 * active clip writes on top of it, then channels are damped toward it. Because
 * targets are rebuilt rather than mutated, a finished clip unwinds to neutral by
 * itself — no clean-up bookkeeping, no stuck limbs.
 */
import { basePose } from './CatRenderer.js';
import { CAT_CONFIG } from './catConfig.js';
import { damp } from './catRandom.js';

const NEUTRAL = {
  bob: 0,
  lean: 0,
  crouch: 0,
  sit: 0,
  loaf: 0,
  stretch: 0,
  squash: 0,
  headX: 0,
  headY: 0,
  tilt: 0,
  lookX: 0,
  lookY: 0,
  earL: 0,
  earR: 0,
  tailWave: 0.3,
  tailUp: 0.25,
  pawUp: 0,
  pawReach: 0,
  sleep: 0,
  faceAway: 0,
  legMove: 0,
  alpha: 1,
};

/** Which lerp rate each channel uses; anything unlisted uses `pose`. */
const RATE = {
  headX: 'head',
  headY: 'head',
  tilt: 'head',
  lookX: 'pupil',
  lookY: 'pupil',
  earL: 'ear',
  earR: 'ear',
  bob: 'body',
  lean: 'body',
  squash: 'body',
  crouch: 'body',
};

export default class CatAnimation {
  constructor() {
    this.pose = basePose();
    this.ch = { ...NEUTRAL }; // damped channel values
    this.intent = {}; // persistent overrides from the behavior layer
    this.clip = null;
    this.clipT = 0;
    this.onEnd = null;
    this.walkPhase = 0;
    this.blinkT = 0;
  }

  /** A blink needs to last a few frames to register — never a single frame. */
  blink(ms = 130) {
    if (this.blinkT <= 0) this.blinkT = ms / 1000;
  }

  /** Behavior layer calls this every frame with what it wants held. */
  setIntent(intent) {
    this.intent = intent;
  }

  play(clip, onEnd = null) {
    this.clip = clip;
    this.clipT = 0;
    this.onEnd = onEnd;
  }

  /** Held clips (sit/sleep/peek) run forever, so they never count as busy. */
  get busy() {
    return !!this.clip && this.clip.dur < 1e8;
  }

  get clipName() {
    return this.clip ? this.clip.name : this.pose.legMove > 0.4 ? 'walk' : 'idle';
  }

  stop() {
    this.clip = null;
    this.onEnd = null;
  }

  update(dt) {
    const targets = { ...NEUTRAL, ...this.intent };
    const pose = this.pose;

    // eyes are snapped, not damped — pixel eyelids should not cross-fade
    pose.eyeOpen = this.intent.eyeOpen ?? 1;

    const api = {
      set: (o) => Object.assign(targets, o),
      snap: (o) => Object.assign(pose, o),
      pose,
    };

    if (this.clip) {
      this.clipT += dt * 1000;
      this.clip.update(Math.min(1, this.clipT / this.clip.dur), api);
      if (this.clipT >= this.clip.dur) {
        const done = this.onEnd;
        this.clip = null;
        this.onEnd = null;
        if (done) done();
      }
    }

    const L = CAT_CONFIG.lerp;
    for (const key in NEUTRAL) {
      this.ch[key] = damp(this.ch[key], targets[key], L[RATE[key] || 'pose'], dt);
    }
    Object.assign(pose, this.ch);

    if (this.blinkT > 0) {
      this.blinkT -= dt;
      pose.eyeOpen = 0;
    }

    /* ── procedural layers (not damped: they are already smooth) ── */
    const legSpeed = this.intent.legSpeed || 0; // 0..1 of top walking speed
    this.walkPhase += dt * (6 + legSpeed * 9) * (pose.legMove > 0.02 ? 1 : 0);
    pose.legPhase = this.walkPhase;
    pose.bob = this.ch.bob - Math.abs(Math.sin(this.walkPhase)) * CAT_CONFIG.walkBobPx * pose.legMove;
    pose.tailPhase += dt * (2.2 + pose.tailWave * 3.5);
    pose.zPhase += dt * 2;
    pose.anim = this.clipName;
  }
}
