import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuizPage from '@/app/quiz/page';

/**
 * Guards the fix from commit 5659518.
 *
 * An element with `transform`, `filter` or `perspective` becomes the
 * containing block for its `position: fixed` descendants. Put the mobile
 * answer dock inside one and it stops being pinned to the viewport: it slides
 * along with the card mid-transition and snaps back when the transform is
 * dropped.
 *
 * That was fixed once by keeping the dock a sibling of the animated
 * motion.div. The motion work reintroduced the hazard twice over — SwipeCard
 * adds a transform, CardStack adds a perspective — so the structural rule is
 * now asserted rather than described.
 *
 * This checks the React tree, not layout. jsdom does not compute containing
 * blocks, but it does not need to: the property that matters is which
 * ancestors the dock has, and that is exactly what is inspected here.
 */

/** Properties that promote an element to containing block for fixed children. */
const CONTAINING_BLOCK_PROPS = ['transform', 'perspective', 'filter'] as const;

function offendingAncestor(el: HTMLElement): { element: HTMLElement; prop: string } | null {
  let node = el.parentElement;

  while (node && node !== document.body) {
    for (const prop of CONTAINING_BLOCK_PROPS) {
      const inline = node.style.getPropertyValue(prop);
      if (inline && inline !== 'none') {
        return { element: node, prop };
      }
    }
    node = node.parentElement;
  }

  return null;
}

describe('answer dock containing block', () => {
  it('renders the dock', () => {
    render(<QuizPage />);
    expect(screen.getByTestId('answer-dock')).toBeInTheDocument();
  });

  it('has no ancestor that would capture position: fixed', () => {
    render(<QuizPage />);
    const dock = screen.getByTestId('answer-dock');

    const offender = offendingAncestor(dock);

    expect(
      offender,
      offender
        ? `The answer dock is nested inside an element with "${offender.prop}: ` +
            `${offender.element.style.getPropertyValue(offender.prop)}". That element ` +
            `becomes the containing block for position:fixed descendants, so the dock ` +
            `will slide with the card instead of staying pinned — the regression fixed ` +
            `in commit 5659518. Move the dock outside CardStack and SwipeCard.`
        : undefined
    ).toBeNull();
  });

  it('is not a descendant of the card stack', () => {
    // Belt and braces: CardStack carries the perspective, and this states the
    // intent directly rather than inferring it from a style property.
    render(<QuizPage />);
    const dock = screen.getByTestId('answer-dock');

    const stack = document.querySelector('[style*="perspective"]');
    expect(stack, 'expected CardStack to render a perspective container').toBeTruthy();
    expect(stack!.contains(dock)).toBe(false);
  });

  it('detects a bad nesting when one exists', () => {
    // Proves the guard above can actually fail, rather than passing because
    // the traversal never finds anything.
    const { getByTestId } = render(
      <div style={{ perspective: '800px' }}>
        <div data-testid="nested-dock" style={{ position: 'fixed' }} />
      </div>
    );

    expect(offendingAncestor(getByTestId('nested-dock'))).not.toBeNull();
  });
});
