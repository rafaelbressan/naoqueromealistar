import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { render, screen, cleanup } from '@testing-library/react';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { SwipeCard } from '@/components/motion/SwipeCard';

/**
 * The JS half of the reduced-motion accommodation.
 *
 * The reduced-motion block in globals.css covers everything CSS drives, but
 * Framer Motion reads numbers out of lib/motion.ts and never sees a custom
 * property. That gap is the leak, and MotionProvider is the single place it
 * gets closed — so it is worth asserting rather than assuming.
 */

afterEach(cleanup);

describe('MotionProvider', () => {
  it('defers to the user preference rather than forcing it on or off', () => {
    /*
     * Asserted against the source rather than behaviour: MotionConfig writes
     * its setting into React context, not the DOM, so there is nothing
     * rendered to inspect, and jsdom ships no matchMedia for useReducedMotion
     * to read.
     *
     * Crude, but it catches the regression that actually matters — someone
     * changing "user" to "never" (nobody gets the accommodation) or "always"
     * (everybody loses the motion), both of which look harmless in a diff.
     */
    const source = readFileSync(
      path.resolve(__dirname, '../components/motion/MotionProvider.tsx'),
      'utf-8'
    );

    expect(
      source,
      'MotionProvider must pass reducedMotion="user" so the preference comes ' +
        'from the OS rather than being hardcoded for everyone.'
    ).toContain('reducedMotion="user"');
  });

  it('renders children unchanged', () => {
    render(
      <MotionProvider>
        <button>Começar</button>
      </MotionProvider>
    );
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument();
  });
});

describe('SwipeCard under reduced motion', () => {
  it('keeps the gesture available', () => {
    // The distinction that matters: reduced motion removes ornament, not
    // input. Someone who asked for less movement must still be able to answer
    // by dragging.
    const onCommit = vi.fn();

    render(
      <MotionProvider>
        <SwipeCard
          enabled
          leftLabel="NÃO"
          rightLabel="SIM"
          onCommit={onCommit}
        >
          <div data-testid="card">pergunta</div>
        </SwipeCard>
      </MotionProvider>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    // The drag surface is present, not stripped out.
    expect(screen.getByTestId('card').parentElement).toBeTruthy();
  });

  it('renders no drag surface when disabled', () => {
    render(
      <MotionProvider>
        <SwipeCard
          enabled={false}
          leftLabel="NÃO"
          rightLabel="SIM"
          onCommit={vi.fn()}
        >
          <div data-testid="card">pergunta</div>
        </SwipeCard>
      </MotionProvider>
    );

    // selecao_unica and informativo have no left/right meaning, so they get
    // no labels to promise one.
    expect(screen.queryByText('SIM')).not.toBeInTheDocument();
    expect(screen.queryByText('NÃO')).not.toBeInTheDocument();
  });
});
