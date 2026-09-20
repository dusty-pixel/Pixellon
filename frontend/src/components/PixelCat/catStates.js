/** The cat's state machine vocabulary + the weighted "what next" roll. */
import { IDLE_WEIGHTS, RARE_WEIGHTS } from './catConfig.js';
import { weightedRandom } from './catRandom.js';

export const S = {
  HIDDEN: 'HIDDEN',
  PEEKING: 'PEEKING',
  ENTERING: 'ENTERING',
  IDLE: 'IDLE',
  WALKING: 'WALKING',
  WATCHING_CURSOR: 'WATCHING_CURSOR',
  CURSOR_CURIOUS: 'CURSOR_CURIOUS',
  POUNCING: 'POUNCING',
  GESTURE: 'GESTURE',
  SITTING: 'SITTING',
  SLEEPING: 'SLEEPING',
  EXITING: 'EXITING',
  RARE: 'RARE',
};

/**
 * Roll the next state out of IDLE.
 * @param {{cursor: boolean, motion: boolean, rare: boolean}} caps device capabilities
 */
export function rollIdleState(caps) {
  const weights = { ...IDLE_WEIGHTS };
  if (!caps.cursor) delete weights.WATCHING_CURSOR;
  if (!caps.rare) delete weights.RARE;
  if (!caps.motion) {
    // reduced motion: only quiet, in-place behavior
    return weightedRandom({ GESTURE: 70, SITTING: 30 });
  }
  return weightedRandom(weights);
}

export function rollRareBehavior(caps) {
  const weights = { ...RARE_WEIGHTS };
  if (!caps.cursor) delete weights.tailChase;
  return weightedRandom(weights);
}

/** Roll what happens when the cat reaches a viewport edge. */
export function rollEdgeAction() {
  return weightedRandom({ turnAround: 45, sitCorner: 25, peekOut: 15, exit: 15 });
}

export default S;
