import { describe, it, expect } from 'vitest';
import quizTree from '../data/quiz-tree.json';

const tree = quizTree as Record<string, any>;

/**
 * Pure-logic quiz engine for testing without React hooks.
 * Mirrors the logic in useQuizState.ts.
 */
interface EngineState {
  currentQuestionId: string | null;
  history: string[];
  answers: Map<string, string>;
  result: any | null;
}

function createEngine() {
  let state: EngineState = {
    currentQuestionId: 'P1',
    history: [],
    answers: new Map(),
    result: null,
  };

  return {
    getState: () => state,

    answer: (answerKey: string) => {
      const questionId = state.currentQuestionId;
      if (!questionId) throw new Error('Quiz already finished');

      const question = tree[questionId];
      if (!question) throw new Error(`Question ${questionId} not found`);

      const response = question.respostas[answerKey];
      if (!response) throw new Error(`Answer ${answerKey} not found for ${questionId}`);

      const newAnswers = new Map(state.answers);
      newAnswers.set(questionId, answerKey);
      const newHistory = [...state.history, questionId];

      if (response.resultado) {
        state = {
          currentQuestionId: null,
          history: newHistory,
          answers: newAnswers,
          result: response,
        };
      } else {
        state = {
          currentQuestionId: response.proximo || null,
          history: newHistory,
          answers: newAnswers,
          result: null,
        };
      }

      return state;
    },

    restart: () => {
      state = {
        currentQuestionId: 'P1',
        history: [],
        answers: new Map(),
        result: null,
      };
      return state;
    },
  };
}

describe('Quiz Engine', () => {
  describe('Initialization', () => {
    it('starts at P1', () => {
      const engine = createEngine();
      expect(engine.getState().currentQuestionId).toBe('P1');
    });

    it('starts with empty history', () => {
      const engine = createEngine();
      expect(engine.getState().history).toEqual([]);
    });

    it('starts with no result', () => {
      const engine = createEngine();
      expect(engine.getState().result).toBeNull();
    });
  });

  describe('Answering questions', () => {
    it('transitions to the next question on non-terminal answer', () => {
      const engine = createEngine();
      engine.answer('nao'); // P1: not a woman → P2
      expect(engine.getState().currentQuestionId).toBe('P2');
    });

    it('records answers', () => {
      const engine = createEngine();
      engine.answer('nao');
      expect(engine.getState().answers.get('P1')).toBe('nao');
    });

    it('adds to history', () => {
      const engine = createEngine();
      engine.answer('nao');
      expect(engine.getState().history).toEqual(['P1']);
    });

    it('reaches a terminal state with resultado', () => {
      const engine = createEngine();
      engine.answer('sim'); // P1: woman → FIM_DISPENSADA
      expect(engine.getState().result).not.toBeNull();
      expect(engine.getState().result.resultado).toBe('FIM_DISPENSADA');
      expect(engine.getState().currentQuestionId).toBeNull();
    });

    it('throws on answer after quiz is finished', () => {
      const engine = createEngine();
      engine.answer('sim'); // finish
      expect(() => engine.answer('sim')).toThrow('Quiz already finished');
    });

    it('throws on invalid answer key', () => {
      const engine = createEngine();
      expect(() => engine.answer('invalid')).toThrow();
    });
  });

  describe('Restart', () => {
    it('resets to initial state', () => {
      const engine = createEngine();
      engine.answer('nao');
      engine.answer('nao');
      engine.restart();

      const state = engine.getState();
      expect(state.currentQuestionId).toBe('P1');
      expect(state.history).toEqual([]);
      expect(state.answers.size).toBe(0);
      expect(state.result).toBeNull();
    });

    it('can restart after reaching a result', () => {
      const engine = createEngine();
      engine.answer('sim'); // FIM_DISPENSADA
      engine.restart();
      expect(engine.getState().currentQuestionId).toBe('P1');
      expect(engine.getState().result).toBeNull();
    });
  });

  describe('Multi-step traversal', () => {
    it('navigates through multiple questions', () => {
      const engine = createEngine();
      engine.answer('nao'); // P1 → P2
      engine.answer('nao'); // P2 → P3
      engine.answer('nao'); // P3 → P4
      engine.answer('nao'); // P4 → P5

      expect(engine.getState().currentQuestionId).toBe('P5');
      expect(engine.getState().history).toEqual(['P1', 'P2', 'P3', 'P4']);
      expect(engine.getState().answers.size).toBe(4);
    });
  });
});
