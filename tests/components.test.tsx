import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Question } from '../components/Question';
import { Result } from '../components/Result';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: any;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Question Component', () => {
  const simNaoQuestion = {
    id: 'P1',
    pergunta: 'Você é mulher cisgênero?',
    explicacao: 'Nasceu mulher e se identifica como mulher',
    tipo: 'sim_nao' as const,
    respostas: {
      sim: { resultado: 'FIM_DISPENSADA' as const },
      nao: { proximo: 'P2' },
    },
  };

  const selecaoQuestion = {
    id: 'P8_1',
    pergunta: 'Quem você sustenta?',
    explicacao: 'Selecione a opção que melhor descreve',
    tipo: 'selecao_unica' as const,
    respostas: {
      A: { resultado: 'FIM_DISPENSADO_ARRIMO' as const },
      B: { resultado: 'FIM_DISPENSADO_ARRIMO' as const },
      H: { proximo: 'P9' },
    },
  };

  const informativoQuestion = {
    id: 'AVISO_FASE_6',
    pergunta: 'Agora vamos verificar condições de saúde.',
    tipo: 'informativo' as const,
    respostas: {
      continuar: { proximo: 'P15' },
    },
  };

  describe('sim_nao type', () => {
    it('renders question text', () => {
      render(<Question question={simNaoQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText('Você é mulher cisgênero?')).toBeInTheDocument();
    });

    it('renders explanation', () => {
      render(<Question question={simNaoQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText('Nasceu mulher e se identifica como mulher')).toBeInTheDocument();
    });

    it('renders Sim and Não buttons', () => {
      render(<Question question={simNaoQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText('Sim')).toBeInTheDocument();
      expect(screen.getByText('Não')).toBeInTheDocument();
    });

    it('calls onAnswer with "sim" when Sim is clicked', () => {
      const onAnswer = vi.fn();
      render(<Question question={simNaoQuestion} onAnswer={onAnswer} />);
      fireEvent.click(screen.getByText('Sim'));
      expect(onAnswer).toHaveBeenCalledWith('sim');
    });

    it('calls onAnswer with "nao" when Não is clicked', () => {
      const onAnswer = vi.fn();
      render(<Question question={simNaoQuestion} onAnswer={onAnswer} />);
      fireEvent.click(screen.getByText('Não'));
      expect(onAnswer).toHaveBeenCalledWith('nao');
    });
  });

  describe('selecao_unica type', () => {
    it('renders all option buttons', () => {
      render(<Question question={selecaoQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('H')).toBeInTheDocument();
    });

    it('calls onAnswer with selected key', () => {
      const onAnswer = vi.fn();
      render(<Question question={selecaoQuestion} onAnswer={onAnswer} />);
      fireEvent.click(screen.getByText('A'));
      expect(onAnswer).toHaveBeenCalledWith('A');
    });
  });

  describe('informativo type', () => {
    it('renders Continuar button', () => {
      render(<Question question={informativoQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText('Continuar')).toBeInTheDocument();
    });

    it('calls onAnswer with first key on Continuar', () => {
      const onAnswer = vi.fn();
      render(<Question question={informativoQuestion} onAnswer={onAnswer} />);
      fireEvent.click(screen.getByText('Continuar'));
      expect(onAnswer).toHaveBeenCalledWith('continuar');
    });
  });

  describe('Back button', () => {
    it('shows back button when canGoBack is true', () => {
      render(
        <Question question={simNaoQuestion} onAnswer={vi.fn()} onBack={vi.fn()} canGoBack={true} />
      );
      expect(screen.getByText('← Voltar')).toBeInTheDocument();
    });

    it('does not show back button when canGoBack is false', () => {
      render(<Question question={simNaoQuestion} onAnswer={vi.fn()} canGoBack={false} />);
      expect(screen.queryByText('← Voltar')).not.toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', () => {
      const onBack = vi.fn();
      render(
        <Question question={simNaoQuestion} onAnswer={vi.fn()} onBack={onBack} canGoBack={true} />
      );
      fireEvent.click(screen.getByText('← Voltar'));
      expect(onBack).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('buttons have minimum 44px touch targets', () => {
      render(<Question question={simNaoQuestion} onAnswer={vi.fn()} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.style.minHeight).toBe('44px');
      });
    });
  });
});

describe('Result Component', () => {
  const dispensadaResult = {
    resultado: 'FIM_DISPENSADA' as const,
    razao: 'Mulheres não são obrigadas ao serviço militar em tempo de paz',
    base_legal: 'Art. 5º do Decreto 57.654/1966',
    tipo_dispensa: 'Isenção automática',
  };

  const fullResult = {
    resultado: 'FIM_OBJECAO_CONSCIENCIA' as const,
    razao: 'A Constituição garante o direito',
    base_legal: 'Art. 5º, VIII da Constituição Federal',
    tipo_dispensa: 'Dispensa por objeção de consciência',
    nota: 'Você deve declarar isso NO MOMENTO DO ALISTAMENTO',
    dica: 'Procure a organização LIVRES',
    instrucao: 'Declare no alistamento',
    alerta: 'Se negarem, procure um advogado',
  };

  it('renders result title', () => {
    render(<Result result={dispensadaResult} onRestart={vi.fn()} />);
    expect(screen.getByText('Você está dispensada!')).toBeInTheDocument();
  });

  it('renders razao', () => {
    render(<Result result={dispensadaResult} onRestart={vi.fn()} />);
    expect(
      screen.getByText('Mulheres não são obrigadas ao serviço militar em tempo de paz')
    ).toBeInTheDocument();
  });

  it('renders base_legal', () => {
    render(<Result result={dispensadaResult} onRestart={vi.fn()} />);
    expect(screen.getByText('Art. 5º do Decreto 57.654/1966')).toBeInTheDocument();
  });

  it('renders tipo_dispensa', () => {
    render(<Result result={dispensadaResult} onRestart={vi.fn()} />);
    expect(screen.getByText('Isenção automática')).toBeInTheDocument();
  });

  it('renders all optional fields when present', () => {
    render(<Result result={fullResult} onRestart={vi.fn()} />);
    expect(
      screen.getByText('Você deve declarar isso NO MOMENTO DO ALISTAMENTO')
    ).toBeInTheDocument();
    expect(screen.getByText('Procure a organização LIVRES')).toBeInTheDocument();
    expect(screen.getByText('Declare no alistamento')).toBeInTheDocument();
    expect(screen.getByText('Se negarem, procure um advogado')).toBeInTheDocument();
  });

  it('renders disclaimer', () => {
    render(<Result result={dispensadaResult} onRestart={vi.fn()} />);
    expect(screen.getByText(/fins informativos/)).toBeInTheDocument();
  });

  it('renders restart button', () => {
    render(<Result result={dispensadaResult} onRestart={vi.fn()} />);
    expect(screen.getByText('Fazer o Quiz Novamente')).toBeInTheDocument();
  });

  it('calls onRestart when restart button is clicked', () => {
    const onRestart = vi.fn();
    render(<Result result={dispensadaResult} onRestart={onRestart} />);
    fireEvent.click(screen.getByText('Fazer o Quiz Novamente'));
    expect(onRestart).toHaveBeenCalled();
  });

  it('result titles map correctly', () => {
    const titleMap: Record<string, string> = {
      FIM_DISPENSADA: 'Você está dispensada!',
      FIM_DISPENSADO: 'Você pode ser dispensado!',
      FIM_ISENTO_C: 'Você pode ser isento!',
      FIM_ADIAMENTO: 'Você pode adiar o serviço',
      FIM_EXCESSO_CONTINGENTE: 'Excesso de Contingente',
      FIM_OBJECAO_CONSCIENCIA: 'Objeção de Consciência',
      FIM_DISPENSADO_ARRIMO: 'Dispensa como Arrimo de Família',
      FIM_PROVAVELMENTE_ISENTO: 'Provável Isenção',
      DICA_PODE_DISPENSAR: 'Possível Dispensa',
      DICA_AVALIACAO_INDIVIDUAL: 'Avaliação Individual Necessária',
    };

    for (const [resultado, expectedTitle] of Object.entries(titleMap)) {
      const { unmount } = render(
        <Result
          result={{ resultado, razao: 'test', base_legal: 'test' }}
          onRestart={vi.fn()}
        />
      );
      expect(screen.getByText(expectedTitle)).toBeInTheDocument();
      unmount();
    }
  });
});
