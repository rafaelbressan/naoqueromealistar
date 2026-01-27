'use client';

import { motion } from 'framer-motion';
import type { Question as QuestionType } from '@/types/quiz';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answerKey: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function Question({ question, onAnswer, onBack, canGoBack }: QuestionProps) {
  const renderAnswerButtons = () => {
    if (question.tipo === 'sim_nao') {
      return (
        <div className="space-y-3">
          <button
            onClick={() => onAnswer('sim')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors active:scale-95 transform"
            style={{ minHeight: '44px' }}
          >
            Sim
          </button>
          <button
            onClick={() => onAnswer('nao')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors active:scale-95 transform"
            style={{ minHeight: '44px' }}
          >
            Não
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors text-left active:scale-95 transform"
              style={{ minHeight: '44px' }}
            >
              {key}
            </button>
          ))}
        </div>
      );
    }

    if (question.tipo === 'informativo') {
      // For informational screens, show a continue button
      const nextKey = Object.keys(question.respostas)[0];
      return (
        <button
          onClick={() => onAnswer(nextKey)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors active:scale-95 transform"
          style={{ minHeight: '44px' }}
        >
          Continuar
        </button>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-6">
        {/* Question text */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {question.pergunta}
          </h2>
          {question.explicacao && (
            <p className="text-gray-600 text-lg">
              {question.explicacao}
            </p>
          )}
        </div>

        {/* Answer buttons */}
        <div className="pt-4">
          {renderAnswerButtons()}
        </div>

        {/* Back button */}
        {canGoBack && onBack && (
          <div className="pt-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              style={{ minHeight: '44px' }}
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
