'use client';

import { motion } from 'framer-motion';
import { STACK, SPRING, BLUR } from '@/lib/motion';

/**
 * Perspective container that positions its children by depth.
 *
 * The math is amicro's CardTimeMachine, verbatim: each card sits at
 * `offset * -60px` on Z, `offset * -12px` on Y, tilts `offset * 2deg`, and
 * loses `0.2` opacity per step back. All of it reads from STACK, so retuning
 * the stack means editing lib/motion.ts and globals.css, not this file.
 *
 * What was deliberately NOT ported: the original wraps every card in an SVG
 * feGaussianBlur + feColorMatrix "goo" filter. It is expensive on mobile and
 * the quiz has no use for the fusing effect. Plain `filter: blur()` covers the
 * one case we need.
 */

interface CardStackProps {
  children: React.ReactNode;
  className?: string;
}

export function CardStack({ children, className = '' }: CardStackProps) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ perspective: `${STACK.perspective}px` }}
    >
      {children}
    </div>
  );
}

interface CardStackCardProps {
  /** 0 is the front card. Higher numbers sit further back. */
  offset: number;
  /**
   * Blur the card so it reads as shape without reading as content. Used by the
   * lookahead preview, which must not spoil a result before the answer commits.
   */
  blurred?: boolean;
  /** 0..1 — how far the blur has cleared. 0 is fully blurred. */
  reveal?: number;
  children: React.ReactNode;
  className?: string;
}

export function CardStackCard({
  offset,
  blurred = false,
  reveal = 0,
  children,
  className = '',
}: CardStackCardProps) {
  const isBehind = offset > 0;
  const blurPx = blurred ? BLUR.medium * (1 - Math.min(Math.max(reveal, 0), 1)) : 0;

  return (
    <motion.div
      className={`${isBehind ? 'absolute inset-x-0 top-0' : 'relative'} ${className}`}
      initial={false}
      animate={{
        z: offset * STACK.zStep,
        y: offset * STACK.yStep,
        rotateX: offset * STACK.rotateStep,
        opacity: Math.max(1 - Math.abs(offset) * STACK.opacityStep, 0),
        filter: blurPx > 0 ? `blur(${blurPx}px)` : 'blur(0px)',
      }}
      transition={SPRING.stack}
      style={{
        zIndex: 100 - offset,
        transformStyle: 'preserve-3d',
        // A card behind must not swallow taps meant for the one in front.
        pointerEvents: isBehind ? 'none' : 'auto',
      }}
      // Nor should a screen reader announce a question that has not been asked.
      aria-hidden={isBehind || undefined}
    >
      {children}
    </motion.div>
  );
}

CardStack.Card = CardStackCard;
