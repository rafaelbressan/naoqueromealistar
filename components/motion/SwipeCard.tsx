'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import { SWIPE, SPRING } from '@/lib/motion';
import { shouldCommit, type SwipeDirection } from './shouldCommit';

/**
 * Horizontal drag wrapper. Right commits "sim", left commits "nao".
 *
 * Only yes/no questions can be swiped — `selecao_unica` and `informativo`
 * have no left/right meaning, so they pass `enabled={false}` and the card
 * simply does not move.
 *
 * Reduced motion keeps the gesture and drops the rotation. Swiping is an
 * input method, not an ornament; removing it would take a way of answering
 * away from the people who already have the fewest.
 */

interface SwipeCardProps {
  enabled: boolean;
  leftLabel: string;
  rightLabel: string;
  onCommit: (direction: SwipeDirection) => void;
  /** -1..1 while dragging. Feeds the lookahead preview behind the card. */
  onDragProgress?: (progress: number) => void;
  children: React.ReactNode;
}

export function SwipeCard({
  enabled,
  leftLabel,
  rightLabel,
  onCommit,
  onDragProgress,
  children,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  // Guards against a second commit firing from a trailing drag event after
  // the card has already been answered and is animating out.
  const committed = useRef(false);

  const rotateMax = prefersReducedMotion ? 0 : SWIPE.rotateMax;
  const rotate = useTransform(x, [-200, 0, 200], [-rotateMax, 0, rotateMax]);

  // Labels reach full strength at the commit threshold, so their opacity
  // doubles as a readout of how close the answer is to landing. This is what
  // teaches the gesture without a tutorial.
  const rightOpacity = useTransform(x, [0, SWIPE.commitX], [0, 1]);
  const leftOpacity = useTransform(x, [-SWIPE.commitX, 0], [1, 0]);

  const handleDrag = (_: unknown, info: PanInfo) => {
    onDragProgress?.(Math.max(-1, Math.min(1, info.offset.x / SWIPE.commitX)));
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (committed.current) return;

    const direction = shouldCommit({
      offsetX: info.offset.x,
      velocityX: info.velocity.x,
    });

    if (direction) {
      committed.current = true;
      onCommit(direction);
    } else {
      onDragProgress?.(0);
    }
  };

  if (!enabled) return <>{children}</>;

  return (
    <motion.div
      drag="x"
      dragDirectionLock
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{
        x,
        rotate,
        // Hands vertical scrolling back to the browser. Without it the drag
        // steals the gesture and long explanations become unreadable.
        touchAction: 'pan-y',
      }}
      whileDrag={{ cursor: 'grabbing' }}
      transition={SPRING.settle}
      className="relative"
    >
      {children}

      {/* Drag readout. Decorative — the buttons carry the accessible name. */}
      <motion.div
        aria-hidden
        style={{ opacity: rightOpacity }}
        className="pointer-events-none absolute top-8 left-6 rotate-[-12deg] rounded-lg border-4 border-green-500 px-4 py-2 text-2xl font-extrabold tracking-wider text-green-500"
      >
        {rightLabel}
      </motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: leftOpacity }}
        className="pointer-events-none absolute top-8 right-6 rotate-[12deg] rounded-lg border-4 border-red-500 px-4 py-2 text-2xl font-extrabold tracking-wider text-red-500"
      >
        {leftLabel}
      </motion.div>
    </motion.div>
  );
}
