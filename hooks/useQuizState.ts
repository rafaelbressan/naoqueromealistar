'use client';

import { useState, useCallback } from 'react';
import type { Question, QuestionResponse, QuizState } from '@/types/quiz';
import quizTreeData from '@/data/quiz-tree.json';

const quizTree = quizTreeData as Record<string, Question>;

export function useQuizState() {
  const [state, setState] = useState<QuizState>({
    currentQuestionId: 'P1', // Start with first question
    history: [],
    answers: new Map(),
    result: null,
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
        };
      }

      // Otherwise, transition to next question
      return {
        currentQuestionId: response.proximo || null,
        history: newHistory,
        answers: newAnswers,
        result: null,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState(prevState => {
      if (prevState.history.length === 0) {
        return prevState; // Can't go back from start
      }

      const newHistory = [...prevState.history];
      const previousQuestionId = newHistory.pop();

      // Remove the answer for the current question
      const newAnswers = new Map(prevState.answers);
      if (previousQuestionId) {
        newAnswers.delete(previousQuestionId);
      }

      // Determine what the current question should be
      const currentQuestionId = newHistory.length > 0
        ? newHistory[newHistory.length - 1]
        : 'P1';

      return {
        currentQuestionId,
        history: newHistory.slice(0, -1), // Remove one more since we're going back
        answers: newAnswers,
        result: null,
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState({
      currentQuestionId: 'P1',
      history: [],
      answers: new Map(),
      result: null,
    });
  }, []);

  const canGoBack = state.history.length > 0 && !state.result;

  return {
    currentQuestion,
    currentQuestionId: state.currentQuestionId,
    result: state.result,
    history: state.history,
    answers: state.answers,
    handleAnswer,
    goBack,
    restart,
    canGoBack,
  };
}
