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
        <div className="flex gap-3">
          <button
            onClick={() => onAnswer('sim')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors active:scale-95 transform"
            style={{ minHeight: '56px' }}
          >
            Sim
          </button>
          <button
            onClick={() => onAnswer('nao')}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors active:scale-95 transform"
            style={{ minHeight: '56px' }}
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors active:scale-95 transform"
          style={{ minHeight: '56px' }}
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
      className="w-full max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-120px)] md:min-h-0 md:block"
    >
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-6 pb-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Question text */}
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {question.pergunta}
            </h2>
            {question.explicacao && (
              <p className="text-gray-600 text-lg whitespace-pre-line">
                {question.explicacao}
              </p>
            )}
          </div>

          {/* Back button - inside card on desktop */}
          <div className="hidden md:block pt-6">
            {canGoBack && onBack && (
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                style={{ minHeight: '44px' }}
              >
                ← Voltar
              </button>
            )}
          </div>

          {/* Answer buttons - inside card on desktop */}
          <div className="hidden md:block pt-6">
            {renderAnswerButtons()}
          </div>
        </div>
      </div>

      {/* Fixed bottom dock on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3 shadow-lg">
        {renderAnswerButtons()}
        {canGoBack && onBack && (
          <button
            onClick={onBack}
            className="w-full text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
            style={{ minHeight: '44px' }}
          >
            ← Voltar
          </button>
        )}
      </div>
    </motion.div>
  );
}
