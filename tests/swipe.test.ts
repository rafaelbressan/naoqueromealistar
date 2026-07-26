import { describe, it, expect } from 'vitest';
import { shouldCommit } from '@/components/motion/shouldCommit';
import { SWIPE } from '@/lib/motion';

/**
 * Covers the drag-commit rule directly. jsdom cannot produce real pointer
 * physics, so the component test can only assert that onCommit fires — the
 * question of *when* it should fire is settled here.
 */

describe('shouldCommit', () => {
  describe('distance trigger', () => {
    it('commits right when dragged past the threshold', () => {
      expect(shouldCommit({ offsetX: SWIPE.commitX + 1, velocityX: 0 })).toBe('right');
    });

    it('commits left when dragged past the threshold', () => {
      expect(shouldCommit({ offsetX: -(SWIPE.commitX + 1), velocityX: 0 })).toBe('left');
    });

    it('snaps back exactly at the threshold', () => {
      // Strictly greater-than, so the boundary itself is a snap-back.
      expect(shouldCommit({ offsetX: SWIPE.commitX, velocityX: 0 })).toBeNull();
    });

    it('snaps back below the threshold', () => {
      expect(shouldCommit({ offsetX: SWIPE.commitX - 1, velocityX: 0 })).toBeNull();
      expect(shouldCommit({ offsetX: -(SWIPE.commitX - 1), velocityX: 0 })).toBeNull();
    });
  });

  describe('velocity trigger', () => {
    it('commits on a fast flick that never travelled far', () => {
      // The case the distance rule alone would reject, and the reason the
      // gesture would otherwise feel stuck.
      expect(shouldCommit({ offsetX: 20, velocityX: SWIPE.commitV + 1 })).toBe('right');
      expect(shouldCommit({ offsetX: -20, velocityX: -(SWIPE.commitV + 1) })).toBe('left');
    });

    it('snaps back at the velocity boundary', () => {
      expect(shouldCommit({ offsetX: 20, velocityX: SWIPE.commitV })).toBeNull();
    });

    it('trusts velocity over displacement when both are present', () => {
      // A fast flick rightwards released while the card is still left of
      // centre: the finger's direction is the honest signal.
      expect(shouldCommit({ offsetX: -30, velocityX: SWIPE.commitV + 200 })).toBe('right');
    });

    it('falls back to displacement when the drag was slow', () => {
      expect(shouldCommit({ offsetX: SWIPE.commitX + 50, velocityX: -10 })).toBe('right');
    });
  });

  describe('resting state', () => {
    it('does not commit an untouched card', () => {
      expect(shouldCommit({ offsetX: 0, velocityX: 0 })).toBeNull();
    });
  });
});
