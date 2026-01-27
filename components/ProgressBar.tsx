'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentQuestionId: string | null;
  totalAnswered: number;
}

const getPhaseInfo = (questionId: string | null) => {
  if (!questionId) return { phase: 6, phaseName: 'Concluído', totalPhases: 6 };

  const id = questionId;

  // Phase 1: Demographics (P1-P4)
  if (id.match(/^P[1-4]$/)) {
    return { phase: 1, phaseName: 'Dados Básicos', totalPhases: 6 };
  }

  // Phase 2: Location (P5-P7)
  if (id.match(/^P[5-7]/)) {
    return { phase: 2, phaseName: 'Localização', totalPhases: 6 };
  }

  // Phase 3: Family (P8)
  if (id.match(/^P8/)) {
    return { phase: 3, phaseName: 'Família', totalPhases: 6 };
  }

  // Phase 4: Religion/Conscience (P9-P11)
  if (id.match(/^P(9|10|11)/)) {
    return { phase: 4, phaseName: 'Religião/Consciência', totalPhases: 6 };
  }

  // Phase 5: Education (P12-P14)
  if (id.match(/^P1[2-4]/)) {
    return { phase: 5, phaseName: 'Educação', totalPhases: 6 };
  }

  // Phase 6: Medical (P15+)
  if (id.match(/^P[1-9][5-9]/) || id.match(/^P[2-9][0-9]/)) {
    return { phase: 6, phaseName: 'Saúde', totalPhases: 6 };
  }

  return { phase: 1, phaseName: 'Quiz', totalPhases: 6 };
};

export function ProgressBar({ currentQuestionId, totalAnswered }: ProgressBarProps) {
  const { phase, phaseName, totalPhases } = getPhaseInfo(currentQuestionId);
  const progress = (phase / totalPhases) * 100;

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Fase {phase} de {totalPhases}: {phaseName}
          </span>
          <span className="text-sm text-gray-500">
            {totalAnswered} {totalAnswered === 1 ? 'resposta' : 'respostas'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-blue-600 h-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
