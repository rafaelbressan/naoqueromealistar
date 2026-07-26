'use client';

import { useState, useCallback } from 'react';
import type { Question, QuestionResponse, QuizState, PeekResult } from '@/types/quiz';
import quizTreeData from '@/data/quiz-tree.json';

const quizTree = quizTreeData as Record<string, Question>;

/**
 * Resolve where an answer would lead without taking it.
 *
 * Pure over the tree, deliberately outside the hook: this feeds the lookahead
 * card behind the current one, which renders while the user is still dragging
 * and has not decided anything. Peeking must never touch history or answers.
 *
 * Returns null when the question or the answer key does not exist, which also
 * covers the branch that has neither `proximo` nor `resultado`.
 */
export function peek(questionId: string, answerKey: string): PeekResult | null {
  const response = quizTree[questionId]?.respostas[answerKey];
  if (!response) return null;

  if (response.resultado) return { kind: 'result', result: response };

  const next = response.proximo ? quizTree[response.proximo] : undefined;
  return next ? { kind: 'question', question: next } : null;
}

export function useQuizState() {
  const [state, setState] = useState<QuizState>({
    currentQuestionId: 'P1', // Start with first question
    history: [],
    answers: new Map(),
    result: null,
    lastDirection: null,
  });

  const currentQuestion = state.currentQuestionId
    ? quizTree[state.currentQuestionId]
    : null;

  const handleAnswer = useCallback((questionId: string, answerKey: string) => {
    const question = quizTree[questionId];
    if (!question) {
      console.error(`Question ${questionId} not found`);
      return;
    }

    const response = question.respostas[answerKey];
    if (!response) {
      console.error(`Answer ${answerKey} not found for question ${questionId}`);
      return;
    }

    setState(prevState => {
      // Record the answer
      const newAnswers = new Map(prevState.answers);
      newAnswers.set(questionId, answerKey);

      // Add to history
      const newHistory = [...prevState.history, questionId];

      // Check if this is a terminal state (has a result)
      if (response.resultado) {
        return {
          currentQuestionId: null,
          history: newHistory,
          answers: newAnswers,
          result: response,
          lastDirection: 'forward',
        };
      }

      // Otherwise, transition to next question
      return {
        currentQuestionId: response.proximo || null,
        history: newHistory,
        answers: newAnswers,
        result: null,
        lastDirection: 'forward',
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState(prevState => {
      if (prevState.history.length === 0) {
        return prevState; // Can't go back from start
      }

      const newHistory = [...prevState.history];
      const previousQuestionId = newHistory.pop(); // The question we're going back TO

      // Remove the answer for that question so user can re-answer
      const newAnswers = new Map(prevState.answers);
      if (previousQuestionId) {
        newAnswers.delete(previousQuestionId);
      }

      return {
        currentQuestionId: previousQuestionId || 'P1',
        history: newHistory,
        answers: newAnswers,
        result: null,
        lastDirection: 'back',
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState({
      currentQuestionId: 'P1',
      history: [],
      answers: new Map(),
      result: null,
      lastDirection: null,
    });
  }, []);

  const canGoBack = state.history.length > 0 && !state.result;

  return {
    currentQuestion,
    currentQuestionId: state.currentQuestionId,
    result: state.result,
    history: state.history,
    answers: state.answers,
    lastDirection: state.lastDirection,
    peek,
    handleAnswer,
    goBack,
    restart,
    canGoBack,
  };
}
