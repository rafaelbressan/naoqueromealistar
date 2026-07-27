'use client';

import type { Question as QuestionType } from '@/types/quiz';
import { AnswerButtons } from './AnswerButtons';

/**
 * Fixed bottom dock on mobile.
 *
 * This lives in its own component, rendered by the page rather than by
 * Question, for one structural reason: an ancestor with `transform`,
 * `filter` OR `perspective` becomes the containing block for its
 * `position: fixed` descendants. The dock would then scroll and slide with
 * the card instead of staying pinned, and snap back when the transform is
 * removed.
 *
 * That exact bug was fixed once already in commit 5659518, where keeping the
 * dock a sibling of the animated motion.div was enough. It is not enough
 * anymore: SwipeCard adds a transform and CardStack adds a perspective, so
 * the dock has to sit outside both subtrees entirely — hence a separate
 * component that the page mounts on its own.
 *
 * tests/dock-containing-block.test.tsx guards the structure so this does not
 * have to rely on anyone reading this comment.
 */

interface AnswerDockProps {
  question: QuestionType;
  onAnswer: (answerKey: string) => void;
}

export function AnswerDock({ question, onAnswer }: AnswerDockProps) {
  /*
   * Only yes/no docks. A `selecao_unica` has up to 8 options (P8_1), each with
   * a 56px floor plus gaps — roughly 564px of fixed, bottom-pinned panel. On an
   * iPhone SE that is taller than the viewport: it covers the question, the
   * progress bar and the navbar, and because it is `position: fixed` there is
   * no way to scroll to the options it pushed off screen. P8 sits in Phase 3,
   * so every user not short-circuited earlier walks into it.
   *
   * Those question types render inline in the card instead, where they scroll
   * with the page like any other content.
   */
  if (question.tipo !== 'sim_nao') return null;

  return (
    <div
      data-testid="answer-dock"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20"
      /*
       * The bottom 34px of a notched iPhone belong to the home indicator. With
       * a flat 1rem of padding the answer buttons' lower third lands inside
       * the system swipe-up zone, so taps on the primary action get swallowed
       * — on the phone-first audience this quiz is built for.
       */
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <AnswerButtons question={question} onAnswer={onAnswer} />
    </div>
  );
}
