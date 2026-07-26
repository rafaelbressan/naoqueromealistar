import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { peek, useQuizState } from '@/hooks/useQuizState';

/**
 * Covers the two additions the card stack depends on: resolving where an
 * answer leads without taking it, and knowing which way the user last moved.
 *
 * Imports the real implementation rather than the mirror engine in
 * quiz-engine.test.ts — a lookahead that disagrees with the traversal it
 * previews would be worse than no lookahead at all.
 */

describe('peek', () => {
  it('resolves a branch that leads to another question', () => {
    const result = peek('P15', 'sim');
    expect(result).toEqual({ kind: 'question', question: expect.objectContaining({ id: 'P15_1' }) });
  });

  it('resolves a branch that ends the quiz', () => {
    // Roughly half the yes/no nodes terminate rather than pointing onward,
    // which is why the return type is a union.
    const result = peek('P1', 'sim');
    expect(result?.kind).toBe('result');
    if (result?.kind === 'result') {
      expect(result.result.resultado).toBe('FIM_DISPENSADA');
    }
  });

  it('returns null for an unknown question', () => {
    expect(peek('NAO_EXISTE', 'sim')).toBeNull();
  });

  it('returns null for an unknown answer key', () => {
    expect(peek('P1', 'talvez')).toBeNull();
  });

  it('does not mutate quiz state', () => {
    const { result } = renderHook(() => useQuizState());

    act(() => {
      result.current.peek('P1', 'sim');
      result.current.peek('P1', 'nao');
    });

    expect(result.current.currentQuestionId).toBe('P1');
    expect(result.current.history).toEqual([]);
    expect(result.current.answers.size).toBe(0);
    expect(result.current.result).toBeNull();
  });
});

describe('lastDirection', () => {
  it('starts null', () => {
    const { result } = renderHook(() => useQuizState());
    expect(result.current.lastDirection).toBeNull();
  });

  it('is forward after answering', () => {
    const { result } = renderHook(() => useQuizState());
    act(() => result.current.handleAnswer('P1', 'nao'));
    expect(result.current.lastDirection).toBe('forward');
  });

  it('is back after going back', () => {
    const { result } = renderHook(() => useQuizState());
    act(() => result.current.handleAnswer('P1', 'nao'));
    act(() => result.current.goBack());
    expect(result.current.lastDirection).toBe('back');
  });

  it('is forward after landing on a result', () => {
    const { result } = renderHook(() => useQuizState());
    act(() => result.current.handleAnswer('P1', 'sim'));
    expect(result.current.result?.resultado).toBe('FIM_DISPENSADA');
    expect(result.current.lastDirection).toBe('forward');
  });

  it('resets to null on restart', () => {
    const { result } = renderHook(() => useQuizState());
    act(() => result.current.handleAnswer('P1', 'nao'));
    act(() => result.current.restart());
    expect(result.current.lastDirection).toBeNull();
  });
});
