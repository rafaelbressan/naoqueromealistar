import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import QuizPage from '@/app/quiz/page';

/**
 * Guards the fix from commit 5659518, generalised.
 *
 * An element with `transform`, `filter` or `perspective` becomes the
 * containing block for its `position: fixed` descendants. A fixed element
 * inside one stops being pinned to the viewport: it slides along with the card
 * mid-transition and snaps back when the transform is dropped.
 *
 * The original bug was the mobile answer dock. That dock is gone — the answer
 * controls live inside the card now and travel with it deliberately — so this
 * no longer guards one component. It guards the rule, which outlived it:
 * CardStack carries a perspective and SwipeCard a transform, so *nothing*
 * rendered inside them may use fixed positioning. The next person to reach for
 * a pinned toolbar, a floating hint or a bottom sheet hits this test rather
 * than the bug.
 *
 * This checks the React tree, not layout. jsdom computes no containing blocks,
 * but it does not need to: what matters is which ancestors a fixed element
 * has, and that is exactly what is inspected.
 */

/** Properties that promote an element to containing block for fixed children. */
const CONTAINING_BLOCK_PROPS = ['transform', 'perspective', 'filter'] as const;

/**
 * Fixed positioning arrives two ways and both have to be caught. Framer Motion
 * writes inline styles; everything else here uses Tailwind, whose `fixed`
 * class never reaches jsdom as a computed style because no stylesheet is
 * loaded. Checking only inline styles would miss every Tailwind case — which
 * is to say, almost all of them. That blind spot is why the previous version
 * of this file could not see the hazards it named.
 */
function isFixed(el: Element): boolean {
  const inline = (el as HTMLElement).style?.position === 'fixed';
  const utility = /(^|\s)(fixed|sticky)(\s|$)/.test(el.className?.toString() ?? '');
  return inline || utility;
}

function containingBlockAncestor(
  el: Element,
  root: Element
): { element: HTMLElement; prop: string } | null {
  let node = el.parentElement;

  while (node && node !== root.parentElement) {
    for (const prop of CONTAINING_BLOCK_PROPS) {
      const inline = node.style.getPropertyValue(prop);
      if (inline && inline !== 'none') return { element: node, prop };
    }
    node = node.parentElement;
  }

  return null;
}

describe('nothing fixed lives inside a containing block', () => {
  it('the card stack renders a perspective container', () => {
    // The rest of the suite is vacuous if this selector stops matching, so it
    // is asserted on its own rather than assumed.
    render(<QuizPage />);
    expect(
      document.querySelector('[style*="perspective"]'),
      'expected CardStack to render a perspective container'
    ).toBeTruthy();
  });

  it('no descendant of the card stack is fixed or sticky', () => {
    render(<QuizPage />);
    const stack = document.querySelector('[style*="perspective"]')!;

    const offenders = Array.from(stack.querySelectorAll('*')).filter(isFixed);

    expect(
      offenders.map((el) => el.className?.toString() || el.tagName),
      `These elements use fixed/sticky positioning inside CardStack, whose ` +
        `perspective makes it their containing block. They drift with the card ` +
        `instead of staying put — the regression fixed in commit 5659518. ` +
        `Render them as a sibling of CardStack, not inside it.`
    ).toEqual([]);
  });

  it('the answer controls travel with the card', () => {
    /*
     * The inverse of the rule above, and the reason the dock was deleted: the
     * buttons must be *inside* the swipe surface so they move with the card
     * during a drag. A card that flies off screen leaving its own controls
     * behind is the bug this replaced.
     */
    render(<QuizPage />);
    const stack = document.querySelector('[style*="perspective"]')!;

    const buttons = Array.from(stack.querySelectorAll('button')).filter((b) =>
      ['Sim', 'Não', 'Continuar'].includes(b.textContent?.trim() ?? '')
    );

    expect(
      buttons.length,
      'expected the answer buttons to render inside CardStack so they move with the card'
    ).toBeGreaterThan(0);
  });

  it('detects a bad nesting when one exists', () => {
    // Proves the guard can actually fail, rather than passing because the
    // traversal never finds anything.
    const { container } = render(
      <div style={{ perspective: '800px' }}>
        <div data-testid="nested" className="fixed bottom-0" />
      </div>
    );

    const root = container.firstElementChild!;
    const offenders = Array.from(root.querySelectorAll('*')).filter(isFixed);

    expect(offenders).toHaveLength(1);
    expect(containingBlockAncestor(offenders[0], root)).not.toBeNull();
  });
});
