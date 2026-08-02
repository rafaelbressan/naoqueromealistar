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
import { DURATION, EASE, EASE_KEYWORD, DISTANCE, BLUR, SWIPE } from '@/lib/motion';

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
 * The card face — a full-height surface, not a box that hugs its content.
 *
 * Every card is the same size on purpose. When each one sized itself to its
 * own text, the stack behind showed through unevenly and the blurred preview
 * read as a glitch rather than as depth; the drag surface also shrank to
 * whatever the question happened to be, so a one-line question left most of
 * the screen dead to the gesture.
 *
 * Three regions: a header that never moves, a body that scrolls when the
 * content is taller than the space, and a footer for the actions. The footer
 * is what makes the buttons travel with the card during a swipe — they used to
 * live in a fixed dock outside the animated subtree, which meant the card flew
 * away and left its own controls behind.
 *
 * Also used for the lookahead card behind the current one, which is why the
 * handlers arrive as rendered nodes rather than callbacks.
 */
export function QuestionFace({
  question,
  body,
  footer,
}: {
  question: QuestionType;
  /** Extra content inside the scrolling region, below the explanation. */
  body?: React.ReactNode;
  /** Pinned to the bottom of the card, always visible. */
  footer?: React.ReactNode;
}) {
  const icon = getCategoryIcon(question.id, question.categoria);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="flex flex-shrink-0 items-start gap-4 p-5 pb-4 md:p-8 md:pb-5">
        {/*
         * Icon swap: the icon cross-fades through blur when the category
         * changes, rather than cutting. Keyed on the icon identity so it only
         * replays when the category actually moves.
         */}
        <motion.div
          key={question.categoria ?? question.id}
          initial={{ opacity: 0, filter: `blur(${BLUR.small}px)` }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: DURATION.fast, ease: EASE_KEYWORD.inOut }}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"
        >
          {icon}
        </motion.div>
        <h2 className="flex-1 text-xl font-bold text-gray-900 md:text-2xl">
          {question.pergunta}
        </h2>
      </div>

      {/*
       * min-h-0 is load-bearing. A flex child defaults to min-height:auto,
       * which refuses to shrink below its content — the region would grow past
       * the card and push the footer off screen instead of scrolling.
       */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-4 md:px-8">
        {question.explicacao && (
          <p className="whitespace-pre-line text-base text-gray-600">
            {question.explicacao}
          </p>
        )}
        {body}
      </div>

      {footer && (
        <div className="flex-shrink-0 border-t border-gray-100 p-5 md:p-8 md:pt-5">
          {footer}
        </div>
      )}
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
    x:
      direction === 'right'
        ? `${SWIPE.exitX}vw`
        : direction === 'left'
          ? `-${SWIPE.exitX}vw`
          : 0,
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
  const canSwipe = question.tipo === 'sim_nao';

  /*
   * Where the controls sit depends only on how many there are.
   *
   * Two buttons (sim/não) or one ("Continuar") pin to the footer, always
   * visible — that is the Tinder shape, and for a swipeable question the
   * buttons and the gesture need to be reachable at the same moment.
   *
   * A `selecao_unica` can carry eight options (P8_1). Pinned, they would eat
   * the whole card and leave the question itself with nothing, so those ride
   * in the scrolling body instead.
   */
  const controls = <AnswerButtons question={question} onAnswer={onAnswer} />;
  const inFooter = question.tipo !== 'selecao_unica';

  return (
    <motion.div
      custom={enterFrom}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      /*
       * `relative z-[100]` keeps the live card above the lookahead. CardStack
       * sets perspective but leaves transform-style flat, so depth does not
       * decide paint order — z-index does, and the lookahead is an absolutely
       * positioned card at z-index 99. Without a layer of its own, this card is
       * an unpositioned block and paints underneath: the blurred preview would
       * cover the question being answered from the first pixel of the drag.
       */
      className="relative z-[100] mx-auto h-full w-full max-w-2xl"
    >
      <SwipeCard
        enabled={canSwipe}
        leftLabel="NÃO"
        rightLabel="SIM"
        onCommit={(direction) => onAnswer(direction === 'right' ? 'sim' : 'nao')}
        onDragProgress={onDragProgress}
      >
        <QuestionFace
          question={question}
          body={inFooter ? undefined : controls}
          footer={inFooter ? controls : undefined}
        />
      </SwipeCard>
    </motion.div>
  );
}
