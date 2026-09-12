/** CursorTracker — pointer position, smoothed speed, and how long it has been still. */
export default class CursorTracker {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.speed = 0; // px/s, smoothed
    this.seen = false; // has a real mouse ever moved?
    this.lastMove = 0;
    this.enabled = true;
    this._prev = 0;
  }

  attach() {
    window.addEventListener('pointermove', this.onMove, { passive: true });
    window.addEventListener('pointerdown', this.onMove, { passive: true });
  }

  detach() {
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerdown', this.onMove);
  }

  onMove = (event) => {
    if (!this.enabled || event.pointerType === 'touch') return;
    const now = performance.now();
    const dt = Math.max(16, now - (this._prev || now)) / 1000;
    const dist = Math.hypot(event.clientX - this.x, event.clientY - this.y);
    this.speed = this.seen ? this.speed * 0.6 + (dist / dt) * 0.4 : 0;
    this.x = event.clientX;
    this.y = event.clientY;
    this._prev = now;
    this.lastMove = now;
    this.seen = true;
  };

  update(dt) {
    this.speed *= Math.exp(-dt * 4); // decay when the pointer stops
  }

  /** ms since the cursor last moved. */
  get stillFor() {
    return this.seen ? performance.now() - this.lastMove : 0;
  }

  distanceTo(x, y) {
    return this.seen ? Math.hypot(this.x - x, this.y - y) : Infinity;
  }
}
