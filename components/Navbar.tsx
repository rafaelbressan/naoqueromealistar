'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Menu, X, Home, FileText, HelpCircle } from 'lucide-react';
import { DURATION, EASE, EASE_KEYWORD, BLUR } from '@/lib/motion';

interface NavbarProps {
  title: string;
  canGoBack: boolean;
  onBack: () => void;
}

export function Navbar({ title, canGoBack, onBack }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Escape closes the drawer. Opening a panel with no keyboard way out is a
  // trap for anyone not using a pointer.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={onBack}
              disabled={!canGoBack}
              className={`p-2 rounded-lg t-btn-icon t-nudge-left ${
                canGoBack
                  ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Voltar"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Title */}
            <h1 className="text-lg font-semibold text-gray-900 truncate px-2">
              {title}
            </h1>

            {/*
             * Hamburger. Icon swap: Menu and X cross-fade through blur in the
             * same slot rather than cutting between frames.
             */}
            <button
              onClick={() => setIsDrawerOpen((open) => !open)}
              className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 t-btn-icon"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={isDrawerOpen ? 'Fechar menu' : 'Menu'}
              aria-expanded={isDrawerOpen}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={isDrawerOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, filter: `blur(${BLUR.small}px)` }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: `blur(${BLUR.small}px)` }}
                  transition={{ duration: DURATION.fast, ease: EASE_KEYWORD.inOut }}
                  className="block"
                >
                  {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/*
       * The backdrop used to be `{isDrawerOpen && <div/>}`, so it unmounted in
       * the same frame the drawer started closing — the panel slid out over
       * nothing for 300ms, and the black snapped in on open. AnimatePresence
       * keeps it alive through both directions.
       */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.medium, ease: EASE.smoothOut }}
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/*
       * Opening is slower than closing on purpose: opening presents the panel,
       * closing gets it out of the way.
       */}
      <div
        className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-40 transform"
        style={{
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transitionProperty: 'transform',
          transitionDuration: isDrawerOpen
            ? 'var(--duration-slow)'
            : 'var(--duration-medium)',
          transitionTimingFunction: 'var(--ease-smooth-out)',
        }}
        role="dialog"
        aria-modal={isDrawerOpen}
        aria-label="Menu"
        aria-hidden={!isDrawerOpen}
        inert={!isDrawerOpen}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 t-btn-icon"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer content */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 t-btn-icon"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 t-btn-icon"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  <span>Quiz</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 t-btn-icon"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>Sobre</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Drawer footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Não Quero Me Alistar
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
