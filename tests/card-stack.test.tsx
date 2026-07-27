import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardStack } from '@/components/motion/CardStack';
import { STACK } from '@/lib/motion';

/**
 * The two promises CardStackCard's own comments make about cards behind the
 * front one: they must not swallow taps, and they must not be announced.
 *
 * Both matter because of what sits back there. The lookahead renders the
 * question an answer *would* lead to, while the user is still dragging and has
 * decided nothing. A screen reader announcing it would ask a question that was
 * never asked; a stray tap landing on it would answer one.
 *
 * Neither was asserted, and forcing pointerEvents to 'auto' with aria-hidden
 * removed left the whole suite green.
 */

describe('CardStack depth invariants', () => {
  it('hides cards behind from pointers and from screen readers', () => {
    render(
      <CardStack>
        <CardStack.Card offset={1}>
          <div data-testid="behind" />
        </CardStack.Card>
        <CardStack.Card offset={0}>
          <div data-testid="front" />
        </CardStack.Card>
      </CardStack>
    );

    const behind = screen.getByTestId('behind').parentElement!;
    const front = screen.getByTestId('front').parentElement!;

    expect(behind).toHaveAttribute('aria-hidden', 'true');
    expect(behind.style.pointerEvents).toBe('none');

    expect(front).not.toHaveAttribute('aria-hidden');
    expect(front.style.pointerEvents).toBe('auto');
  });

  it('paints nearer cards above further ones', () => {
    render(
      <CardStack>
        <CardStack.Card offset={2}>
          <div data-testid="far" />
        </CardStack.Card>
        <CardStack.Card offset={0}>
          <div data-testid="near" />
        </CardStack.Card>
      </CardStack>
    );

    const far = Number(screen.getByTestId('far').parentElement!.style.zIndex);
    const near = Number(screen.getByTestId('near').parentElement!.style.zIndex);

    expect(near).toBeGreaterThan(far);
  });

  it('keeps the live card above the deepest lookahead the stack can show', () => {
    /*
     * The question card is not a CardStack.Card — it lives inside
     * AnimatePresence and carries `z-[100]` in Question.tsx. That number has to
     * stay above every z-index this component can hand out, or the blurred
     * preview paints over the card being answered.
     */
    render(
      <CardStack>
        <CardStack.Card offset={1}>
          <div data-testid="lookahead" />
        </CardStack.Card>
      </CardStack>
    );

    const lookahead = Number(screen.getByTestId('lookahead').parentElement!.style.zIndex);

    expect(lookahead).toBeLessThan(100);
  });

  it('never drives opacity negative, however deep the card', () => {
    render(
      <CardStack>
        <CardStack.Card offset={99}>
          <div data-testid="very-deep" />
        </CardStack.Card>
      </CardStack>
    );

    const opacity = Number(screen.getByTestId('very-deep').parentElement!.style.opacity);

    expect(opacity).toBeGreaterThanOrEqual(0);
  });

  it('reads its perspective from the shared token', () => {
    const { container } = render(
      <CardStack>
        <div />
      </CardStack>
    );

    expect((container.firstChild as HTMLElement).style.perspective).toBe(
      `${STACK.perspective}px`
    );
  });
});
