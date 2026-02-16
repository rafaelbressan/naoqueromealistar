'use client';

import { AnimatePresence } from 'framer-motion';
import { useQuizState } from '@/hooks/useQuizState';
import { Question } from '@/components/Question';
import { Result } from '@/components/Result';
import { Navbar } from '@/components/Navbar';
import { ProgressBar, getPhaseInfo } from '@/components/ProgressBar';

export default function QuizPage() {
  const {
    currentQuestion,
    currentQuestionId,
    result,
    history,
    handleAnswer,
    goBack,
    restart,
    canGoBack,
  } = useQuizState();

  const { phaseName } = getPhaseInfo(currentQuestionId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {!result && currentQuestionId && (
        <>
          <Navbar
            title={phaseName}
            canGoBack={canGoBack}
            onBack={goBack}
          />
          <ProgressBar
            currentQuestionId={currentQuestionId}
            totalAnswered={history.length}
          />
        </>
      )}

      <div className="py-4 md:py-8">
        <AnimatePresence mode="wait">
          {result ? (
            <Result key="result" result={result} onRestart={restart} />
          ) : currentQuestion ? (
            <Question
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={(answerKey) => handleAnswer(currentQuestion.id, answerKey)}
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-600">Carregando...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
