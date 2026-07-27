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

  /*
   * Tilt and labels are both mapped over the commit threshold, so the card
   * reaches full tilt and the label full opacity at exactly the point the
   * answer would land.
   *
   * The tilt used to run over a hardcoded ±200px instead, which had nothing to
   * do with when the gesture actually committed. Combined with the elastic
   * damping below, the card was tilted about four degrees at the moment it
   * answered — the readout said "barely started" while the gesture said
   * "done".
   */
  const rotate = useTransform(
    x,
    [-SWIPE.commitX, 0, SWIPE.commitX],
    [-rotateMax, 0, rotateMax]
  );

  // Full strength at the threshold, so opacity doubles as a readout of how
  // close the answer is to landing. This is what teaches the gesture without a
  // tutorial — but only while it tells the truth.
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
      /*
       * dragElastic 1, not 0.6. Every pixel of this drag is "beyond the
       * constraints", so 0.6 meant the card tracked the finger at 60% while
       * shouldCommit measured the finger itself — the answer landed when the
       * card had moved only three fifths of the way and looked nowhere near
       * committing. At 1 the card is where the finger is, so the threshold,
       * the tilt and the label all describe the same moment.
       *
       * The constraints stay at zero: they are what springs the card home when
       * the drag does not commit.
       */
      dragElastic={1}
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
      // h-full so the whole card is the drag surface. Sized to its content,
      // the grabbable area was only as tall as the text, so a short question
      // left most of the card dead to the gesture.
      className="relative h-full"
    >
      {children}

      {/*
       * Drag readout. Decorative — the buttons carry the accessible name.
       *
       * Tilt comes from the same rotateMax the card uses, so retuning the
       * swipe cannot leave the badges pointing the old way, and a
       * reduced-motion user gets flat badges on a flat card rather than one of
       * each.
       *
       * green-600/red-600 rather than -500: green-500 on white is 2.28:1,
       * under even the 3:1 large-text floor, so the SIM side of the readout
       * was near-invisible to a low-vision user while NÃO was legible. They
       * also match the answer buttons now, so gesture and button speak the
       * same colour.
       */}
      <motion.div
        aria-hidden
        style={{ opacity: rightOpacity, rotate: -rotateMax }}
        className="pointer-events-none absolute top-28 left-6 rounded-lg border-4 border-green-600 bg-white/80 px-4 py-2 text-2xl font-extrabold tracking-wider text-green-600"
      >
        {rightLabel}
      </motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: leftOpacity, rotate: rotateMax }}
        className="pointer-events-none absolute top-28 right-6 rounded-lg border-4 border-red-600 bg-white/80 px-4 py-2 text-2xl font-extrabold tracking-wider text-red-600"
      >
        {leftLabel}
      </motion.div>
    </motion.div>
  );
}
