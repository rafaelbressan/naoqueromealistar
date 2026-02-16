# Não Quero Me Alistar

> **[Acesse o Quiz Online](https://naoqueromealistar.netlify.app/)**

Um quiz interativo que ajuda jovens brasileiros a descobrir se são elegíveis para dispensa do serviço militar obrigatório.

## 🎯 Sobre o Projeto

Este projeto oferece um quiz guiado que percorre as diversas categorias de dispensa previstas na legislação brasileira, incluindo:

- Filtros demográficos (sexo, idade)
- Localização e residência
- Situação familiar
- Objeção de consciência
- Situação educacional
- Condições médicas

Cada resultado inclui a base legal completa com link para a legislação oficial, orientações sobre documentação necessária e próximos passos.

## ⚖️ Base Legal

O quiz é baseado na legislação vigente, com links diretos para as fontes oficiais:

- [Decreto 57.654/1966](https://www.planalto.gov.br/ccivil_03/decreto/d57654.htm) (Regulamento da Lei do Serviço Militar - RLSM)
- [Decreto 703/1992](https://www.planalto.gov.br/ccivil_03/decreto/1990-1994/d0703.htm) (IGISC - Instruções Gerais para Inspeção de Saúde)
- [Constituição Federal de 1988](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm)
- [Lei 6.880/1980](https://www.planalto.gov.br/ccivil_03/leis/l6880.htm) (Estatuto dos Militares)

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone git@github.com:rafaelbressan/naoqueromealistar.git

# Entre no diretório
cd naoqueromealistar

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Testes

```bash
npm test         # Roda 67 testes
npm run test:watch  # Modo watch
```

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilização mobile-first
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones
- **Vitest** - Testes unitários e de integração

## 📱 Mobile-First

O projeto foi desenvolvido com foco em dispositivos móveis:

- Touch targets de 44px+ para fácil interação
- Design responsivo
- Botões Sim/Não fixos na parte inferior (dock)
- Navbar com navegação e menu hambúrguer
- Ícones por categoria de pergunta
- Otimizado para redes móveis

## 🧭 Estrutura do Projeto

```
/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── quiz/page.tsx      # Quiz flow
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx         # Top navigation with drawer
│   ├── Question.tsx       # Question display with icons
│   ├── Result.tsx         # Result display with legal links
│   └── ProgressBar.tsx    # Progress indicator
├── data/                  # Quiz data
│   └── quiz-tree.json     # Complete decision tree (59 questions)
├── hooks/                 # Custom React hooks
│   └── useQuizState.ts    # Quiz state machine
├── types/                 # TypeScript types
│   └── quiz.ts            # Quiz interfaces
├── tests/                 # Test suite
│   ├── quiz-tree-validation.test.ts
│   ├── quiz-engine.test.ts
│   ├── critical-paths.test.ts
│   └── components.test.tsx
└── context/               # Project documentation
    ├── PROJECT_CONTEXT.md
    ├── QUIZ_TREE.md
    └── [legal docs]
```

## ⚠️ Aviso Legal

Este quiz tem fins informativos e não substitui orientação jurídica profissional. As informações são baseadas na legislação vigente. Consulte um advogado ou a JSM local para casos específicos.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Rafael Bressan

## 🙏 Agradecimentos

- A todos que compartilharam conhecimento sobre legislação militar brasileira
- Comunidade open source
