'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuizState } from '@/hooks/useQuizState';
import { Question, QuestionFace } from '@/components/Question';
import { Result } from '@/components/Result';
import { Navbar } from '@/components/Navbar';
import { ProgressBar, getPhaseInfo } from '@/components/ProgressBar';
import { CardStack } from '@/components/motion/CardStack';

type ExitDirection = 'left' | 'right' | 'neutral';

export default function QuizPage() {
  const {
    currentQuestion,
    currentQuestionId,
    result,
    history,
    lastDirection,
    peek,
    handleAnswer,
    goBack,
    restart,
    canGoBack,
  } = useQuizState();

  /**
   * Which way the card that is leaving should fly. AnimatePresence reads
   * `custom` at the moment a child is removed, so this has to be set in the
   * same handler that answers — both are page state, so React batches them
   * into the render where the exit begins.
   */
  const [exitDirection, setExitDirection] = useState<ExitDirection>('neutral');

  /**
   * Which lookahead to show: -1 dragging left, 1 right, 0 not dragging.
   *
   * Deliberately the sign and not the -1..1 magnitude. SwipeCard reports
   * progress on every pointermove, so storing the raw value re-rendered this
   * whole subtree — navbar, progress bar (which re-runs its phase regexes),
   * the stack, the lookahead face and the dock — around sixty times a second
   * for a value whose only two readers are `!== 0` and `> 0`. Quantising to
   * three states lets React bail out on the identical value, so a drag costs
   * at most two renders instead of one per frame.
   */
  const [dragProgress, setDragProgress] = useState(0);

  const { phaseName } = getPhaseInfo(currentQuestionId);

  const answer = (questionId: string, answerKey: string) => {
    setExitDirection(
      answerKey === 'sim' ? 'right' : answerKey === 'nao' ? 'left' : 'neutral'
    );
    setDragProgress(0);
    handleAnswer(questionId, answerKey);
  };

  const back = () => {
    // Going back reverses the journey: the card leaves the way it arrived.
    setExitDirection('right');
    setDragProgress(0);
    goBack();
  };

  // Resolve the card behind the current one from the direction of the drag.
  // Blur keeps it readable as shape but not as content: the preview must show
  // that something is coming without spoiling what, and a terminating branch
  // must never leak its result before the answer commits.
  const lookahead =
    currentQuestion && dragProgress !== 0
      ? peek(currentQuestion.id, dragProgress > 0 ? 'sim' : 'nao')
      : null;

  return (
    /*
     * A fixed-height flex column, not a scrolling page.
     *
     * The card has to fill whatever is left after the navbar and progress bar,
     * and it has to be the same height on every question — letting each card
     * size itself to its own text made the stack behind show through unevenly.
     * Measuring the chrome in CSS would mean hardcoding a number that breaks
     * the moment the navbar changes; giving the card area `flex-1` lets the
     * browser do the arithmetic.
     *
     * dvh rather than vh because mobile browser chrome expands and collapses
     * on scroll, and vh is frozen at the taller measurement — the footer with
     * the answer buttons would sit below the fold exactly when it matters.
     *
     * overflow-x: clip, not hidden. A dragged card — and the exit that throws
     * it to 140vw — widens the document and lets the user scroll sideways into
     * empty space. `clip` stops that without creating a scroll container.
     */
    <div className="flex h-dvh flex-col bg-gradient-to-b from-blue-50 to-white [overflow-x:clip]">
      {!result && currentQuestionId && (
        <>
          <Navbar title={phaseName} canGoBack={canGoBack} onBack={back} />
          <ProgressBar
            currentQuestionId={currentQuestionId}
            totalAnswered={history.length}
          />
        </>
      )}

      {/*
       * min-h-0 lets this shrink below its content so the card scrolls
       * internally instead of pushing the layout taller than the viewport.
       *
       * CardStack supplies the perspective, which makes it the containing
       * block for any `position: fixed` descendant. Nothing inside may use
       * fixed positioning — that is what sent the answer dock sliding along
       * with the card the first time. The controls now live inside the card
       * and travel with it by design, so there is no fixed element left to
       * misplace; tests/dock-containing-block.test.tsx keeps it that way.
       */}
      <div className="min-h-0 flex-1 px-4 py-4 md:py-6">
        <CardStack className="h-full">
          {/*
           * The lookahead sits behind and never receives interaction. It has
           * to be exactly the size of the card in front — a preview an inch
           * shorter reads as a rendering fault, not as depth.
           *
           * A terminating branch renders an empty card rather than the result:
           * the preview must say that something is coming without saying what,
           * or the blur becomes a spoiler for the answer being decided.
           */}
          {lookahead && (
            <CardStack.Card
              offset={1}
              blurred
              reveal={0}
              className="mx-auto w-full max-w-2xl"
            >
              {lookahead.kind === 'question' ? (
                <QuestionFace question={lookahead.question} />
              ) : (
                <div className="h-full rounded-2xl bg-white shadow-lg" />
              )}
            </CardStack.Card>
          )}

          <AnimatePresence mode="popLayout" custom={exitDirection} initial={false}>
            {result ? (
              <Result key="result" result={result} onRestart={restart} />
            ) : currentQuestion ? (
              <Question
                key={currentQuestion.id}
                question={currentQuestion}
                enterFrom={lastDirection === 'back' ? 'left' : 'right'}
                onAnswer={(answerKey) => answer(currentQuestion.id, answerKey)}
                onDragProgress={(progress) => setDragProgress(Math.sign(progress))}
              />
            ) : (
              <div key="loading" className="text-center p-8">
                <p className="text-gray-600">Carregando...</p>
              </div>
            )}
          </AnimatePresence>
        </CardStack>
      </div>
    </div>
  );
}
