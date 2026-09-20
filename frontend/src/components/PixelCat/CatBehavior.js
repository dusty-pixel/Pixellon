/**
 * CatBehavior — owns *intent*: where the cat is, where it is going, and which
 * state it is in. It never touches the DOM and never draws; it moves numbers and
 * asks CatAnimation for poses/clips. PixelCat reads x / offY / facing each frame.
 */
import { ART, CAT_CONFIG as K } from './catConfig.js';
import { S, rollIdleState, rollRareBehavior, rollEdgeAction } from './catStates.js';
import { GESTURES, CLIPS, BEHAVIOR_CLIPS } from './catAnimations.js';
import {
  chance,
  clamp,
  easeInOut,
  easeOut,
  pick,
  randomBetween,
  randomDelay,
  weightedRandom,
} from './catRandom.js';

/* Vertical offsets (art px below the resting position) for the peek ladder. */
const ROWS = { hidden: 31, ears: 26, eyes: 19, head: 14, up: 0 };

export default class CatBehavior {
  constructor({ anim, tracker, scale, vw, vh, caps }) {
    this.anim = anim;
    this.tracker = tracker;
    this.caps = caps;
    this.setViewport(vw, vh, scale);

    this.x = -20 * scale;
    this.offY = ROWS.hidden * scale;
    this.facing = 1;
    this.flipY = false;
    this.vx = 0;
    this.speed = 40;

    this.state = S.HIDDEN;
    this.phase = '';
    this.timer = randomDelay(K.bootDelayMin, K.bootDelayMax);
    this.stateAge = 0;
    this.tweens = {};
    this.hangPaws = 0;
    this.noticed = false; // cursor already acknowledged in this approach
    this.debug = { last: '' };
  }

  setViewport(vw, vh, scale) {
    this.vw = vw;
    this.vh = vh;
    this.scale = scale;
    this.catW = ART.W * scale;
    if (this.x !== undefined) this.x = clamp(this.x, -this.catW, vw + this.catW);
  }

  /* ── geometry helpers ───────────────────────────────────────── */

  get hiddenX() {
    return { left: -20 * this.scale, right: this.vw + 20 * this.scale };
  }

  cornerX(side) {
    return side === 'left' ? -3 * this.scale : this.vw + 3 * this.scale;
  }

  /** Where the eyes are in viewport coordinates (for distance + aim). */
  eyePoint() {
    return {
      x: this.x + this.facing * 8 * this.scale,
      y: this.vh - (ART.H - 18) * this.scale + this.offY,
    };
  }

  aim() {
    const eye = this.eyePoint();
    const dx = this.tracker.x - eye.x;
    const dy = this.tracker.y - eye.y;
    return {
      nx: clamp((dx * this.facing) / 320, -1, 1),
      ny: clamp(dy / 220, -1, 1),
      dist: Math.hypot(dx, dy),
      side: Math.sign(dx) || 1,
    };
  }

  gazeIntent(weight = 1, extra = {}) {
    const { nx, ny } = this.aim();
    return {
      lookX: nx * weight,
      lookY: ny * weight,
      headX: nx * K.headOffsetPx * weight,
      headY: ny * 1.2 * weight,
      tilt: nx * 0.3 * weight,
      earL: nx * 0.35 * weight,
      earR: nx * 0.45 * weight,
      lean: nx * 0.4 * weight,
      ...extra,
    };
  }

  /* ── tiny tween runner (used for peeks, entries, exits) ─────── */

  tween(prop, to, dur, ease = easeInOut, onDone = null) {
    this.tweens[prop] = { from: this[prop], to, dur, t: 0, ease, onDone };
  }

  runTweens(dt) {
    for (const prop in this.tweens) {
      const tw = this.tweens[prop];
      tw.t += dt * 1000;
      const p = Math.min(1, tw.t / tw.dur);
      this[prop] = tw.from + (tw.to - tw.from) * tw.ease(p);
      if (p >= 1) {
        delete this.tweens[prop];
        if (tw.onDone) tw.onDone();
      }
    }
  }

  get tweening() {
    return Object.keys(this.tweens).length > 0;
  }

  /* ── state entry ────────────────────────────────────────────── */

  go(state, phase = '') {
    this.state = state;
    this.phase = phase;
    this.stateAge = 0;
    this.debug.last = state + (phase ? ':' + phase : '');
    const enter = this['enter' + state];
    if (enter) enter.call(this);
  }

  enterHIDDEN() {
    this.anim.stop();
    this.tweens = {};
    this.hangPaws = 0;
    this.flipY = false;
    this.vx = 0;
    this.timer = randomDelay(K.hiddenMin, K.hiddenMax);
    this.offY = ROWS.hidden * this.scale;
    const spot = weightedRandom({ left: 30, right: 30, below: 40 });
    if (spot === 'below') {
      this.x = randomBetween(this.catW * 0.5, this.vw - this.catW * 0.5);
      this.facing = chance(0.5) ? 1 : -1;
      this.hideSpot = 'below';
    } else {
      this.x = this.hiddenX[spot];
      this.facing = spot === 'left' ? 1 : -1;
      this.hideSpot = spot;
    }
  }

  enterPEEKING() {
    const kind = weightedRandom({ corner: 38, paws: 32, ears: 30 });
    this.peekKind = kind;
    this.anim.play(BEHAVIOR_CLIPS.peekLook);

    if (kind === 'corner') {
      const side = this.hideSpot === 'right' ? 'right' : this.hideSpot === 'left' ? 'left' : pick(['left', 'right']);
      this.x = this.cornerX(side);
      this.facing = side === 'left' ? 1 : -1;
    } else if (this.hideSpot !== 'below') {
      // a paw/ear peek needs room below the edge — slide in from the corner first
      this.x = clamp(this.x, this.catW * 0.45, this.vw - this.catW * 0.45);
    }

    this.offY = ROWS.hidden * this.scale;
    if (kind === 'paws') {
      this.phase = 'paws';
      this.hangPaws = 1;
      this.timer = randomDelay(700, 1300);
    } else {
      this.phase = 'rise';
      this.tween('offY', ROWS.ears * this.scale, 900, easeOut, () => {
        this.phase = 'earPause';
        this.timer = kind === 'ears' ? randomDelay(500, 1100) : 250;
      });
    }
  }

  enterENTERING() {
    this.hangPaws = 0;
    this.anim.stop();
    const inward = this.facing > 0 ? 1 : -1;
    const targetX = clamp(
      this.x + inward * this.catW * 0.55,
      K.edgePad + this.catW * 0.3,
      this.vw - K.edgePad - this.catW * 0.3,
    );
    this.tween('offY', 0, 1100, easeOut);
    this.tween('x', targetX, 1300, easeInOut, () => {
      this.anim.play(BEHAVIOR_CLIPS.scan, () => this.go(S.IDLE));
    });
  }

  enterIDLE() {
    this.anim.stop();
    this.vx = 0;
    this.noticed = false;
    this.timer = randomDelay(K.idleDecisionMin, K.idleDecisionMax);
  }

  enterWALKING() {
    this.speed = randomBetween(K.walkSpeedMin, K.walkSpeedMax);

    // resuming an interrupted walk: keep the old destination, no fresh glance
    if (this.walkResume != null) {
      this.targetX = this.walkResume;
      this.walkResume = null;
      this.midStopAt = null;
      this.facing = Math.sign(this.targetX - this.x) || this.facing;
      return;
    }

    let dir = this.walkDir || (chance(0.5) ? 1 : -1);
    this.walkDir = null;
    const roomFor = (d) => (d > 0 ? this.vw - K.edgePad - this.x : this.x - K.edgePad);
    if (roomFor(dir) < K.minWalkDist * 0.6) dir *= -1; // boxed in: turn around instead
    this.facing = dir;

    const room = Math.max(K.minWalkDist * 0.5, roomFor(dir));
    const dist = Math.min(room, randomBetween(K.minWalkDist, this.vw * 0.8));
    this.targetX = this.x + dir * dist;
    this.midStopAt = chance(K.midWalkStopChance) ? this.x + dir * dist * randomBetween(0.35, 0.7) : null;
    // glance where it intends to go before setting off
    this.anim.play({
      name: 'lookAhead',
      dur: randomDelay(400, 900),
      update: (t, api) => api.set({ lookX: 0.7, headX: 1.4, earR: 0.3 }),
    });
  }

  enterWATCHING_CURSOR() {
    const { side } = this.aim();
    if (side !== this.facing && chance(0.8)) this.facing = side;
    this.vx = 0;
    this.timer = randomDelay(K.cursorInterestMin, K.cursorInterestMax);
    this.staredBonus = false;
    this.nextMicro = randomDelay(700, 1800);
    // ears react before the head does
    this.anim.play({
      name: 'earsPerk',
      dur: 320,
      update: (t, api) => api.set({ earL: 0.8, earR: 0.9, tailUp: 0.4 }),
    });
  }

  enterCURSOR_CURIOUS() {
    const toward = clamp(
      this.tracker.x - this.x,
      -K.maxPounceDx * 2.2,
      K.maxPounceDx * 2.2,
    );
    this.facing = Math.sign(toward) || this.facing;
    this.targetX = clamp(
      this.x + toward,
      K.edgePad + this.catW * 0.25,
      this.vw - K.edgePad - this.catW * 0.25,
    );
    this.speed = randomBetween(K.walkSpeedMin + 10, K.walkSpeedMax);
    this.midStopAt = null;
  }

  enterPOUNCING() {
    this.startX = this.x;
    const { side } = this.aim();
    this.facing = side;
    this.phase = 'wind';
    this.anim.play(BEHAVIOR_CLIPS.windUp, () => {
      this.phase = 'leap';
      this.leapT = 0;
      this.leapDx = clamp(this.tracker.x - this.x, -K.maxPounceDx, K.maxPounceDx);
      this.leapFrom = this.x;
    });
  }

  enterSITTING() {
    this.vx = 0;
    this.anim.play(BEHAVIOR_CLIPS.sitting);
    this.timer = randomDelay(K.sitMin, K.sitMax);
    this.nextMicro = randomDelay(1200, 3000);
  }

  enterSLEEPING() {
    this.vx = 0;
    this.anim.play(BEHAVIOR_CLIPS.sleeping);
    this.timer = randomDelay(K.sleepMin, K.sleepMax);
  }

  enterGESTURE() {
    const quiet = ['blink', 'doubleBlink', 'earTwitch', 'tailFlick'];
    const pool = this.caps.motion
      ? GESTURES.filter((g) => (g.rare ? this.caps.rare && chance(0.25) : true))
      : GESTURES.filter((g) => quiet.includes(g.name)); // prefers-reduced-motion
    const gesture = this.pendingGesture || weightedRandom(pool.length ? pool : GESTURES);
    this.pendingGesture = null;
    this.anim.play(gesture, () => {
      this.go(S.IDLE);
      this.timer += randomDelay(K.gestureGapMin, K.gestureGapMax); // never back-to-back
    });
  }

  enterEXITING() {
    const side = chance(0.5) ? 'left' : 'right';
    this.exitSide = side;
    this.facing = side === 'left' ? -1 : 1;
    this.speed = randomBetween(K.walkSpeedMin + 8, K.walkSpeedMax);
    this.phase = 'lookBack';
    // one last look at the user before slipping out
    this.anim.play(
      {
        name: 'lookBack',
        dur: randomDelay(500, 1100),
        update: (t, api) => api.set({ lookX: -0.9, headX: -2, tilt: -0.3, earL: 0.3 }),
      },
      () => {
        this.phase = 'walkOff';
        this.targetX = this.facing > 0 ? this.vw + this.catW * 0.7 : -this.catW * 0.7;
      },
    );
  }

  enterRARE() {
    const kind = rollRareBehavior(this.caps);
    this.rareKind = kind;
    this.phase = kind;

    if (kind === 'dash') {
      this.facing = this.x > this.vw / 2 ? -1 : 1;
      this.speed = K.runSpeed;
      this.targetX = this.facing > 0 ? this.vw + this.catW * 0.7 : -this.catW * 0.7;
    } else if (kind === 'bughunt') {
      this.bugHops = 3 + Math.floor(Math.random() * 3);
      this.phase = 'bugMove';
      this.speed = randomBetween(90, 140);
      this.targetX = clamp(
        this.x + randomBetween(-160, 160),
        K.edgePad + this.catW * 0.25,
        this.vw - K.edgePad - this.catW * 0.25,
      );
      this.facing = Math.sign(this.targetX - this.x) || this.facing;
    } else if (kind === 'startled') {
      this.anim.play(CLIPS.startled, () => this.go(S.IDLE));
    } else if (kind === 'tailChase') {
      this.anim.play(CLIPS.tailChase, () => this.go(S.IDLE));
    } else if (kind === 'upsideDown') {
      this.flipY = true;
      this.offY = ROWS.hidden * this.scale;
      this.anim.play(BEHAVIOR_CLIPS.peekLook);
      this.tween('offY', ROWS.head * this.scale, 1200, easeOut, () => {
        this.timer = randomDelay(1600, 3200);
        this.phase = 'hang';
      });
    }
  }

  /* ── per-frame update ───────────────────────────────────────── */

  update(dt) {
    this.stateAge += dt * 1000;
    this.timer -= dt * 1000;
    this.runTweens(dt);

    const tick = this['tick' + this.state];
    if (tick) tick.call(this, dt);

    // pose extras the renderer reads directly
    const pose = this.anim.pose;
    pose.hangPaws = this.hangPaws;
    pose.edgeRow = ART.H - this.offY / this.scale;
  }

  tickHIDDEN() {
    this.anim.setIntent({});
    if (!this.caps.motion) {
      // prefers-reduced-motion: no peeking or climbing, simply settle on stage
      this.x = clamp(this.x, this.vw * 0.7, this.vw - K.edgePad - this.catW * 0.3);
      this.offY = 0;
      this.facing = -1;
      this.go(S.IDLE);
      return;
    }
    if (this.timer <= 0) this.go(S.PEEKING);
  }

  tickPEEKING(dt) {
    const look = Math.sin(this.stateAge / 700) * 0.8;
    this.anim.setIntent({
      lookX: look,
      headX: look * 1.2,
      earL: 0.3,
      earR: 0.3,
      tailWave: 0.15,
      tailUp: 0,
    });
    if (chance(dt * 0.4)) this.anim.blink();

    if (this.phase === 'paws' && this.timer <= 0) {
      this.phase = 'pawsUp';
      this.tween('offY', ROWS.eyes * this.scale, 1100, easeOut, () => {
        this.hangPaws = 0;
        this.phase = 'look';
        this.timer = randomDelay(K.peekLookMin, K.peekLookMax);
      });
    } else if (this.phase === 'earPause' && this.timer <= 0) {
      this.phase = 'eyes';
      this.tween('offY', ROWS.eyes * this.scale, 800, easeOut, () => {
        this.phase = 'look';
        this.timer = randomDelay(K.peekLookMin, K.peekLookMax);
      });
    } else if (this.phase === 'look' && this.timer <= 0) {
      // seen enough: climb in, or think better of it and slink away
      if (chance(0.72)) {
        this.go(S.ENTERING);
      } else {
        this.phase = 'retreat';
        this.tween('offY', ROWS.hidden * this.scale, 950, easeInOut, () => this.go(S.HIDDEN));
      }
    }
  }

  tickENTERING() {
    this.anim.setIntent({ legMove: this.tweening ? 0.7 : 0, legSpeed: 0.4, tailUp: 0.4 });
    if (!this.tweening && !this.anim.busy) this.go(S.IDLE);
  }

  tickIDLE(dt) {
    this.anim.setIntent({ tailWave: 0.35, tailUp: 0.25 });
    if (chance(dt * 0.25)) this.anim.blink(); // lazy spontaneous blinks

    if (this.caps.cursor && this.caps.motion && this.checkCursor(dt)) return;
    if (this.timer <= 0) this.decide();
  }

  tickWALKING(dt) {
    if (this.anim.busy) return; // still glancing ahead
    const dir = Math.sign(this.targetX - this.x) || this.facing;
    const remaining = Math.abs(this.targetX - this.x);
    const brake = Math.min(1, remaining / 60); // ease into a stop
    const wanted = dir * this.speed * (0.75 + 0.25 * Math.sin(this.stateAge / 900)) * brake;
    this.vx += clamp(wanted - this.vx, -K.accel * dt, K.accel * dt);
    this.x += this.vx * dt;
    this.facing = dir;

    const norm = Math.abs(this.vx) / K.walkSpeedMax;
    this.anim.setIntent({
      legMove: Math.min(1, norm * 1.3),
      legSpeed: Math.min(1, norm),
      tailUp: 0.3,
      tailWave: 0.4 + norm * 0.3,
      lean: dir * 0.25 * Math.min(1, norm),
    });
    if (chance(dt * 0.18)) this.anim.blink();

    // pause mid-route, sometimes to look at the cursor
    if (this.midStopAt !== null && (dir > 0 ? this.x >= this.midStopAt : this.x <= this.midStopAt)) {
      this.midStopAt = null;
      this.walkResume = this.targetX;
      this.vx = 0;
      if (this.caps.cursor && this.tracker.seen && chance(0.55)) this.go(S.WATCHING_CURSOR);
      else {
        this.pendingGesture = pick([CLIPS.lookRight, CLIPS.earTwitch, CLIPS.sniffGround, CLIPS.tailFlick]);
        this.go(S.GESTURE);
      }
      return;
    }

    if (this.caps.cursor && this.caps.motion && chance(dt * 0.25) && this.checkCursor(dt)) return;

    const atEdge = this.x <= K.edgePad + this.catW * 0.2 || this.x >= this.vw - K.edgePad - this.catW * 0.2;
    if (remaining < 4 || atEdge) {
      this.vx = 0;
      if (atEdge) this.edgeDecision();
      else this.go(S.IDLE);
    }
  }

  tickCURSOR_CURIOUS(dt) {
    this.tickWalkTo(dt, () => this.go(S.WATCHING_CURSOR));
    const { nx } = this.aim();
    this.anim.setIntent({
      ...this.gazeIntent(0.5),
      legMove: Math.min(1, Math.abs(this.vx) / K.walkSpeedMax * 1.3),
      legSpeed: Math.min(1, Math.abs(this.vx) / K.walkSpeedMax),
      tailUp: 0.45,
      lean: nx * 0.3,
    });
  }

  tickWalkTo(dt, onArrive) {
    const dir = Math.sign(this.targetX - this.x) || this.facing;
    const remaining = Math.abs(this.targetX - this.x);
    const wanted = dir * this.speed * Math.min(1, remaining / 50);
    this.vx += clamp(wanted - this.vx, -K.accel * dt, K.accel * dt);
    this.x += this.vx * dt;
    if (remaining > 6) this.facing = dir;
    if (remaining < 4) {
      this.vx = 0;
      onArrive();
    }
  }

  tickWATCHING_CURSOR(dt) {
    const { dist, side } = this.aim();
    const alert = this.tracker.speed > K.alertSpeed; // sudden fast move = ears up first
    this.anim.setIntent(
      this.gazeIntent(1, {
        tailWave: alert ? 0.9 : 0.4,
        tailUp: 0.35,
        ...(alert ? { earL: 1, earR: 1 } : {}),
      }),
    );

    // the cursor holding still is fascinating — stare a bit longer, once
    if (!this.staredBonus && this.tracker.stillFor > 1200) {
      this.staredBonus = true;
      this.timer += K.stareBonus;
    }
    if (side !== this.facing && dist > 120 && chance(dt * 0.8)) this.facing = side;

    this.nextMicro -= dt * 1000;
    if (this.nextMicro <= 0 && !this.anim.busy) {
      this.nextMicro = randomDelay(900, 2400);
      this.micro([CLIPS.headTilt, CLIPS.blink, CLIPS.earTwitch, CLIPS.crouch, CLIPS.pawAtNothing, CLIPS.doubleBlink]);
    }

    if (this.timer <= 0 && !this.anim.busy) {
      if (this.caps.rare && dist < K.noticeRadius && chance(K.pounceChance)) this.go(S.POUNCING);
      else if (this.walkResume != null) this.go(S.WALKING);
      else this.go(S.IDLE);
    }
  }

  /** GESTURE is a parking state: the clip owns the pose, intent stays neutral. */
  tickGESTURE() {
    this.anim.setIntent({});
    if (!this.anim.busy) this.go(S.IDLE); // safety net if a clip ends without a callback
  }

  /** Idle filler while in a held state: a blink when motion is reduced. */
  micro(clips) {
    if (!this.caps.motion) this.anim.blink();
    else this.anim.play(pick(clips));
  }

  /** Play a one-off clip and park in GESTURE until it finishes. */
  playThen(clip, onEnd) {
    this.anim.play(clip, onEnd);
    this.state = S.GESTURE;
    this.stateAge = 0;
  }

  tickPOUNCING(dt) {
    if (this.phase === 'leap') {
      this.leapT += dt * 1000;
      const p = Math.min(1, this.leapT / 480);
      this.x = this.leapFrom + this.leapDx * easeOut(p);
      this.offY = -Math.sin(Math.PI * p) * 7 * this.scale;
      this.anim.setIntent({
        ...this.gazeIntent(0.8),
        squash: p < 0.15 ? 0.6 : -0.7,
        legMove: 0.2,
        tailUp: 0.7,
        tailWave: 0.8,
        pawReach: p > 0.4 ? 1 : 0.3,
        pawUp: 0.8,
      });
      if (p >= 1) {
        this.offY = 0;
        this.phase = 'swipe';
        this.anim.play(BEHAVIOR_CLIPS.swipe, () => {
          this.phase = 'return';
          this.speed = randomBetween(K.walkSpeedMin, K.walkSpeedMax);
          this.targetX = this.startX;
          this.facing = Math.sign(this.startX - this.x) || this.facing;
        });
      }
    } else if (this.phase === 'wind') {
      this.anim.setIntent(this.gazeIntent(1, { tailWave: 1, tailUp: 0.5 }));
    } else if (this.phase === 'return') {
      this.tickWalkTo(dt, () => this.go(S.IDLE));
      this.anim.setIntent({
        legMove: Math.min(1, Math.abs(this.vx) / K.walkSpeedMax * 1.3),
        legSpeed: 0.5,
        tailUp: 0.3,
      });
    }
  }

  tickSITTING(dt) {
    const gaze = this.caps.cursor && this.tracker.seen && this.tracker.stillFor < 4000;
    this.anim.setIntent({
      sit: 1,
      tailWave: 0.3,
      tailUp: 0.1,
      ...(gaze ? this.gazeIntent(0.55) : {}),
    });
    if (chance(dt * 0.22)) this.anim.blink();
    this.nextMicro -= dt * 1000;
    if (this.nextMicro <= 0 && !this.anim.busy) {
      this.nextMicro = randomDelay(1500, 3600);
      this.micro([CLIPS.blink, CLIPS.earTwitch, CLIPS.lickPaw, CLIPS.headTilt, CLIPS.yawn]);
    }
    if (this.timer <= 0 && !this.anim.busy) {
      if (chance(0.25) && this.caps.motion) this.go(S.SLEEPING);
      else this.go(S.IDLE);
    }
  }

  tickSLEEPING(dt) {
    this.anim.setIntent({ loaf: 1, sleep: 1, tailWave: 0.08, tailUp: 0, earL: -0.2, earR: -0.2 });
    // a fast cursor nearby can startle it awake
    const startled =
      this.caps.cursor && this.tracker.speed > K.alertSpeed && this.aim().dist < 180 && chance(dt * 2);
    if (this.timer <= 0 || startled) {
      this.playThen(CLIPS.startled, () => this.go(S.IDLE)); // wakes up suddenly
      this.debug.last = 'WAKE';
    }
  }

  tickEXITING(dt) {
    if (this.phase !== 'walkOff') {
      this.anim.setIntent({ legMove: 0, tailUp: 0.3 }); // standing still for the look back
      return;
    }
    this.tickWalkTo(dt, () => this.go(S.HIDDEN));
    const norm = Math.abs(this.vx) / K.walkSpeedMax;
    this.anim.setIntent({
      legMove: Math.min(1, norm * 1.3),
      legSpeed: Math.min(1, norm),
      tailUp: 0.35,
      lean: this.facing * 0.25,
    });
    const gone = this.facing > 0 ? this.x > this.vw + this.catW * 0.6 : this.x < -this.catW * 0.6;
    if (gone) this.go(S.HIDDEN);
  }

  tickRARE(dt) {
    if (this.phase === 'dash') {
      this.vx += clamp(this.facing * K.runSpeed - this.vx, -400 * dt, 400 * dt);
      this.x += this.vx * dt;
      this.anim.setIntent({
        legMove: 1,
        legSpeed: 1,
        tailUp: 0.15,
        tailWave: 0.9,
        lean: this.facing * 0.7,
        earL: -0.6,
        earR: -0.6,
        crouch: 0.35,
      });
      if (this.facing > 0 ? this.x > this.vw + this.catW * 0.6 : this.x < -this.catW * 0.6) {
        this.go(S.HIDDEN);
      }
    } else if (this.phase === 'bugMove') {
      this.tickWalkTo(dt, () => {
        this.phase = 'bugSwat';
        this.anim.play(CLIPS.pawAtNothing, () => {
          if (--this.bugHops <= 0) return this.go(S.IDLE);
          this.phase = 'bugMove';
          this.targetX = clamp(
            this.x + randomBetween(-170, 170),
            K.edgePad + this.catW * 0.25,
            this.vw - K.edgePad - this.catW * 0.25,
          );
          this.facing = Math.sign(this.targetX - this.x) || this.facing;
        });
      });
      this.anim.setIntent({
        legMove: 1,
        legSpeed: 0.9,
        crouch: 0.3,
        tailUp: 0.5,
        tailWave: 0.8,
        lookY: 0.7,
        headY: 1.2,
      });
    } else if (this.phase === 'hang') {
      const look = Math.sin(this.stateAge / 600);
      this.anim.setIntent({ lookX: look, headX: look, earL: 0.4, earR: 0.4, tailWave: 0.3 });
      if (this.timer <= 0 && !this.tweening) {
        this.tween('offY', ROWS.hidden * this.scale, 800, easeInOut, () => {
          this.flipY = false;
          this.go(S.HIDDEN);
        });
        this.phase = 'hangOut';
      }
    } else if (this.phase === 'upsideDown' || this.phase === 'hangOut') {
      this.anim.setIntent({ earL: 0.3, earR: 0.3 });
    }
  }

  /* ── decisions ──────────────────────────────────────────────── */

  /** Cursor proximity / spontaneous glance check. Returns true if it took over. */
  checkCursor(dt) {
    if (!this.tracker.seen || this.anim.busy) return false;
    const { dist } = this.aim();
    if (dist < K.noticeRadius) {
      if (this.noticed) return false;
      this.noticed = true;
      if (chance(K.noticeChance)) {
        this.go(chance(K.approachChance) && dist > 140 ? S.CURSOR_CURIOUS : S.WATCHING_CURSOR);
        return true;
      }
    } else if (dist > K.noticeRadius * 1.4) {
      this.noticed = false;
      if (chance(dt * K.glanceChance * 0.1)) {
        this.go(S.WATCHING_CURSOR);
        return true;
      }
    }
    return false;
  }

  decide() {
    const next = rollIdleState(this.caps);
    if (next === S.RARE) this.go(S.RARE);
    else this.go(next);
  }

  edgeDecision() {
    const action = rollEdgeAction();
    if (action === 'turnAround') {
      this.facing *= -1;
      this.pendingGesture = pick([CLIPS.lookBehind, CLIPS.earTwitch, CLIPS.tailFlick]);
      this.go(S.GESTURE);
    } else if (action === 'sitCorner') {
      this.go(S.SITTING);
    } else if (action === 'peekOut') {
      // look out past the edge, then think about it
      this.playThen(
        {
          name: 'lookOut',
          dur: randomDelay(1200, 2200),
          update: (t, api) => api.set({ lookX: 1, headX: 2.2, earL: 0.4, earR: 0.5, tilt: 0.2 }),
        },
        () => (chance(0.45) ? this.go(S.EXITING) : this.go(S.IDLE)),
      );
    } else {
      this.go(S.EXITING);
    }
  }

  /* ── debug helpers ──────────────────────────────────────────── */

  force(state) {
    if (state === S.GESTURE) this.pendingGesture = null;
    this.tweens = {};
    this.anim.stop();
    this.go(state);
  }

  forceGesture(name) {
    this.pendingGesture = CLIPS[name] || null;
    this.go(S.GESTURE);
  }
}
