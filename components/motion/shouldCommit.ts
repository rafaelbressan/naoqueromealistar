import { SWIPE } from '@/lib/motion';

export type SwipeDirection = 'left' | 'right';

/**
 * Decide whether a finished drag answers the question, and which way.
 *
 * Two triggers:
 *
 *   distance — dragged past SWIPE.commitX
 *   flick    — faster than SWIPE.commitV px/s AND past SWIPE.minFlickX
 *
 * The flick trigger is not a nicety. Without it a short, fast swipe — the most
 * natural way to answer a stack of yes/no questions quickly — snaps back and
 * the gesture feels stuck.
 *
 * But speed alone used to be enough, and that was wrong. A card is a thing
 * people touch while reading: a fast twitch of a few pixels, the kind you make
 * steadying a phone one-handed, cleared the velocity bar on its own and
 * answered the question. Reported from a real device as "I sort of marked it
 * by accident". Requiring the flick to actually travel minFlickX keeps the
 * quick swipe and drops the twitch, because a deliberate flick always covers
 * ground and an accidental one does not.
 *
 * The stakes are why the bar sits where it does. This is a quiz about legal
 * exemption from military service, and a wrong answer is not a wrong card —
 * it silently reroutes someone through the decision tree toward advice that is
 * not about them. Snapping back costs a repeated gesture. Committing by
 * accident costs a wrong result the user has no reason to distrust.
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
  const distance = Math.abs(offsetX);

  const farEnough = distance > SWIPE.commitX;
  const flicked = Math.abs(velocityX) > SWIPE.commitV && distance > SWIPE.minFlickX;

  if (!farEnough && !flicked) return null;

  // On a flick, velocity is the honest signal: the finger can leave travelling
  // right while the card still sits left of centre. Fall back to displacement
  // only when the gesture was slow.
  const signal = flicked ? velocityX : offsetX;

  return signal > 0 ? 'right' : 'left';
}
