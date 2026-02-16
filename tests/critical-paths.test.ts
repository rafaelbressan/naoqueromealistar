import { describe, it, expect } from 'vitest';
import quizTree from '../data/quiz-tree.json';

const tree = quizTree as Record<string, any>;

/**
 * Simulates a full path through the quiz given a sequence of answers.
 * Returns the final result or the current question if the path doesn't terminate.
 */
function walkPath(answers: Array<{ questionId: string; answer: string }>) {
  let currentId: string | null = 'P1';
  const history: string[] = [];

  for (const { questionId, answer } of answers) {
    if (currentId !== questionId) {
      throw new Error(
        `Expected to be at ${questionId} but at ${currentId}. History: ${history.join(' → ')}`
      );
    }

    const question = tree[currentId];
    if (!question) throw new Error(`Question ${currentId} not found`);

    const response = question.respostas[answer];
    if (!response) throw new Error(`Answer "${answer}" not found for ${currentId}`);

    history.push(currentId);

    if (response.resultado) {
      return { result: response, history, terminated: true };
    }

    currentId = response.proximo || null;
  }

  return { currentId, history, terminated: false };
}

describe('Critical Paths', () => {
  describe('Phase 1: Demographics - short circuits', () => {
    it('P1: Woman → FIM_DISPENSADA (1 question)', () => {
      const { result } = walkPath([{ questionId: 'P1', answer: 'sim' }]);
      expect(result.resultado).toBe('FIM_DISPENSADA');
      expect(result.base_legal).toContain('Art. 5');
    });

    it('P2: Trans woman → FIM_DISPENSADA', () => {
      const { result } = walkPath([
        { questionId: 'P1', answer: 'nao' },
        { questionId: 'P2', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_DISPENSADA');
      expect(result.base_legal).toContain('Portaria 326');
    });

    it('P3: Trans man → FIM_DISPENSADO', () => {
      const { result } = walkPath([
        { questionId: 'P1', answer: 'nao' },
        { questionId: 'P2', answer: 'nao' },
        { questionId: 'P3', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_DISPENSADO');
    });

    it('P4: Over 30 → FIM_EXCESSO_CONTINGENTE', () => {
      const { result } = walkPath([
        { questionId: 'P1', answer: 'nao' },
        { questionId: 'P2', answer: 'nao' },
        { questionId: 'P3', answer: 'nao' },
        { questionId: 'P4', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_EXCESSO_CONTINGENTE');
      expect(result.base_legal).toContain('Art. 93');
    });
  });

  describe('Phase 2: Location', () => {
    const skipDemographics = [
      { questionId: 'P1', answer: 'nao' },
      { questionId: 'P2', answer: 'nao' },
      { questionId: 'P3', answer: 'nao' },
      { questionId: 'P4', answer: 'nao' },
    ];

    it('P5: Living abroad → FIM_ADIAMENTO', () => {
      const { result } = walkPath([...skipDemographics, { questionId: 'P5', answer: 'sim' }]);
      expect(result.resultado).toBe('FIM_ADIAMENTO');
      expect(result.base_legal).toContain('Art. 96');
    });

    it('P6 → P6_1: Small town resident > 1 year → FIM_DISPENSADO', () => {
      const { result } = walkPath([
        ...skipDemographics,
        { questionId: 'P5', answer: 'nao' },
        { questionId: 'P6', answer: 'sim' },
        { questionId: 'P6_1', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_DISPENSADO');
      expect(result.base_legal).toContain('Art. 105');
    });

    it('P7 → P7_1: Rural resident > 1 year → FIM_DISPENSADO', () => {
      const { result } = walkPath([
        ...skipDemographics,
        { questionId: 'P5', answer: 'nao' },
        { questionId: 'P6', answer: 'nao' },
        { questionId: 'P7', answer: 'sim' },
        { questionId: 'P7_1', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_DISPENSADO');
    });
  });

  describe('Phase 3: Family', () => {
    const skipToP8 = [
      { questionId: 'P1', answer: 'nao' },
      { questionId: 'P2', answer: 'nao' },
      { questionId: 'P3', answer: 'nao' },
      { questionId: 'P4', answer: 'nao' },
      { questionId: 'P5', answer: 'nao' },
      { questionId: 'P6', answer: 'nao' },
      { questionId: 'P7', answer: 'nao' },
    ];

    it('P8 → P8_1: Sole provider (option A) → FIM_DISPENSADO_ARRIMO', () => {
      const { result } = walkPath([
        ...skipToP8,
        { questionId: 'P8', answer: 'sim' },
        { questionId: 'P8_1', answer: 'A' },
      ]);
      expect(result.resultado).toBe('FIM_DISPENSADO_ARRIMO');
      expect(result.base_legal).toContain('Art. 105');
    });

    it('P8_1: All family provider options (A-G) yield FIM_DISPENSADO_ARRIMO', () => {
      for (const option of ['A', 'B', 'C', 'D', 'E', 'F', 'G']) {
        const { result } = walkPath([
          ...skipToP8,
          { questionId: 'P8', answer: 'sim' },
          { questionId: 'P8_1', answer: option },
        ]);
        expect(result.resultado, `Option ${option}`).toBe('FIM_DISPENSADO_ARRIMO');
      }
    });

    it('P8_1: Option H → continues to P9', () => {
      const { currentId, terminated } = walkPath([
        ...skipToP8,
        { questionId: 'P8', answer: 'sim' },
        { questionId: 'P8_1', answer: 'H' },
      ]);
      expect(terminated).toBe(false);
      expect(currentId).toBe('P9');
    });
  });

  describe('Phase 4: Religion/Conscience', () => {
    const skipToP9 = [
      { questionId: 'P1', answer: 'nao' },
      { questionId: 'P2', answer: 'nao' },
      { questionId: 'P3', answer: 'nao' },
      { questionId: 'P4', answer: 'nao' },
      { questionId: 'P5', answer: 'nao' },
      { questionId: 'P6', answer: 'nao' },
      { questionId: 'P7', answer: 'nao' },
      { questionId: 'P8', answer: 'nao' },
    ];

    it('P9: Ordained minister → FIM_DISPENSADO', () => {
      const { result } = walkPath([...skipToP9, { questionId: 'P9', answer: 'sim' }]);
      expect(result.resultado).toBe('FIM_DISPENSADO');
      expect(result.base_legal).toContain('Art. 98');
    });

    it('P10: Seminary student → FIM_ADIAMENTO', () => {
      const { result } = walkPath([
        ...skipToP9,
        { questionId: 'P9', answer: 'nao' },
        { questionId: 'P10', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_ADIAMENTO');
    });

    it('P11 → P11_1: Conscientious objector with proof → FIM_OBJECAO_CONSCIENCIA', () => {
      const { result } = walkPath([
        ...skipToP9,
        { questionId: 'P9', answer: 'nao' },
        { questionId: 'P10', answer: 'nao' },
        { questionId: 'P11', answer: 'sim' },
        { questionId: 'P11_1', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_OBJECAO_CONSCIENCIA');
      expect(result.base_legal).toContain('Constituição Federal');
    });

    it('P11_2: Verbal objection continues quiz → P12', () => {
      const { currentId, terminated } = walkPath([
        ...skipToP9,
        { questionId: 'P9', answer: 'nao' },
        { questionId: 'P10', answer: 'nao' },
        { questionId: 'P11', answer: 'sim' },
        { questionId: 'P11_1', answer: 'nao' },
        { questionId: 'P11_2', answer: 'sim' },
      ]);
      expect(terminated).toBe(false);
      expect(currentId).toBe('P12');
    });
  });

  describe('Phase 5: Education', () => {
    const skipToP12 = [
      { questionId: 'P1', answer: 'nao' },
      { questionId: 'P2', answer: 'nao' },
      { questionId: 'P3', answer: 'nao' },
      { questionId: 'P4', answer: 'nao' },
      { questionId: 'P5', answer: 'nao' },
      { questionId: 'P6', answer: 'nao' },
      { questionId: 'P7', answer: 'nao' },
      { questionId: 'P8', answer: 'nao' },
      { questionId: 'P9', answer: 'nao' },
      { questionId: 'P10', answer: 'nao' },
      { questionId: 'P11', answer: 'nao' },
    ];

    it('P12: Med student → FIM_ADIAMENTO', () => {
      const { result } = walkPath([...skipToP12, { questionId: 'P12', answer: 'sim' }]);
      expect(result.resultado).toBe('FIM_ADIAMENTO');
      expect(result.alerta).toBeTruthy(); // should warn about MFDV
    });

    it('P13: CPOR/NPOR → FIM_DISPENSADO', () => {
      const { result } = walkPath([
        ...skipToP12,
        { questionId: 'P12', answer: 'nao' },
        { questionId: 'P13', answer: 'CPOR_NPOR' },
      ]);
      expect(result.resultado).toBe('FIM_DISPENSADO');
    });

    it('P14: Strategic company → FIM_DISPENSADO', () => {
      const { result } = walkPath([
        ...skipToP12,
        { questionId: 'P12', answer: 'nao' },
        { questionId: 'P13', answer: 'NENHUM' },
        { questionId: 'P14', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_DISPENSADO');
    });
  });

  describe('Phase 6: Medical - Vision path', () => {
    const skipToP15 = [
      { questionId: 'P1', answer: 'nao' },
      { questionId: 'P2', answer: 'nao' },
      { questionId: 'P3', answer: 'nao' },
      { questionId: 'P4', answer: 'nao' },
      { questionId: 'P5', answer: 'nao' },
      { questionId: 'P6', answer: 'nao' },
      { questionId: 'P7', answer: 'nao' },
      { questionId: 'P8', answer: 'nao' },
      { questionId: 'P9', answer: 'nao' },
      { questionId: 'P10', answer: 'nao' },
      { questionId: 'P11', answer: 'nao' },
      { questionId: 'P12', answer: 'nao' },
      { questionId: 'P13', answer: 'NENHUM' },
      { questionId: 'P14', answer: 'nao' },
    ];

    it('P15_1: Total blindness → FIM_ISENTO_C', () => {
      const { result } = walkPath([
        ...skipToP15,
        { questionId: 'P15', answer: 'sim' },
        { questionId: 'P15_1', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_ISENTO_C');
    });

    it('P15_3: High myopia → FIM_ISENTO_C', () => {
      const { result } = walkPath([
        ...skipToP15,
        { questionId: 'P15', answer: 'sim' },
        { questionId: 'P15_1', answer: 'nao' },
        { questionId: 'P15_2', answer: 'nao' },
        { questionId: 'P15_3', answer: 'sim' },
      ]);
      expect(result.resultado).toBe('FIM_ISENTO_C');
    });

    it('P15: No vision problems → skips to P20 (hearing)', () => {
      const { currentId, terminated } = walkPath([
        ...skipToP15,
        { questionId: 'P15', answer: 'nao' },
      ]);
      expect(terminated).toBe(false);
      expect(currentId).toBe('P20');
    });
  });

  describe('Full healthy path - reaches RESULTADO_FINAL', () => {
    it('answering "nao" to everything reaches RESULTADO_FINAL', () => {
      let currentId: string | null = 'P1';
      const visited = new Set<string>();
      let steps = 0;
      const maxSteps = 100;

      while (currentId && steps < maxSteps) {
        const question = tree[currentId];
        if (!question) break;
        if (question.tipo === 'resultado') break;

        visited.add(currentId);
        steps++;

        // For selecao_unica, pick the option that continues (no resultado)
        let answerKey = 'nao';
        if (question.tipo === 'selecao_unica') {
          const continuingKey = Object.entries(question.respostas).find(
            ([, resp]: [string, any]) => resp.proximo && !resp.resultado
          );
          answerKey = continuingKey ? continuingKey[0] : Object.keys(question.respostas)[0];
        } else if (question.tipo === 'informativo') {
          answerKey = Object.keys(question.respostas)[0];
        }

        const response = question.respostas[answerKey];
        if (!response) break;

        if (response.resultado) {
          // Shouldn't happen on 'nao' answers in the healthy path
          break;
        }

        currentId = response.proximo || null;
      }

      expect(currentId).toBe('RESULTADO_FINAL');
      expect(steps).toBeLessThan(maxSteps);
    });
  });
});
