import { describe, it, expect } from 'vitest';
import quizTree from '../data/quiz-tree.json';

const tree = quizTree as Record<string, any>;

describe('Quiz Tree Validation', () => {
  describe('Structure integrity', () => {
    it('starts with P1', () => {
      expect(tree['P1']).toBeDefined();
    });

    it('every question has required fields', () => {
      for (const [id, question] of Object.entries(tree)) {
        expect(question.id, `${id} missing id`).toBe(id);
        expect(question.pergunta, `${id} missing pergunta`).toBeTruthy();
        expect(question.tipo, `${id} missing tipo`).toBeTruthy();
        expect(question.respostas, `${id} missing respostas`).toBeDefined();
      }
    });

    it('every question tipo is a known type', () => {
      const validTypes = ['sim_nao', 'selecao_unica', 'informativo', 'resultado'];
      for (const [id, question] of Object.entries(tree)) {
        expect(validTypes, `${id} has unknown tipo: ${question.tipo}`).toContain(
          question.tipo
        );
      }
    });

    it('sim_nao questions have sim and nao responses', () => {
      for (const [id, question] of Object.entries(tree)) {
        if (question.tipo === 'sim_nao') {
          expect(question.respostas.sim, `${id} missing 'sim' response`).toBeDefined();
          expect(question.respostas.nao, `${id} missing 'nao' response`).toBeDefined();
        }
      }
    });
  });

  describe('Reachability - no orphaned questions', () => {
    it('all questions are reachable from P1', () => {
      const reachable = new Set<string>();

      const traverse = (id: string) => {
        if (reachable.has(id)) return;
        reachable.add(id);

        const question = tree[id];
        if (!question) return;

        for (const response of Object.values(question.respostas) as any[]) {
          if (response.proximo) {
            traverse(response.proximo);
          }
        }
      };

      traverse('P1');

      const allQuestions = Object.keys(tree);
      const orphans = allQuestions.filter((q) => !reachable.has(q));

      // AVISO_FASE_6 is an informational screen that may be unreachable
      // from the main flow (it's an alternate entry point for phase 6)
      const allowedOrphans = ['AVISO_FASE_6'];
      const realOrphans = orphans.filter((q) => !allowedOrphans.includes(q));

      expect(realOrphans, `Orphaned questions: ${realOrphans.join(', ')}`).toEqual([]);
    });
  });

  describe('No broken links', () => {
    it('every proximo reference points to an existing question', () => {
      const allIds = new Set(Object.keys(tree));

      for (const [id, question] of Object.entries(tree)) {
        for (const [answerKey, response] of Object.entries(
          question.respostas as Record<string, any>
        )) {
          if (response.proximo) {
            expect(
              allIds.has(response.proximo),
              `${id} -> ${answerKey} references non-existent question: ${response.proximo}`
            ).toBe(true);
          }
        }
      }
    });
  });

  describe('No infinite loops', () => {
    it('no question can eventually lead back to itself', () => {
      const checkForCycles = (startId: string) => {
        const visited = new Set<string>();
        const stack = new Set<string>();

        const dfs = (id: string): boolean => {
          if (stack.has(id)) return true; // cycle detected
          if (visited.has(id)) return false;

          visited.add(id);
          stack.add(id);

          const question = tree[id];
          if (!question) {
            stack.delete(id);
            return false;
          }

          for (const response of Object.values(question.respostas) as any[]) {
            if (response.proximo && dfs(response.proximo)) {
              return true;
            }
          }

          stack.delete(id);
          return false;
        };

        return dfs(startId);
      };

      expect(checkForCycles('P1'), 'Cycle detected in quiz tree').toBe(false);
    });
  });

  describe('Terminal nodes have legal basis', () => {
    it('every result with resultado has base_legal', () => {
      const missing: string[] = [];

      for (const [id, question] of Object.entries(tree)) {
        for (const [answerKey, response] of Object.entries(
          question.respostas as Record<string, any>
        )) {
          if (response.resultado && !response.base_legal) {
            missing.push(`${id}[${answerKey}] has resultado=${response.resultado} but no base_legal`);
          }
        }
      }

      expect(missing, missing.join('\n')).toEqual([]);
    });

    it('every result with resultado has razao', () => {
      const missing: string[] = [];

      for (const [id, question] of Object.entries(tree)) {
        for (const [answerKey, response] of Object.entries(
          question.respostas as Record<string, any>
        )) {
          if (response.resultado && !response.razao) {
            missing.push(`${id}[${answerKey}] has resultado=${response.resultado} but no razao`);
          }
        }
      }

      expect(missing, missing.join('\n')).toEqual([]);
    });
  });

  describe('Every non-terminal response leads somewhere', () => {
    it('every response has either resultado or proximo', () => {
      const broken: string[] = [];

      for (const [id, question] of Object.entries(tree)) {
        // Skip RESULTADO_FINAL which has empty respostas
        if (question.tipo === 'resultado') continue;

        for (const [answerKey, response] of Object.entries(
          question.respostas as Record<string, any>
        )) {
          if (!response.resultado && !response.proximo) {
            broken.push(`${id}[${answerKey}] has neither resultado nor proximo`);
          }
        }
      }

      expect(broken, broken.join('\n')).toEqual([]);
    });
  });

  describe('Result types are valid', () => {
    it('all resultado values are known types', () => {
      const validResults = [
        'FIM_DISPENSADA',
        'FIM_DISPENSADO',
        'FIM_ISENTO_C',
        'FIM_ADIAMENTO',
        'FIM_EXCESSO_CONTINGENTE',
        'FIM_OBJECAO_CONSCIENCIA',
        'FIM_DISPENSADO_ARRIMO',
        'FIM_PROVAVELMENTE_ISENTO',
        'DICA_PODE_DISPENSAR',
        'DICA_AVALIACAO_INDIVIDUAL',
      ];

      for (const [id, question] of Object.entries(tree)) {
        for (const [answerKey, response] of Object.entries(
          question.respostas as Record<string, any>
        )) {
          if (response.resultado) {
            expect(
              validResults,
              `${id}[${answerKey}] has unknown resultado: ${response.resultado}`
            ).toContain(response.resultado);
          }
        }
      }
    });
  });

  describe('Question count', () => {
    it('has at least 50 questions', () => {
      expect(Object.keys(tree).length).toBeGreaterThanOrEqual(50);
    });
  });
});
