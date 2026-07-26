'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { DURATION, EASE, EASE_KEYWORD, DISTANCE, BLUR } from '@/lib/motion';

interface ProgressBarProps {
  currentQuestionId: string | null;
  totalAnswered: number;
}

export const getPhaseInfo = (questionId: string | null) => {
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
    return { phase: 4, phaseName: 'Religião', totalPhases: 6 };
  }

  // Phase 5: Education (P12-P14)
  if (id.match(/^P1[2-4]/)) {
    return { phase: 5, phaseName: 'Educação', totalPhases: 6 };
  }

  // Phase 6: Medical (P15+) - with subcategories
  if (id.match(/^P15/)) {
    return { phase: 6, phaseName: 'Visão', totalPhases: 6 };
  }
  if (id.match(/^P20/)) {
    return { phase: 6, phaseName: 'Audição', totalPhases: 6 };
  }
  if (id.match(/^P25/)) {
    return { phase: 6, phaseName: 'Saúde Mental', totalPhases: 6 };
  }
  if (id.match(/^P30/)) {
    return { phase: 6, phaseName: 'Neurológico', totalPhases: 6 };
  }
  if (id.match(/^P35/)) {
    return { phase: 6, phaseName: 'Cardiovascular', totalPhases: 6 };
  }
  if (id.match(/^P40/)) {
    return { phase: 6, phaseName: 'Respiratório', totalPhases: 6 };
  }
  if (id.match(/^P45/)) {
    return { phase: 6, phaseName: 'Osteomuscular', totalPhases: 6 };
  }
  if (id.match(/^P50/)) {
    return { phase: 6, phaseName: 'Altura/Peso', totalPhases: 6 };
  }
  if (id.match(/^P55/)) {
    return { phase: 6, phaseName: 'Doenças Crônicas', totalPhases: 6 };
  }
  if (id.match(/^P60/) || id === 'RESULTADO_FINAL') {
    return { phase: 6, phaseName: 'Outras Condições', totalPhases: 6 };
  }
  if (id === 'AVISO_FASE_6') {
    return { phase: 6, phaseName: 'Saúde', totalPhases: 6 };
  }

  return { phase: 1, phaseName: 'Quiz', totalPhases: 6 };
};

export function ProgressBar({ currentQuestionId, totalAnswered }: ProgressBarProps) {
  const { phase, totalPhases } = getPhaseInfo(currentQuestionId);
  const progress = (phase / totalPhases) * 100;

  return (
    <div className="bg-white border-b border-gray-100 z-10">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">
            Fase {phase} de {totalPhases}
          </span>
          {/*
           * Number pop-in. The count has to be keyed so React replaces the
           * node instead of reusing it — reuse means the text swaps silently
           * and nothing animates.
           */}
          <span className="text-xs text-gray-400 relative inline-flex overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={totalAnswered}
                initial={{ opacity: 0, y: DISTANCE.micro, filter: `blur(${BLUR.small}px)` }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -DISTANCE.micro, filter: `blur(${BLUR.small}px)` }}
                transition={{ duration: DURATION.quick, ease: EASE_KEYWORD.inOut }}
              >
                {totalAnswered}
              </motion.span>
            </AnimatePresence>
            <span>&nbsp;{totalAnswered === 1 ? 'resposta' : 'respostas'}</span>
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: DURATION.slow, ease: EASE.smoothOut }}
            className="bg-blue-600 h-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
