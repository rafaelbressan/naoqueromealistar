# CONTEXTO DO PROJETO - Quiz de Dispensa do Serviço Militar

## Visão Geral do Projeto

### O que é
Um quiz interativo e divertido que ajuda jovens brasileiros (17-18 anos, prestes a se alistar) a descobrir se são elegíveis para dispensa do serviço militar obrigatório.

### Problema que resolve
- Pessoas QUEREM encontrar uma forma legal de não servir, mas não conhecem seus direitos
- A legislação é confusa e espalhada em vários decretos
- Muitos jovens dependem de "sorte" quando poderiam ter dispensa garantida
- Falta de informação sobre objeção de consciência, condições médicas, etc.

### Tom e estilo
- **Informativo com toques de humor**
- Perguntas exageradas/irônicas com explicações sérias por baixo
- Referência de estilo: [TryPap](https://trypap.com/) e The World's Hardest Game
- Transições entre "fases" podem ter brincadeiras
- Exemplo: "Você é cego?" (pergunta direta) → "Você é quase cego?" (explicando miopia >6 graus)

---

## Decisões de Design Tomadas

### Público-alvo
- Jovens de 17-18 anos que **ainda não se alistaram**
- NÃO inclui quem já se alistou e está no processo (isso mudaria a árvore)

### Estrutura do quiz
- **Formato: Árvore de decisão binária (sim/não)**
- Ordem: Do mais simples ao mais complexo
- Fases progressivas: Demográfico → Localização → Família → Religião → Educação → Saúde
- Se a pessoa é dispensada em qualquer ponto, o quiz termina com a razão e base legal

### Abordagem nas condições médicas
- Perguntas por **categoria** primeiro (ex: "Você tem problema de visão?")
- Se SIM → entra nas sub-perguntas específicas
- Se NÃO → pula toda a categoria
- Evita fazer 50 perguntas de saúde para quem é saudável

### Base legal
- Seguir **estritamente a lei escrita**
- Possibilidade de INCREMENTAR futuramente com interpretações judiciais e práticas comuns
- Todas as dispensas precisam ter o artigo/lei de referência

---

## Arquitetura Técnica Sugerida

### Requisitos definidos pelo usuário
- **Mobile-first**
- Boas decisões de performance
- Micro-interações (transições, feedback visual)
- Front-end + back-end

### Stack sugerida (a confirmar)
```
Frontend:
- React ou Next.js
- Tailwind CSS (estilização mobile-first)
- Framer Motion (micro-interações)

Backend:
- Pode ser serverless/static (quiz é determinístico)
- JSON com a árvore de decisão
- Opcional: analytics para ver caminhos mais comuns

Hospedagem:
- Vercel / Netlify (grátis, fácil deploy)
```

### Estrutura de dados sugerida
Cada pergunta tem:
```typescript
interface Question {
  id: string;
  pergunta: string;
  explicacao?: string;
  tipo: 'sim_nao' | 'selecao_unica' | 'informativo';
  categoria?: string;
  respostas: {
    [key: string]: {
      resultado?: ResultadoType;
      proximo?: string;
      razao?: string;
      base_legal?: string;
      tipo_dispensa?: string;
      nota?: string;
      dica?: string;
      instrucao?: string;
      alerta?: string;
    }
  }
}

type ResultadoType = 
  | 'FIM_DISPENSADA'
  | 'FIM_DISPENSADO'
  | 'FIM_ISENTO_C'
  | 'FIM_ADIAMENTO'
  | 'FIM_EXCESSO_CONTINGENTE'
  | 'FIM_OBJECAO_CONSCIENCIA'
  | 'FIM_DISPENSADO_ARRIMO'
  | 'FIM_PROVAVELMENTE_ISENTO'
  | 'DICA_PODE_DISPENSAR'
  | 'DICA_AVALIACAO_INDIVIDUAL';
```

---

## Fontes e Documentos de Referência

### Legislação principal
1. **Decreto 57.654/1966** - Regulamento da Lei do Serviço Militar (RLSM)
   - Art. 5º - Mulheres
   - Art. 93 - Excesso de contingente
   - Art. 96 - Residentes no exterior
   - Art. 98 - Adiamento de incorporação
   - Art. 105 - Dispensa de incorporação
   - Art. 109 - Isenções

2. **Decreto 703/1992** - IGISC (Instruções Gerais para Inspeção de Saúde de Conscritos)
   - Anexo II - Doenças que causam isenção
   - Anexo III - Índices mínimos de aptidão
   - Anexo IV - Tabela de altura/peso

3. **Portaria 326-DGP/2019** - Normas Técnicas para JSM
   - Dispensa de mulheres trans

4. **Constituição Federal 1988**
   - Art. 5º, VIII - Objeção de consciência
   - Art. 143, §1º - Serviço alternativo

### Fontes secundárias úteis
- Thread Reddit do MilicoBR (AMA sobre dispensas)
- Caso judicial TRF4 sobre objeção de consciência
- Reportagem BBC sobre jovem que foi à Justiça

---

## Features Futuras (Backlog)

### MVP (versão 1)
- [ ] Quiz funcional com todas as perguntas
- [ ] Resultados com base legal
- [ ] Mobile-first
- [ ] Micro-interações básicas

### Versão 2
- [ ] Modo "debug" mostrando caminho percorrido
- [ ] Compartilhamento do resultado
- [ ] Analytics de caminhos mais comuns
- [ ] Seção "Saiba mais" com explicações detalhadas

### Versão 3
- [ ] Checklist de documentos necessários baseado no resultado
- [ ] Gerador de carta de objeção de consciência
- [ ] Modo para quem JÁ se alistou (árvore diferente)
- [ ] Integração com localização (detectar se município é tributário)

---

## Observações Importantes

### Disclaimer legal
O quiz deve ter um disclaimer claro:
> "Este quiz tem fins informativos e não substitui orientação jurídica profissional. 
> As informações são baseadas na legislação vigente em [data]. 
> Consulte um advogado ou a JSM local para casos específicos."

### Acessibilidade
- Cores com bom contraste
- Funcionar com leitor de tela
- Textos claros e diretos

### Privacidade
- Quiz não deve coletar dados pessoais
- Se tiver analytics, deve ser anônimo
- Não precisa de login/cadastro

---

## Contato e Continuidade

### Arquivos gerados
1. `QUIZ_TREE.md` - Árvore de decisão completa em formato YAML-like
2. `PROJECT_CONTEXT.md` - Este arquivo (contexto e instruções)

### Para continuar no Claude Code
1. Colocar estes arquivos na raiz do projeto
2. Claude Code consegue ler e usar como contexto
3. Começar pelo setup do projeto e implementação da estrutura de dados

### Próximos passos sugeridos
1. Definir stack tecnológica final
2. Criar estrutura do projeto
3. Implementar engine de quiz (state machine)
4. Criar componentes UI mobile-first
5. Implementar a árvore de decisão
6. Adicionar micro-interações
7. Testes e ajustes
8. Deploy

---

## Memória de Decisões

| Data | Decisão | Motivo |
|------|---------|--------|
| 2025-01-26 | Foco em quem NÃO se alistou ainda | Público-alvo são jovens 17-18 |
| 2025-01-26 | Profundidade nas condições médicas | Usuário pediu lista detalhada |
| 2025-01-26 | Tom informativo + humor | Referência TryPap |
| 2025-01-26 | Seguir lei escrita primeiro | Incrementar jurisprudência depois |
| 2025-01-26 | Perguntas médicas por categoria | Evitar quiz muito longo |
| 2025-01-26 | Mobile-first | Requisito do usuário |

---

*Última atualização: 26 de Janeiro de 2025*
