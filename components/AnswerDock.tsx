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
  return (
    <div
      data-testid="answer-dock"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20"
    >
      <AnswerButtons question={question} onAnswer={onAnswer} />
    </div>
  );
}
