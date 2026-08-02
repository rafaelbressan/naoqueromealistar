'use client';

import type { Question as QuestionType } from '@/types/quiz';

/**
 * The answer controls, shared by the desktop card and the mobile dock.
 *
 * Extracted so the two render the same buttons from one definition — they used
 * to call a closure defined inside Question, which stopped working once the
 * dock had to live outside the card's subtree. See AnswerDock for why.
 */

interface AnswerButtonsProps {
  question: QuestionType;
  onAnswer: (answerKey: string) => void;
}

export function AnswerButtons({ question, onAnswer }: AnswerButtonsProps) {
  if (question.tipo === 'sim_nao') {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => onAnswer('nao')}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg text-lg t-btn"
          style={{ minHeight: '56px' }}
        >
          Não
        </button>
        <button
          onClick={() => onAnswer('sim')}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg text-lg t-btn"
          style={{ minHeight: '56px' }}
        >
          Sim
        </button>
      </div>
    );
  }

  if (question.tipo === 'selecao_unica') {
    return (
      <div className="space-y-3">
        {Object.entries(question.respostas).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onAnswer(key)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg t-btn text-left"
            style={{ minHeight: '56px' }}
          >
            {value.label || key}
          </button>
        ))}
      </div>
    );
  }

  if (question.tipo === 'informativo') {
    const nextKey = Object.keys(question.respostas)[0];
    return (
      <button
        onClick={() => onAnswer(nextKey)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg t-btn"
        style={{ minHeight: '56px' }}
      >
        Continuar
      </button>
    );
  }

  return null;
}
