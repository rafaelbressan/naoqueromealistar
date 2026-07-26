'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { QuestionResponse } from '@/types/quiz';

interface ResultProps {
  result: QuestionResponse;
  onRestart: () => void;
}

const getResultEmoji = (resultado: string) => {
  if (resultado.includes('DISPENSADA') || resultado.includes('DISPENSADO')) {
    return '🎉';
  }
  if (resultado.includes('ISENTO')) {
    return '✅';
  }
  if (resultado.includes('ADIAMENTO')) {
    return '⏸️';
  }
  if (resultado.includes('EXCESSO')) {
    return '📋';
  }
  if (resultado.includes('OBJECAO')) {
    return '✊';
  }
  if (resultado.includes('DICA')) {
    return '💡';
  }
  return '📝';
};

const getResultTitle = (resultado: string) => {
  const titles: Record<string, string> = {
    FIM_DISPENSADA: 'Você está dispensada!',
    FIM_DISPENSADO: 'Você pode ser dispensado!',
    FIM_ISENTO_C: 'Você pode ser isento!',
    FIM_ADIAMENTO: 'Você pode adiar o serviço',
    FIM_EXCESSO_CONTINGENTE: 'Excesso de Contingente',
    FIM_OBJECAO_CONSCIENCIA: 'Objeção de Consciência',
    FIM_DISPENSADO_ARRIMO: 'Dispensa como Arrimo de Família',
    FIM_PROVAVELMENTE_ISENTO: 'Provável Isenção',
    DICA_PODE_DISPENSAR: 'Possível Dispensa',
    DICA_AVALIACAO_INDIVIDUAL: 'Avaliação Individual Necessária',
  };

  return titles[resultado] || 'Resultado';
};

export function Result({ result, onRestart }: ResultProps) {
  const emoji = result.resultado ? getResultEmoji(result.resultado) : '📝';
  const title = result.resultado ? getResultTitle(result.resultado) : 'Resultado';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-6">
        {/* Result header */}
        <div className="text-center space-y-4">
          <div className="text-6xl">{emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h1>
        </div>

        {/* Reason */}
        {result.razao && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Por quê?</h3>
            <p className="text-blue-800">{result.razao}</p>
          </div>
        )}

        {/* Legal basis */}
        {result.base_legal && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Base Legal</h3>
            {result.link_legal ? (
              <a
                href={result.link_legal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-mono text-sm"
              >
                {result.base_legal} ↗
              </a>
            ) : (
              <p className="text-gray-700 font-mono text-sm">{result.base_legal}</p>
            )}
          </div>
        )}

        {/* Type of exemption */}
        {result.tipo_dispensa && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Tipo de Dispensa</h3>
            <p className="text-green-800">{result.tipo_dispensa}</p>
          </div>
        )}

        {/* Additional note */}
        {result.nota && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Importante</h3>
            <p className="text-yellow-800">{result.nota}</p>
          </div>
        )}

        {/* Tip */}
        {result.dica && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">💡 Dica</h3>
            <p className="text-purple-800">{result.dica}</p>
          </div>
        )}

        {/* Instructions */}
        {result.instrucao && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">📋 Instruções</h3>
            <p className="text-indigo-800">{result.instrucao}</p>
          </div>
        )}

        {/* Alert */}
        {result.alerta && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">🚨 Atenção</h3>
            <p className="text-red-800">{result.alerta}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="border-t pt-6 space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">Aviso Legal:</p>
            <p>
              Este quiz tem fins informativos e não substitui orientação jurídica profissional.
              As informações são baseadas na legislação vigente em Janeiro de 2025.
              Consulte um advogado ou a JSM local para casos específicos.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onRestart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg t-btn"
              style={{ minHeight: '44px' }}
            >
              Fazer o Quiz Novamente
            </button>
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-lg text-lg t-btn text-center"
              style={{ minHeight: '44px' }}
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
