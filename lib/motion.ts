/**
 * Motion tokens, JS side.
 *
 * Framer Motion takes numbers, not `var(--duration-fast)`, so the scale in
 * app/globals.css has to exist here too. That duplication is the point of
 * tests/motion-tokens.test.ts: change one side without the other and CI goes
 * red. Do not edit these values without editing globals.css to match.
 *
 * Durations are in SECONDS here and milliseconds in CSS — Framer Motion's
 * unit. The test normalises before comparing.
 */

export const DURATION = {
  stagger: 0.04,
  micro: 0.08,
  quick: 0.15,
  fast: 0.25,
  medium: 0.35,
  slow: 0.4,
  verySlow: 0.5,
} as const;

/** Cubic-bezier control points. */
export const EASE = {
  smoothOut: [0.22, 1, 0.36, 1],
  bounce: [0.34, 1.36, 0.64, 1],
  bounceStrong: [0.34, 3.85, 0.64, 1],
} as const;

/**
 * Keyword easings, in Framer Motion's spelling. Separate from EASE because
 * these are names rather than curves, so the parity test compares them against
 * their CSS keyword rather than parsing control points.
 *
 * Usage split, per transitions.dev: smoothOut covers surfaces moving or
 * resizing (modal, dropdown, panel, page slide); inOut covers content changing
 * in place (icon swap, text swap, text reveal, number pop-in).
 */
export const EASE_KEYWORD = {
  inOut: 'easeInOut',
  out: 'easeOut',
  linear: 'linear',
} as const;

/**
 * `stack` comes verbatim from amicro's CardTimeMachine. `settle` is stiffer
 * because a snap-back that lingers reads as a bug.
 */
export const SPRING = {
  stack: { type: 'spring', stiffness: 250, damping: 25, mass: 0.8 },
  settle: { type: 'spring', stiffness: 400, damping: 35 },
} as const;

/** Pixels. Where a surface animates FROM; it always settles at 0. */
export const DISTANCE = {
  micro: 4,
  small: 6,
  base: 8,
  medium: 12,
  large: 30,
} as const;

/** Where a surface animates FROM; it always settles at 1. */
export const SCALE = {
  large: 0.96,
  medium: 0.97,
  small: 0.98,
  tiny: 0.99,
} as const;

/** Pixels. Where a surface animates FROM; it always settles at 0. */
export const BLUR = {
  small: 2,
  medium: 3,
  large: 8,
} as const;

export const STACK = {
  perspective: 800,
  zStep: -60,
  yStep: -12,
  rotateStep: 2,
  opacityStep: 0.2,
} as const;

export const SWIPE = {
  /**
   * Drag past this many px and the answer commits.
   *
   * Also the range the tilt and the SIM/NÃO labels are mapped over, so the
   * card sits at exactly rotateMax and the label at exactly full opacity at
   * the moment it would commit. Tying all three to one number is what makes
   * the readout honest: reaching the threshold looks like reaching the
   * threshold.
   */
  commitX: 160,
  /**
   * Or flick faster than this many px/s. Paired with minFlickX, never alone —
   * see shouldCommit.
   */
  commitV: 900,
  /**
   * Floor for the velocity path. A flick has to actually travel this far
   * before speed counts, so a fast twitch on a card the user was only
   * steadying cannot answer a question.
   */
  minFlickX: 56,
  rotateMax: 12,
  /**
   * Viewport widths a committed card travels before it is unmounted. Far
   * enough that the card is gone, not so far that the easing spends its last
   * frames animating something nobody can see.
   */
  exitX: 140,
} as const;
