'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Menu, X, Home, FileText, HelpCircle } from 'lucide-react';

interface NavbarProps {
  title: string;
  canGoBack: boolean;
  onBack: () => void;
}

export function Navbar({ title, canGoBack, onBack }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
              className={`p-2 rounded-lg transition-colors ${
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

            {/* Hamburger menu */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  <span>Quiz</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
