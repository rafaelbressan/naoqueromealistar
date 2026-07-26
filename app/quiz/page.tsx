'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuizState } from '@/hooks/useQuizState';
import { Question, QuestionFace } from '@/components/Question';
import { AnswerDock } from '@/components/AnswerDock';
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

  /** -1..1 while the card is being dragged. Picks which lookahead to show. */
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
  // Blur keeps it readable as shape but not as content — see RISK 3.
  const lookahead =
    currentQuestion && dragProgress !== 0
      ? peek(currentQuestion.id, dragProgress > 0 ? 'sim' : 'nao')
      : null;

  return (
    /*
     * overflow-x: clip, not hidden. A dragged card — and the exit that throws
     * it to 140vw — widens the document and lets the user scroll sideways into
     * empty space. `clip` stops that without creating a scroll container, so
     * the sticky navbar keeps sticking; `hidden` would make this element the
     * scrollport and break it.
     */
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white [overflow-x:clip]">
      {!result && currentQuestionId && (
        <>
          <Navbar title={phaseName} canGoBack={canGoBack} onBack={back} />
          <ProgressBar
            currentQuestionId={currentQuestionId}
            totalAnswered={history.length}
          />
        </>
      )}

      <div className="py-4 md:py-8">
        {/*
         * CardStack supplies the perspective. Nothing with `position: fixed`
         * may live inside it — perspective makes it the containing block. The
         * dock is mounted below, outside, for exactly that reason.
         */}
        <CardStack>
          {/* The lookahead sits behind and never receives interaction. */}
          {lookahead && (
            <CardStack.Card
              offset={1}
              blurred
              reveal={0}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="p-4 md:p-6">
                {lookahead.kind === 'question' ? (
                  <QuestionFace question={lookahead.question} />
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 min-h-[8rem]" />
                )}
              </div>
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
                onDragProgress={setDragProgress}
              />
            ) : (
              <div key="loading" className="text-center p-8">
                <p className="text-gray-600">Carregando...</p>
              </div>
            )}
          </AnimatePresence>
        </CardStack>
      </div>

      {/*
       * Outside CardStack on purpose. See AnswerDock's comment and
       * tests/dock-containing-block.test.tsx.
       */}
      {!result && currentQuestion && (
        <AnswerDock
          question={currentQuestion}
          onAnswer={(answerKey) => answer(currentQuestion.id, answerKey)}
        />
      )}
    </div>
  );
}
