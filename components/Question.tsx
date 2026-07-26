'use client';

import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Users,
  Church,
  GraduationCap,
  Eye,
  Ear,
  Brain,
  Activity,
  Heart,
  Wind,
  Bone,
  Scale,
  Thermometer,
  HelpCircle,
  Info,
} from 'lucide-react';
import type { Question as QuestionType } from '@/types/quiz';
import { AnswerButtons } from './AnswerButtons';
import { SwipeCard } from './motion/SwipeCard';
import { DURATION, EASE, DISTANCE, BLUR } from '@/lib/motion';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answerKey: string) => void;
  /** Which side the card slides in from. Going back must not look like going forward. */
  enterFrom?: 'left' | 'right';
  /** Reports drag position (-1..1) so the page can pick which lookahead to show. */
  onDragProgress?: (progress: number) => void;
}

// Map categories to icons
const getCategoryIcon = (questionId: string, categoria?: string) => {
  // Check categoria first
  if (categoria) {
    const iconMap: Record<string, React.ReactNode> = {
      visao: <Eye className="w-6 h-6" />,
      audicao: <Ear className="w-6 h-6" />,
      saude_mental: <Brain className="w-6 h-6" />,
      neurologico: <Activity className="w-6 h-6" />,
      cardiovascular: <Heart className="w-6 h-6" />,
      respiratorio: <Wind className="w-6 h-6" />,
      osteomuscular: <Bone className="w-6 h-6" />,
      altura_peso: <Scale className="w-6 h-6" />,
      infecciosas_cronicas: <Thermometer className="w-6 h-6" />,
      outras: <HelpCircle className="w-6 h-6" />,
    };
    if (iconMap[categoria]) return iconMap[categoria];
  }

  // Fallback to question ID patterns
  const id = questionId;

  // Demographics (P1-P4)
  if (id.match(/^P[1-4]$/)) return <User className="w-6 h-6" />;

  // Location (P5-P7)
  if (id.match(/^P[5-7]/)) return <MapPin className="w-6 h-6" />;

  // Family (P8)
  if (id.match(/^P8/)) return <Users className="w-6 h-6" />;

  // Religion (P9-P11)
  if (id.match(/^P(9|10|11)/)) return <Church className="w-6 h-6" />;

  // Education (P12-P14)
  if (id.match(/^P1[2-4]/)) return <GraduationCap className="w-6 h-6" />;

  // Medical categories by ID
  if (id.match(/^P15/)) return <Eye className="w-6 h-6" />;
  if (id.match(/^P20/)) return <Ear className="w-6 h-6" />;
  if (id.match(/^P25/)) return <Brain className="w-6 h-6" />;
  if (id.match(/^P30/)) return <Activity className="w-6 h-6" />;
  if (id.match(/^P35/)) return <Heart className="w-6 h-6" />;
  if (id.match(/^P40/)) return <Wind className="w-6 h-6" />;
  if (id.match(/^P45/)) return <Bone className="w-6 h-6" />;
  if (id.match(/^P50/)) return <Scale className="w-6 h-6" />;
  if (id.match(/^P55/)) return <Thermometer className="w-6 h-6" />;
  if (id.match(/^P60/) || id === 'RESULTADO_FINAL') return <HelpCircle className="w-6 h-6" />;
  if (id === 'AVISO_FASE_6') return <Info className="w-6 h-6" />;

  return <HelpCircle className="w-6 h-6" />;
};

/**
 * The card face. Also used to render the lookahead card behind the current
 * one, which is why it takes no handlers.
 */
export function QuestionFace({ question }: { question: QuestionType }) {
  const icon = getCategoryIcon(question.id, question.categoria);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex items-start gap-4">
        {/*
         * Icon swap: the icon cross-fades through blur when the category
         * changes, rather than cutting. Keyed on the icon identity so it only
         * replays when the category actually moves.
         */}
        <motion.div
          key={question.categoria ?? question.id}
          initial={{ opacity: 0, filter: `blur(${BLUR.small}px)` }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: DURATION.fast, ease: EASE.smoothOut }}
          className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"
        >
          {icon}
        </motion.div>
        <div className="flex-1 space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {question.pergunta}
          </h2>
          {question.explicacao && (
            <p className="text-gray-600 text-base whitespace-pre-line">
              {question.explicacao}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Variants are shared by every exit path so that tapping "Sim" and swiping
 * right produce the same motion. If the button faded while the swipe slid,
 * the user would be learning two languages for one action.
 *
 * `custom` carries the committed direction, supplied by AnimatePresence at
 * the moment the card is removed.
 */
const cardVariants = {
  enter: (enterFrom: 'left' | 'right') => ({
    opacity: 0,
    x: enterFrom === 'right' ? DISTANCE.base : -DISTANCE.base,
    filter: `blur(${BLUR.medium}px)`,
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION.fast, ease: EASE.smoothOut },
  },
  exit: (direction: 'left' | 'right' | 'neutral') => ({
    opacity: 0,
    x: direction === 'right' ? '140vw' : direction === 'left' ? '-140vw' : 0,
    filter: `blur(${BLUR.medium}px)`,
    transition: { duration: DURATION.fast, ease: EASE.smoothOut },
  }),
};

export function Question({
  question,
  onAnswer,
  enterFrom = 'right',
  onDragProgress,
}: QuestionProps) {
  return (
    <motion.div
      custom={enterFrom}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Bottom padding leaves room for the dock, which the page renders. */}
      <div className="p-4 md:p-6 pb-28 md:pb-6">
        <SwipeCard
          enabled={question.tipo === 'sim_nao'}
          leftLabel="NÃO"
          rightLabel="SIM"
          onCommit={(direction) => onAnswer(direction === 'right' ? 'sim' : 'nao')}
          onDragProgress={onDragProgress}
        >
          <QuestionFace question={question} />
        </SwipeCard>

        {/* Answer buttons - desktop only. Mobile gets the fixed dock instead. */}
        <div className="hidden md:block pt-6">
          <AnswerButtons question={question} onAnswer={onAnswer} />
        </div>
      </div>
    </motion.div>
  );
}
