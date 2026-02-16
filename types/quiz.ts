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

export interface QuizState {
  currentQuestionId: string | null;
  history: string[];
  answers: Map<string, string>;
  result: QuestionResponse | null;
}
