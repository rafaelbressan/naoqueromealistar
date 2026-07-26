'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Honours prefers-reduced-motion across every Framer Motion animation in the
 * app, from one place.
 *
 * This exists because the CSS side and the JS side fail differently. The
 * reduced-motion block in globals.css zeroes the custom properties, which
 * covers everything CSS drives — but Framer Motion reads numbers out of
 * lib/motion.ts, never the properties, so none of that reaches it. Left alone,
 * the JS animations would keep running at full amplitude for someone who asked
 * for less, and the leak would be invisible until a user with a vestibular
 * disorder found it.
 *
 * `reducedMotion="user"` disables transform and layout animation while leaving
 * opacity alone, which is the right split: things still appear and disappear,
 * they just stop flying, spinning and tilting to get there.
 *
 * What deliberately survives is the swipe gesture itself. Dragging is a way of
 * answering, not decoration — see RISK 4. SwipeCard drops its rotation via
 * useReducedMotion and keeps responding to the drag.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
