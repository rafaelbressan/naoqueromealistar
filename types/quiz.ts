export type ResultadoType =
  | 'FIM_DISPENSADA'              // Woman - exempt
  | 'FIM_DISPENSADO'              // Exempted from service
  | 'FIM_ISENTO_C'                // Permanently unfit (medical)
  | 'FIM_ADIAMENTO'               // Postponement
  | 'FIM_EXCESSO_CONTINGENTE'     // Surplus (over 30 years old)
  | 'FIM_OBJECAO_CONSCIENCIA'     // Conscientious objection
  | 'FIM_DISPENSADO_ARRIMO'       // Sole family provider
  | 'FIM_PROVAVELMENTE_ISENTO'    // Likely exempt (needs proof)
  | 'DICA_PODE_DISPENSAR'         // May be exempt (not guaranteed)
  | 'DICA_AVALIACAO_INDIVIDUAL';  // Case-by-case evaluation

export interface QuestionResponse {
  label?: string;
  resultado?: ResultadoType;
  proximo?: string;
  razao?: string;
  base_legal?: string;
  link_legal?: string;
  tipo_dispensa?: string;
  nota?: string;
  dica?: string;
  instrucao?: string;
  alerta?: string;
}

export interface Question {
  id: string;
  pergunta: string;
  explicacao?: string;
  tipo: 'sim_nao' | 'selecao_unica' | 'informativo';
  categoria?: string;
  respostas: {
    [key: string]: QuestionResponse;
  };
}

export interface QuizTree {
  [questionId: string]: Question;
}

/**
 * Which way the user last moved through the tree. Drives the direction of the
 * card transition: without it, going back animates identically to going
 * forward and the motion lies about the navigation.
 */
export type NavDirection = 'forward' | 'back';

export interface QuizState {
  currentQuestionId: string | null;
  history: string[];
  answers: Map<string, string>;
  result: QuestionResponse | null;
  lastDirection: NavDirection | null;
}

/**
 * Where an answer would lead, resolved without taking it.
 *
 * A discriminated union because plenty of yes/no nodes end the quiz outright
 * rather than pointing at another question — the lookahead card has to know
 * which of the two it is rendering.
 */
export type PeekResult =
  | { kind: 'question'; question: Question }
  | { kind: 'result'; result: QuestionResponse };
