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

  describe('flick trigger', () => {
    it('commits on a fast flick short of the distance threshold', () => {
      // The case the distance rule alone would reject, and the reason the
      // gesture would otherwise feel stuck.
      const short = SWIPE.minFlickX + 10;
      expect(short).toBeLessThan(SWIPE.commitX);

      expect(shouldCommit({ offsetX: short, velocityX: SWIPE.commitV + 1 })).toBe('right');
      expect(shouldCommit({ offsetX: -short, velocityX: -(SWIPE.commitV + 1) })).toBe('left');
    });

    it('snaps back at the velocity boundary', () => {
      expect(
        shouldCommit({ offsetX: SWIPE.minFlickX + 10, velocityX: SWIPE.commitV })
      ).toBeNull();
    });

    it('trusts velocity over displacement when both are present', () => {
      // A fast flick rightwards released while the card is still left of
      // centre: the finger's direction is the honest signal.
      expect(
        shouldCommit({ offsetX: -(SWIPE.minFlickX + 10), velocityX: SWIPE.commitV + 200 })
      ).toBe('right');
    });

    it('falls back to displacement when the drag was slow', () => {
      expect(shouldCommit({ offsetX: SWIPE.commitX + 50, velocityX: -10 })).toBe('right');
    });
  });

  /*
   * Reported from a real device: "it gave a yes at a very slight tilt and I
   * sort of marked it by accident."
   *
   * Speed used to be sufficient on its own, so a fast twitch of a few pixels —
   * the kind you make steadying a phone one-handed, or starting to scroll —
   * answered the question. In a quiz about legal exemption from military
   * service, an answer nobody meant to give reroutes the whole decision tree
   * with nothing to signal it happened.
   */
  describe('accidental twitches', () => {
    it('does not commit a fast twitch that barely moved', () => {
      expect(shouldCommit({ offsetX: 5, velocityX: 2000 })).toBeNull();
      expect(shouldCommit({ offsetX: -5, velocityX: -2000 })).toBeNull();
    });

    it('does not commit exactly at the flick distance floor', () => {
      // Strictly greater-than, so the floor itself is still a snap-back.
      expect(
        shouldCommit({ offsetX: SWIPE.minFlickX, velocityX: SWIPE.commitV + 500 })
      ).toBeNull();
    });

    it('requires real travel however fast the flick', () => {
      const absurdlyFast = SWIPE.commitV * 10;
      expect(shouldCommit({ offsetX: SWIPE.minFlickX - 1, velocityX: absurdlyFast })).toBeNull();
    });

    it('keeps the flick floor below the distance threshold', () => {
      // If these crossed, the flick path would be unreachable and a quick
      // swipe would always snap back.
      expect(SWIPE.minFlickX).toBeLessThan(SWIPE.commitX);
    });
  });

  describe('resting state', () => {
    it('does not commit an untouched card', () => {
      expect(shouldCommit({ offsetX: 0, velocityX: 0 })).toBeNull();
    });
  });
});
