import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Question as QuestionType } from '@/types/quiz';

/**
 * The wiring between a committed drag and the answer it records.
 *
 * tests/swipe.test.ts already covers shouldCommit — whether a drag commits and
 * in which direction. What was not covered is the one line that turns that
 * direction into an answer key, and the gap was not academic: inverting
 * Question.tsx's `direction === 'right' ? 'sim' : 'nao'` left the entire suite
 * green. In a quiz that tells someone whether the law exempts them from
 * military service, silently recording the opposite answer is the worst
 * failure the app has, and it was the least defended.
 *
 * jsdom cannot drive Framer Motion's pointer physics, so SwipeCard is replaced
 * with a stub that exposes onCommit directly. That keeps the assertion on the
 * mapping itself rather than on a gesture simulation that would prove nothing.
 */

const commit = vi.hoisted(() => ({ current: null as ((d: 'left' | 'right') => void) | null }));

vi.mock('@/components/motion/SwipeCard', () => ({
  SwipeCard: ({
    enabled,
    onCommit,
    children,
  }: {
    enabled: boolean;
    onCommit: (direction: 'left' | 'right') => void;
    children: React.ReactNode;
  }) => {
    commit.current = enabled ? onCommit : null;
    return (
      <div>
        <button type="button" onClick={() => onCommit('right')}>
          stub-commit-right
        </button>
        <button type="button" onClick={() => onCommit('left')}>
          stub-commit-left
        </button>
        {children}
      </div>
    );
  },
}));

const { Question } = await import('@/components/Question');

const simNao: QuestionType = {
  id: 'P1',
  pergunta: 'Você é mulher?',
  tipo: 'sim_nao',
  respostas: {
    sim: { resultado: 'FIM_DISPENSADA', razao: 'x', base_legal: 'Art. 5º' },
    nao: { proximo: 'P2' },
  },
};

const selecao: QuestionType = {
  id: 'P13',
  pergunta: 'O que você estuda?',
  tipo: 'selecao_unica',
  respostas: {
    medicina: { proximo: 'P14' },
    outro: { proximo: 'P15' },
  },
};

describe('swipe direction maps to the right answer', () => {
  beforeEach(() => {
    commit.current = null;
  });

  it('swiping right answers "sim"', () => {
    const onAnswer = vi.fn();
    render(<Question question={simNao} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByText('stub-commit-right'));

    expect(onAnswer).toHaveBeenCalledExactlyOnceWith('sim');
  });

  it('swiping left answers "nao"', () => {
    const onAnswer = vi.fn();
    render(<Question question={simNao} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByText('stub-commit-left'));

    expect(onAnswer).toHaveBeenCalledExactlyOnceWith('nao');
  });

  it('agrees with the buttons: the "Sim" button records the same key as a right swipe', () => {
    const swiped = vi.fn();
    const { unmount } = render(<Question question={simNao} onAnswer={swiped} />);
    fireEvent.click(screen.getByText('stub-commit-right'));
    unmount();

    const tapped = vi.fn();
    render(<Question question={simNao} onAnswer={tapped} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sim' }));

    expect(swiped.mock.calls).toEqual(tapped.mock.calls);
  });

  it('leaves the gesture disabled where left and right have no meaning', () => {
    render(<Question question={selecao} onAnswer={vi.fn()} />);

    // A selecao_unica has no yes/no axis, so committing a direction would have
    // to pick an option arbitrarily. SwipeCard must be handed enabled={false}.
    expect(commit.current).toBeNull();
  });
});
