'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { DURATION, EASE_KEYWORD, DISTANCE, BLUR } from "@/lib/motion";

/**
 * Texts reveal: stacked lines enter with rhythm rather than all at once.
 *
 * Nothing more than that here. The landing is a bridge to the quiz, not the
 * product, and motion that draws attention to itself on the way in would be
 * working against that.
 */
const pageVariants = {
  hidden: {},
  shown: { transition: { staggerChildren: DURATION.stagger } },
};

const lineVariants = {
  hidden: { opacity: 0, y: DISTANCE.medium, filter: `blur(${BLUR.medium}px)` },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.fast, ease: EASE_KEYWORD.inOut },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="shown"
        className="max-w-2xl w-full text-center space-y-8"
      >
        <motion.h1
          variants={lineVariants}
          className="text-4xl md:text-6xl font-bold text-gray-900"
        >
          Não Quero Me Alistar
        </motion.h1>

        <motion.p
          variants={lineVariants}
          className="text-xl md:text-2xl text-gray-700"
        >
          Descubra se você tem direito legal à dispensa do serviço militar
        </motion.p>

        <motion.div variants={lineVariants} className="space-y-4">
          <p className="text-gray-600">
            Responda algumas perguntas e descubra se você se encaixa em alguma das categorias de dispensa previstas na lei brasileira.
          </p>

          <Link
            href="/quiz"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg t-btn"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            Começar Quiz
          </Link>
        </motion.div>

        <motion.div
          variants={lineVariants}
          className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-left"
        >
          <p className="font-semibold text-yellow-900 mb-2">⚠️ Aviso Legal</p>
          <p className="text-yellow-800">
            Este quiz tem fins informativos e não substitui orientação jurídica profissional.
            As informações são baseadas na legislação vigente em Janeiro de 2025.
            Consulte um advogado ou a JSM local para casos específicos.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
