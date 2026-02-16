# Project Summary for Rafael

## What This Is

**Não Quero Me Alistar** ("I don't want to enlist") is a Brazilian military service exemption quiz. It helps 17-18 year olds discover if they legally qualify for exemption from mandatory military service.

The app walks users through a decision tree of ~60 questions covering:
- Demographics (gender, age)
- Location (abroad, rural, small towns)
- Family situation (sole provider)
- Religion/conscience (ministers, objectors)
- Education (med students, military schools)
- Medical conditions (vision, hearing, mental health, etc.)

Each result includes the **exact law citation** with **clickable link** to the official government source (planalto.gov.br).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS 4.1 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library |
| Deployment | Netlify (static export) |

---

## Project Structure

```
├── app/
│   ├── page.tsx          # Landing page
│   └── quiz/page.tsx     # Quiz flow
├── components/
│   ├── Navbar.tsx        # Top nav with back button, title, hamburger menu
│   ├── Question.tsx      # Question UI with category icons
│   ├── Result.tsx        # Final result with legal links
│   └── ProgressBar.tsx   # Phase progress indicator
├── hooks/
│   └── useQuizState.ts   # State machine (core engine)
├── data/
│   └── quiz-tree.json    # All 59 questions with legal citations + links
├── types/
│   └── quiz.ts           # TypeScript interfaces
├── tests/
│   ├── quiz-tree-validation.test.ts  # Tree integrity
│   ├── quiz-engine.test.ts           # State machine logic
│   ├── critical-paths.test.ts        # End-to-end paths
│   └── components.test.tsx           # UI components
└── context/
    └── [legal documents & planning docs]
```

---

## How the Quiz Works

1. **State Machine**: `useQuizState.ts` manages current question, history, answers, and result
2. **Decision Tree**: `quiz-tree.json` defines questions and branching logic
3. **Short-circuit**: Early questions (woman? over 30?) exit immediately if applicable
4. **Legal Basis**: Every terminal result includes `razao`, `base_legal`, and `link_legal`

Example flow:
```
P1 (woman?) → YES → FIM_DISPENSADA (Art. 5º Decreto 57.654)
P1 → NO → P2 (trans woman?) → NO → P3 → ... → medical questions → result
```

---

## Current Status

### Completed (MVP + UX Improvements)
- Quiz engine with state machine
- All 59 questions implemented
- Results with clickable legal citation links (planalto.gov.br)
- Mobile-first responsive design
- Fixed bottom dock for Sim/Não buttons on mobile
- Navbar with back chevron, category title, hamburger menu
- Navigation drawer (home, quiz, about)
- Category icons on each question (Lucide icons)
- Test suite: 67 tests passing
- Deployed to Netlify

### Not Yet Done (V2/V3)
- Enhanced animations
- Debug mode (show path taken)
- Social sharing
- Analytics
- Document checklist generator
- Conscientious objection letter generator
- Additional SEO pages

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `hooks/useQuizState.ts` | Core logic — start here to understand the engine |
| `data/quiz-tree.json` | All questions and branching — edit here to change quiz content |
| `components/Navbar.tsx` | Top navigation with back button and drawer |
| `components/Question.tsx` | UI for questions with category icons |
| `components/Result.tsx` | Final result display with legal links |
| `types/quiz.ts` | TypeScript definitions |

---

## Running Locally

```bash
npm install
npm run dev      # Start dev server
npm test         # Run 67 tests
npm run build    # Build for production
```

---

## Test Coverage

- **Tree validation**: No orphaned questions, no broken links, no cycles, all results have legal basis
- **Engine logic**: Traversal, answer recording, back button, restart
- **Critical paths**: Woman path, over-30 path, vision path, family provider paths, healthy user path
- **Components**: Question types render correctly, Result displays all fields, accessibility (44px+ touch targets)

---

## Legal Links

All legal citations now link to official government sources:
- **Decreto 57.654/1966**: https://www.planalto.gov.br/ccivil_03/decreto/d57654.htm
- **IGISC (Decreto 703/1992)**: https://www.planalto.gov.br/ccivil_03/decreto/1990-1994/d0703.htm
- **Constituição Federal**: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm
- **Lei 6.880/1980**: https://www.planalto.gov.br/ccivil_03/leis/l6880.htm

---

## Legal Disclaimer

The quiz provides **informational guidance only** based on Brazilian law. It does not constitute legal advice. Users should consult their local JSM or a lawyer for specific cases.

---

## Deployment

- **Platform**: Netlify
- **Build**: `npm run build` → outputs to `out/` folder
- **Auto-deploy**: Connected to GitHub, deploys on push to main

---

## Recent Changes (Session 2)

1. **Navbar component**: Back button moved from bottom dock to top navbar (chevron icon)
2. **Hamburger menu**: Added drawer navigation for home and future pages
3. **Category icons**: Each question shows relevant Lucide icon (eye, heart, brain, etc.)
4. **Legal links**: All `base_legal` citations now link to planalto.gov.br
5. **Fixed title**: Changed "Eu Não Quero Me Alistar" → "Não Quero Me Alistar"
6. **Punctuation**: All question descriptions now end with proper punctuation
7. **Improved scrolling**: Removed unnecessary scroll on short questions

---

## Session Reference

This project was worked on in Claude Code session:
https://claude.ai/code/session_015VS5J16xAsx5fcn3MkH5b2
