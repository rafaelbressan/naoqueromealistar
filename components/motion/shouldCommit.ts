import { SWIPE } from '@/lib/motion';

export type SwipeDirection = 'left' | 'right';

/**
 * Decide whether a finished drag answers the question, and which way.
 *
 * Two independent triggers, either one is enough:
 *
 *   distance — the card was dragged past SWIPE.commitX
 *   velocity — the card was flicked faster than SWIPE.commitV px/s
 *
 * The velocity trigger is not a nicety. Without it a short, fast flick — the
 * most natural way to answer a stack of yes/no questions quickly — snaps back
 * and the gesture feels stuck.
 *
 * Lives apart from SwipeCard because jsdom cannot simulate pointer physics.
 * Testing the decision here means the rule is covered even though the drag
 * itself is not.
 */
export function shouldCommit({
  offsetX,
  velocityX,
}: {
  offsetX: number;
  velocityX: number;
}): SwipeDirection | null {
  const farEnough = Math.abs(offsetX) > SWIPE.commitX;
  const fastEnough = Math.abs(velocityX) > SWIPE.commitV;

  if (!farEnough && !fastEnough) return null;

  // On a fast flick, velocity is the honest signal: the finger can leave
  // travelling right while the card still sits left of centre. Fall back to
  // displacement only when the flick was slow.
  const signal = fastEnough ? velocityX : offsetX;

  return signal > 0 ? 'right' : 'left';
}
