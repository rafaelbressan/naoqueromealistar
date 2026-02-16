# Project Summary for Rafael

## What This Is

**Naoqueromealistar** ("I don't want to enlist") is a Brazilian military service exemption quiz. It helps 17-18 year olds discover if they legally qualify for exemption from mandatory military service.

The app walks users through a decision tree of ~60 questions covering:
- Demographics (gender, age)
- Location (abroad, rural, small towns)
- Family situation (sole provider)
- Religion/conscience (ministers, objectors)
- Education (med students, military schools)
- Medical conditions (vision, hearing, mental health, etc.)

Each result includes the **exact law citation** (e.g., "Art. 105, §8º do Decreto 57.654/1966") so users can verify and reference it at their JSM (military service board).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS 4.1 |
| Animations | Framer Motion 12 |
| Testing | Vitest + React Testing Library |
| Deployment | Netlify (static export) |

---

## Project Structure

```
├── app/
│   ├── page.tsx          # Landing page
│   └── quiz/page.tsx     # Quiz flow
├── components/
│   ├── Question.tsx      # Question UI (sim/não, selection, info)
│   ├── Result.tsx        # Final result display
│   └── ProgressBar.tsx   # Phase progress indicator
├── hooks/
│   └── useQuizState.ts   # State machine (core engine)
├── data/
│   └── quiz-tree.json    # All 59 questions with legal citations
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
4. **Legal Basis**: Every terminal result includes `razao` (reason) and `base_legal` (law citation)

Example flow:
```
P1 (woman?) → YES → FIM_DISPENSADA (Art. 5º Decreto 57.654)
P1 → NO → P2 (trans woman?) → NO → P3 → ... → medical questions → result
```

---

## Current Status

### Completed (MVP)
- Quiz engine with state machine
- All 59 questions implemented
- Results with legal citations
- Mobile-first responsive design
- Fixed bottom dock for buttons on mobile
- Back button navigation
- Home link on results
- Test suite: 68 tests passing
- Deployed to Netlify

### Not Yet Done (V2/V3)
- Enhanced animations
- Debug mode (show path taken)
- Social sharing
- Analytics
- Document checklist generator
- Conscientious objection letter generator

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `hooks/useQuizState.ts` | Core logic — start here to understand the engine |
| `data/quiz-tree.json` | All questions and branching — edit here to change quiz content |
| `components/Question.tsx` | UI for questions — handles all 3 types |
| `components/Result.tsx` | Final result display with legal info |
| `types/quiz.ts` | TypeScript definitions |

---

## Running Locally

```bash
npm install
npm run dev      # Start dev server
npm test         # Run 68 tests
npm run build    # Build for production
```

---

## Test Coverage

- **Tree validation**: No orphaned questions, no broken links, no cycles, all results have legal basis
- **Engine logic**: Traversal, answer recording, back button, restart
- **Critical paths**: Woman path, over-30 path, vision path, family provider paths, healthy user path
- **Components**: Question types render correctly, Result displays all fields, accessibility (44px+ touch targets)

---

## Legal Disclaimer

The quiz provides **informational guidance only** based on Brazilian law. It does not constitute legal advice. Users should consult their local JSM or a lawyer for specific cases.

---

## Deployment

- **Platform**: Netlify
- **Build**: `npm run build` → outputs to `out/` folder
- **Auto-deploy**: Connected to GitHub, deploys on push to main

---

## Session Reference

This project was worked on in Claude Code session:
https://claude.ai/code/session_015VS5J16xAsx5fcn3MkH5b2
