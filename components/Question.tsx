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

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answerKey: string) => void;
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

export function Question({ question, onAnswer }: QuestionProps) {
  const icon = getCategoryIcon(question.id, question.categoria);

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
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Content area with padding for bottom dock on mobile */}
        <div className="p-4 md:p-6 pb-28 md:pb-6">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {/* Question header with icon */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {icon}
              </div>
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

            {/* Answer buttons - desktop only */}
            <div className="hidden md:block pt-6">
              {renderAnswerButtons()}
            </div>
          </div>
        </div>
      </motion.div>

      {/*
        Fixed bottom dock on mobile. Deliberately a sibling of the animated
        motion.div, not a child: a transformed ancestor becomes the containing
        block for position:fixed descendants, so nesting it would make the dock
        slide with the question and snap back when the transform is removed.
      */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {renderAnswerButtons()}
      </div>
    </>
  );
}
