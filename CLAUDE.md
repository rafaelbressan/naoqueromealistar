# CLAUDE.md - Military Service Exemption Quiz

> "I really don't want to enlist" - A Legal Path Finder

Welcome! This document is your guide to understanding this project. It's written for future Claude Code sessions (or any developer) who needs to quickly grasp what we're building and why. Think of it as a conversation with your future self who's just opening this codebase for the first time.

---

## What Are We Building?

Imagine you're 17 or 18 in Brazil. You're about to face mandatory military service registration, and you're thinking: "I really, really don't want to do this." You've heard rumors—someone got out because they're "too short," another because they're studying to be a priest. But where's the truth? What are YOUR actual legal options?

**That's what this quiz solves.**

We're building an interactive web app that takes young Brazilians through a decision tree—like a "Choose Your Own Adventure" book, but for legal exemptions. It asks simple yes/no questions, follows the logic, and tells them:
- Whether they qualify for exemption (with the exact law that says so)
- What documents they need to prove it
- What to say at the military registration office

**The tone?** Informative with a touch of humor. Think [TryPap](https://trypap.com/)—playful questions with serious, accurate explanations underneath. Questions like "Você é cego?" (Are you blind?) followed by "Você é quase cego?" (Are you almost blind?) with an explanation about myopia > 6 diopters.

**The audience?** Young people (17-18) who haven't enlisted yet. We're NOT building for people already in the process—that would require a completely different decision tree.

---

## Why This Matters

Here's the thing: Brazilian law has TONS of legal exemptions scattered across multiple decrees and regulations. Most young people have no idea about them. They show up, cross their fingers, and hope for "excesso de contingente" (surplus—basically the military doesn't have room for everyone, so most get sent home anyway).

But what if you're actually legally exempt and don't know it? What if you're:
- An only child supporting your single mom?
- Severely nearsighted?
- A conscientious objector for religious reasons?
- Living in a tiny rural town?

**You have legal rights.** This quiz helps you discover them.

---

## Project Status: Pre-Implementation (Greenfield)

As of now, **there's no code yet**. This is a greenfield project. We have:
- ✅ Complete project context (`context/PROJECT_CONTEXT.md`)
- ✅ Full decision tree with all questions (`context/QUIZ_TREE.md`)
- ✅ Legal reference documents
- ❌ No implementation yet

This CLAUDE.md exists to help you (future Claude session or developer) start implementing with a clear understanding of the goals, architecture, and constraints.

---

## Technical Architecture

### The Stack (Proposed)

```
Frontend:
├── React or Next.js (for routing and SSR if needed)
├── Tailwind CSS (mobile-first styling)
└── Framer Motion (micro-interactions and transitions)

Backend:
├── Serverless/Static (quiz logic is deterministic)
├── JSON data structure for the quiz tree
└── Optional: Analytics to see common paths

Hosting:
└── Vercel or Netlify (free tier, easy deploys)
```

### Why These Choices?

**Mobile-first**: Our users are teenagers. They live on their phones. The quiz MUST feel smooth on mobile—no pinch-to-zoom, no awkward tap targets.

**Serverless**: The quiz is essentially a big decision tree. Given the same answers, you always get the same result. No need for a traditional backend—we can compute everything client-side or in serverless functions. This keeps costs at zero and deploys instant.

**Framer Motion**: Micro-interactions matter. When a user taps "SIM" (yes), there should be a satisfying transition to the next question. It signals progress and keeps engagement high.

**Tailwind CSS**: Utility-first CSS lets us prototype fast and stay consistent. Mobile-first is baked into Tailwind's design.

### The Data Structure

Each question in the quiz is represented as an object. Here's the TypeScript interface:

```typescript
interface Question {
  id: string;                    // e.g., "P15" (question 15)
  pergunta: string;              // The question text
  explicacao?: string;           // Optional explanation/context
  tipo: 'sim_nao' | 'selecao_unica' | 'informativo';
  categoria?: string;            // e.g., "visao", "saude_mental"

  respostas: {
    [key: string]: {
      resultado?: ResultadoType;   // If this ends the quiz
      proximo?: string;            // Next question ID
      razao?: string;              // Legal reason for exemption
      base_legal?: string;         // The actual law/decree article
      tipo_dispensa?: string;      // Type of exemption
      nota?: string;               // Additional note
      dica?: string;               // Tip for the user
      instrucao?: string;          // Instructions
      alerta?: string;             // Warning
    }
  }
}

type ResultadoType =
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
```

**Why this structure?**

It's flexible and declarative. You describe WHAT the quiz tree looks like, not HOW to traverse it. The engine handles the traversal logic. This separation means:
- Non-engineers can edit the quiz in JSON without touching code
- We can validate the tree structure separately
- It's easy to export to different formats (YAML, visual diagram, etc.)

---

## The Quiz Tree: A Decision Forest

### How It Works

The quiz is a **binary decision tree** with 6 phases. Think of it like a flowchart where each node is a question and each branch is an answer.

Here's the high-level flow:

```
Phase 1: Demographics (4 questions)
  ↓
Phase 2: Location/Residence (5 questions)
  ↓
Phase 3: Family Situation (2 + selection)
  ↓
Phase 4: Religion/Conscience (5 questions)
  ↓
Phase 5: Education/Profession (3 questions)
  ↓
Phase 6: Medical Conditions (~45 questions across 10 categories)
  ↓
Final Result
```

**Why this order?**

We go from **fastest filters to slowest**.

- If you're a woman (P1), you're done in 1 question. No need to ask about your eyesight.
- If you're over 30 (P4), you're automatically in the surplus—quiz ends.
- Medical questions come LAST because there are SO many, and most people won't need them.

This is a classic **short-circuit evaluation** pattern. Like `if (a && b && c)` in code—if `a` is false, we never check `b` or `c`.

### The Medical Question Strategy

Medical conditions could easily balloon to 100+ questions if we asked everything. Instead, we use **category-first filtering**:

```
P15: "Do you have any vision problems?"
  → NO: Skip to P20 (hearing)
  → YES: Ask specific vision questions (P15.1, P15.2, etc.)
```

This keeps healthy users from answering 50 irrelevant questions while still being thorough for those with conditions.

**Analogy time:** It's like a restaurant menu. We don't list every ingredient—we give you categories (Appetizers, Mains, Desserts). If you're not hungry for dessert, you don't read that section.

### Navigating the Tree

The full decision tree lives in `context/QUIZ_TREE.md`. It's written in YAML-like notation for readability:

```yaml
id: P15
pergunta: "Você tem algum problema de visão?"
respostas:
  sim:
    proximo: P15_1
  nao:
    proximo: P20
```

When implementing, you'll convert this to JSON and load it into your quiz engine. The engine is essentially a **state machine**:

```
Current State: P15
User Input: "SIM"
Next State: P15_1
```

---

## Legal Context (In Plain Language)

Brazilian military service law is a mess of overlapping decrees. Here's what you need to know:

### Key Laws

1. **Decreto 57.654/1966** - The main military service regulation (RLSM)
   - Art. 5º: Women are exempt
   - Art. 93: Surplus system
   - Art. 98: Postponements (students, clergy)
   - Art. 105: Exemptions (sole providers, rural residents)
   - Art. 109: Unfitness/disability

2. **Decreto 703/1992** - Health inspection rules (IGISC)
   - Annex II: Diseases causing exemption
   - Annex III: Minimum fitness standards
   - Annex IV: Height/weight table

3. **Portaria 326-DGP/2019** - Transgender exemption policy

4. **Constituição Federal 1988** - Constitutional rights
   - Art. 5º, VIII: Conscientious objection
   - Art. 143, §1º: Alternative service (never actually implemented)

### Exemption Categories Explained

**Dispensa de Incorporação (Exemption from Service)**
- You registered, but you don't serve
- Examples: Sole family provider, rural resident, clergy

**Isenção (Unfitness - Category C)**
- Permanent medical/physical unfitness
- Examples: Blindness, severe heart condition, amputation

**Adiamento (Postponement)**
- Service delayed while a condition lasts
- Examples: Living abroad, seminary student, health student

**Excesso de Contingente (Surplus)**
- The military doesn't have capacity for you
- ~93% of registrants fall here (only ~7% actually serve)

**Objeção de Consciência (Conscientious Objection)**
- Religious/philosophical/political opposition to military service
- Constitutional right, though poorly implemented

### The Disclaimer (IMPORTANT!)

This quiz is **informational only**. It's not legal advice. We must include a clear disclaimer:

```
This quiz provides information based on Brazilian law as of [date].
It does NOT replace professional legal advice. For specific cases,
consult a lawyer or your local JSM (Junta de Serviço Militar).
```

Why? Because:
1. Laws change
2. Local interpretation varies
3. We're not lawyers, and this isn't a law firm

---

## Development Guidelines

### File Structure (To Be Established)

Here's a proposed structure for when you start coding:

```
/
├── src/
│   ├── components/
│   │   ├── Quiz/
│   │   │   ├── Question.tsx          # Single question component
│   │   │   ├── ProgressBar.tsx       # Shows current phase
│   │   │   ├── Result.tsx            # Final result display
│   │   │   └── Transition.tsx        # Animated transitions
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── data/
│   │   └── quiz-tree.json            # The full decision tree
│   ├── hooks/
│   │   └── useQuizState.ts           # State machine hook
│   ├── types/
│   │   └── quiz.ts                   # TypeScript interfaces
│   └── pages/
│       ├── index.tsx                 # Landing page
│       └── quiz.tsx                  # Main quiz flow
├── public/
│   └── legal/                        # PDF copies of laws
└── context/                          # Project documentation
```

### Component Patterns

**Question Component**: Should be simple and reusable.

```tsx
<Question
  id="P15"
  pergunta="Você tem algum problema de visão?"
  explicacao="Qualquer coisa: usa óculos, lente..."
  onAnswer={(answer) => handleAnswer('P15', answer)}
/>
```

**State Management**: Use a state machine pattern. Here's the concept:

```typescript
const useQuizState = () => {
  const [currentQuestion, setCurrentQuestion] = useState('P1');
  const [history, setHistory] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Map<string, string>>();

  const handleAnswer = (questionId: string, answer: string) => {
    // 1. Record answer
    setAnswers(prev => prev.set(questionId, answer));

    // 2. Look up next state
    const question = quizTree[questionId];
    const nextState = question.respostas[answer];

    // 3. Transition
    if (nextState.resultado) {
      // End state - show result
      showResult(nextState);
    } else {
      // Continue - go to next question
      setHistory(prev => [...prev, questionId]);
      setCurrentQuestion(nextState.proximo);
    }
  };

  return { currentQuestion, handleAnswer, history };
};
```

### Adding New Questions

To add a new medical condition:

1. Open `data/quiz-tree.json`
2. Find the appropriate category (e.g., vision, hearing)
3. Add your question object:
```json
{
  "id": "P15_NEW",
  "pergunta": "Your new question?",
  "tipo": "sim_nao",
  "categoria": "visao",
  "respostas": {
    "sim": {
      "resultado": "FIM_ISENTO_C",
      "razao": "Explanation",
      "base_legal": "Law citation"
    },
    "nao": {
      "proximo": "P16"
    }
  }
}
```
4. Update the previous question's `proximo` field to point to your new question

**Important:** Every terminal node (end state) MUST have:
- `resultado`: The result type
- `razao`: Why they're exempt (in Portuguese)
- `base_legal`: The legal citation

### Testing Strategy

**Unit Tests**: Test the quiz engine logic
```typescript
test('P1: Woman → FIM_DISPENSADA', () => {
  const result = traverseQuiz('P1', 'sim');
  expect(result.resultado).toBe('FIM_DISPENSADA');
  expect(result.base_legal).toContain('Art. 5º');
});
```

**E2E Tests**: Critical paths through the quiz
```typescript
test('Vision: High myopia path', () => {
  cy.visit('/quiz');
  cy.contains('Você é mulher').click('não');
  // ... navigate to vision questions
  cy.contains('miopia ALTA').click('sim');
  cy.contains('FIM_ISENTO_C').should('be.visible');
});
```

**Why E2E matters here:** This is a flow-based app. The whole point is the journey through questions. Unit tests alone won't catch broken paths.

### Accessibility Requirements

- **Screen reader compatible**: Use semantic HTML, proper ARIA labels
- **High contrast**: WCAG AA minimum (4.5:1 for text)
- **Keyboard navigation**: Tab through questions, Enter to select
- **Clear language**: Avoid jargon, explain legal terms

### Privacy

- **No personal data collection**: Don't store answers, names, locations
- **Client-side only**: All quiz logic runs in the browser
- **Optional anonymous analytics**: Only track paths, not individuals

---

## Content & UX Guidelines

### Writing Style

**Questions**: Direct, sometimes playful
```
❌ "Do you happen to have any conditions affecting your visual acuity?"
✅ "Você tem algum problema de visão?"
```

**Explanations**: Clear, helpful, NOT condescending
```
❌ "As you may or may not know, myopia is..."
✅ "Olha na receita do seu óculos. Se o número for tipo -6,00 ou mais..."
```

### Micro-Interactions

- **Answer tap**: Satisfying animation (scale + fade)
- **Question transition**: Slide in from right (forward), left (back)
- **Phase transition**: Subtle celebration (confetti? sparkles?)
- **Progress**: Show current phase (e.g., "Fase 3 de 6: Família")

### Mobile-First Patterns

- **Large tap targets**: 44px minimum
- **Sticky progress bar**: Always visible at top
- **One question per screen**: No scrolling
- **Bottom navigation**: Back button at bottom-left, easy to reach

### Result Presentation

When the quiz ends, show:
1. **Result headline**: "Você pode ser DISPENSADO!"
2. **The reason**: In simple language
3. **The legal basis**: "Art. 105, nº 8, §1 do Decreto 57.654/1966"
4. **Next steps**: What documents to bring, what to say
5. **Disclaimer**: This is informational, not legal advice

---

## Context Files Reference

When you start coding, you'll reference these files constantly:

### `context/PROJECT_CONTEXT.md`
- Full project context and decisions
- Target audience definition
- Tech stack suggestions
- Feature roadmap

### `context/QUIZ_TREE.md`
- **The most important file**: Complete decision tree
- All 60+ questions with legal citations
- Use this to build your JSON data structure

### `context/Claude Teacher.md`
- Documentation style guide
- How to write engaging docs (like this one!)

### Legal Documents
- Stored in `context/` folder
- Reference only—don't modify
- Link to them from results for user verification

---

## Implementation Roadmap

### MVP (Version 1)
- [x] Basic quiz engine (state machine)
- [x] All questions from QUIZ_TREE.md implemented
- [x] Results with legal basis displayed
- [x] Mobile-first responsive design
- [x] Basic transitions (fade in/out)
- [x] Test suite (Vitest): tree validation, engine logic, critical paths, components (67 tests)

### Version 2
- [ ] Enhanced micro-interactions (Framer Motion)
- [ ] "Debug mode" showing path taken
- [ ] Social sharing ("I'm exempt! Take the quiz")
- [ ] Anonymous analytics (which paths are common?)
- [ ] "Learn more" sections with detailed explanations

### Version 3
- [ ] Document checklist generator based on result
- [ ] Sample conscientious objection letter generator
- [ ] Mode for people already enlisted (different tree!)
- [ ] Location detection (check if municipality is "tributário")

### NOT Implementing (Out of Scope)
- Features for people already serving
- Legal advice or case consultation
- Document upload/storage
- User accounts/login

---

## Common Scenarios

### Scenario 1: Add a New Medical Condition

**Task**: Add "color blindness" as a vision condition.

**Steps**:
1. Open `context/QUIZ_TREE.md` and find the vision category (P15)
2. Decide where it fits in the sequence (after miopia? after glaucoma?)
3. Create question P15_5 (or whatever number is next):
```yaml
id: P15_5
pergunta: "Você é daltônico?"
explicacao: "Dificuldade para distinguir cores"
tipo: sim_nao
categoria: visao

respostas:
  sim:
    resultado: FIM_PROVAVELMENTE_ISENTO
    razao: "Daltonismo grave pode ser incapacitante"
    base_legal: "Anexo II do IGISC"
  nao:
    proximo: P20  # Next category
```
4. Update the previous question's `nao` branch to point to P15_5
5. Convert to JSON and add to `data/quiz-tree.json`
6. Test the path

### Scenario 2: Modify an Exemption's Legal Basis

**Task**: The law changed for religious exemption.

**Steps**:
1. Find question P9 (clergy exemption)
2. Update the `base_legal` field with the new decree/article
3. Update the `razao` field if the language changed
4. Update `context/QUIZ_TREE.md` for documentation
5. Add a note in the result about when the law changed

### Scenario 3: Update Question Wording

**Task**: Users are confused by the "pé plano" question.

**Steps**:
1. Find P45_4 in the quiz tree
2. Update the `pergunta` field (maybe "pé chato" is clearer?)
3. Expand the `explicacao` with an example or image link
4. If it's a common confusion, add a note in CLAUDE.md

### Scenario 4: Add a New Phase

**Task**: Add a "Criminal Record" phase.

**This is a BIG change.** Here's the process:

1. **Research**: Verify this is actually in the law (check RLSM)
2. **Design**: Where does it fit? Before or after medical?
3. **Document**: Add to `QUIZ_TREE.md` with all legal citations
4. **Implement**: Create the questions in JSON
5. **Update UI**: Progress bar now shows "Fase 7 de 7"
6. **Test**: Full E2E test of the new path

### Scenario 5: Handle an Edge Case

**Example**: User is both a seminary student AND has high myopia.

**The tree handles this automatically**—it short-circuits at the FIRST exemption. If they answer "yes" to P10 (seminary student), they get `FIM_ADIAMENTO` and never reach the medical questions.

**What if we want to show ALL reasons?**
- Modify the result type to store an array: `motivos: []`
- Continue asking questions even after a result
- On final screen, show all applicable exemptions

---

## Lessons and Best Practices

> This section is the "Claude Teacher" part—the wisdom, the pitfalls, the engineering mindset.

### Lesson 1: Tight Coupling Is the Enemy

**Pitfall**: Hardcoding quiz logic in UI components.

Imagine you write:
```tsx
// ❌ DON'T DO THIS
function QuizPage() {
  if (userSex === 'F') {
    return <Result type="DISPENSADA" />;
  }
  if (userAge > 30) {
    return <Result type="EXCESSO" />;
  }
  // ... 60 more if statements
}
```

**Why it's bad**:
- Can't edit the quiz without touching code
- Can't test the quiz logic independently
- Can't visualize the tree or export it

**The fix**: Separate data from logic.
```tsx
// ✅ DO THIS
function QuizPage() {
  const { currentQuestion, result } = useQuizState(quizTreeData);
  if (result) return <Result {...result} />;
  return <Question {...currentQuestion} onAnswer={handleAnswer} />;
}
```

Now the quiz tree is data, the engine is logic, and the UI is presentation. Clean separation of concerns.

### Lesson 2: Why State Machine Over Simple If/Else?

You might think: "Why not just a bunch of if/else statements?"

**Here's why state machines win:**

1. **Explicit states**: Every question is a named state (P1, P2). You can see where you are.
2. **Explicit transitions**: Every answer triggers a transition to another state.
3. **Auditable**: You can log the path: P1 → P4 → P5 → P8_1 → RESULT
4. **Reversible**: Want a "Back" button? Just pop the last state from history.
5. **Testable**: "From P15 with answer 'sim', should transition to P15_1"

If/else is imperative ("do this, then this, then this"). State machines are declarative ("here are the states and transitions").

**Analogy**: If/else is like giving turn-by-turn directions. A state machine is like a map—you can see the whole terrain.

### Lesson 3: Don't Over-Engineer (Yet)

This is a V1 project. You might be tempted to:
- Add a visual quiz tree editor
- Support multiple languages
- Build a CMS for managing questions
- Add user accounts and saved progress

**Stop.**

Build the simplest thing that works:
- JSON file for the tree
- Stateful React component for the engine
- Basic UI with Tailwind
- Deploy to Vercel

**Why?** Because you don't know yet if:
- Users will actually use this
- The quiz flow makes sense
- The questions are clear

Get it in front of users FAST. Iterate based on real feedback.

**Quote to remember**: "Premature optimization is the root of all evil." —Donald Knuth

### Lesson 4: Legal Accuracy Is Non-Negotiable

This isn't a fun BuzzFeed quiz. This affects people's lives. If you say "You're exempt!" and they're not, you've wasted their time and hopes.

**Best practices:**
- **Cite sources**: Every exemption links to the actual law
- **Use exact language**: Don't paraphrase legal text (it changes meaning)
- **Version your data**: When laws change, keep old versions for reference
- **Disclaimer prominently**: Above the fold, can't be missed

**How to verify**: Cross-reference every single result in QUIZ_TREE.md against the actual decree. Print the PDF, highlight the relevant articles, check them off one by one.

### Lesson 5: Testing Strategy Rationale

Why E2E tests are critical here:

This app is essentially a **flowchart executor**. The value is in the PATHS, not individual components. A unit test that says "Question component renders correctly" doesn't tell you if the quiz actually works.

**What you need to know:**
- Does the "high myopia" path correctly lead to exemption?
- Does the "woman" path short-circuit immediately?
- Does the "healthy 18-year-old urban male" path go through all phases?

E2E tests answer these questions. Run them on every deploy.

### Lesson 6: Performance Considerations for Mobile

**Lazy loading the tree**: If your quiz tree JSON is 500KB, don't load it all upfront.

```typescript
// Load only the current phase
const loadPhase = async (phaseNumber: number) => {
  return import(`./data/phase-${phaseNumber}.json`);
};
```

**Tree pruning**: Once a user answers "no" to vision problems, don't even load P15_1 through P15_5.

**Animations**: Framer Motion is beautiful but heavy. Use CSS transforms for simple transitions, Framer only for complex gestures.

**Image optimization**: If you add images/icons, use Next.js Image component with proper sizing.

### Lesson 7: Anticipated Pitfalls

**Pitfall #1: Hardcoding legal text in components**
- ❌ `<p>Mulheres não são obrigadas...</p>`
- ✅ `<p>{result.razao}</p>` (from data)

**Pitfall #2: Forgetting mobile tap target sizes**
- ❌ 24px buttons (hard to tap accurately)
- ✅ 44px minimum (Apple HIG guideline)

**Pitfall #3: No back button**
- Users WILL misclick. Let them go back.

**Pitfall #4: Assuming users read explanations**
- Make the main question clear on its own
- Explanation is a bonus, not required reading

**Pitfall #5: Not testing on actual devices**
- Simulators lie. Test on a real phone.

### Lesson 8: Engineering Mindset for Decision Trees

When you extend this system, think in terms of:

**Graph theory**: This is a directed acyclic graph (DAG). Each question is a node, each answer is an edge. Terminal nodes have no outgoing edges.

**Traversal**: You're doing a depth-first search through the graph based on user input.

**Validation**: Before deploying, assert:
- No orphaned nodes (unreachable questions)
- No infinite loops (question A → B → A)
- All terminal nodes have result + legal basis
- All legal bases are valid references

You can write a script to validate this:
```typescript
function validateQuizTree(tree: QuizTree) {
  // Check reachability
  const reachable = new Set<string>();
  const traverse = (id: string) => {
    if (reachable.has(id)) return; // Visited
    reachable.add(id);
    const question = tree[id];
    for (const answer of Object.values(question.respostas)) {
      if (answer.proximo) traverse(answer.proximo);
    }
  };
  traverse('P1'); // Start from root

  // Check for orphans
  const allQuestions = Object.keys(tree);
  const orphans = allQuestions.filter(q => !reachable.has(q));
  if (orphans.length > 0) {
    throw new Error(`Orphaned questions: ${orphans.join(', ')}`);
  }

  // Check terminal nodes
  for (const [id, question] of Object.entries(tree)) {
    for (const answer of Object.values(question.respostas)) {
      if (answer.resultado && !answer.base_legal) {
        throw new Error(`${id} has result but no legal basis`);
      }
    }
  }
}
```

Run this on every build. It'll save you from broken deploys.

---

## Important Notes

### This Is Pre-Implementation

Remember: **No code exists yet.** This is a planning document. When you start coding:
1. Set up the project (`npx create-next-app` or similar)
2. Convert `QUIZ_TREE.md` to JSON
3. Build the state machine hook
4. Create the UI components
5. Test, test, test
6. Deploy

### All Exemptions Need Legal Basis

Never, ever add a result without a legal citation. If you can't find it in the decrees, it doesn't go in the quiz. Period.

### Avoid Over-Engineering

Keep it simple. JSON data + React state machine + Tailwind UI. That's it for V1.

Don't add:
- A database (no user data to store)
- A backend API (logic is deterministic)
- A complex state management library (React state is fine)

**When** to add them:
- Database: If you add user accounts or save progress
- Backend: If you add admin features or dynamic content
- Redux/Zustand: If state gets too complex (unlikely for a quiz)

### Focus on Mobile Experience First

Desktop is secondary. If it looks good on an iPhone SE, you're golden.

### Humor Should Not Undermine Accuracy

It's okay to be playful ("Você é cego?" → "Você é quase cego?"), but the legal information must be precise and serious. We're helping people assert their rights, not making light of their situation.

---

## Quick Start for New Sessions

Future Claude session, here's your TL;DR:

1. **Read this file** (you're doing it!)
2. **Read** `context/QUIZ_TREE.md` (the full decision tree)
3. **Understand**: This is a state machine quiz based on Brazilian military service law
4. **Implement**: Convert quiz tree to JSON, build React state machine, create UI
5. **Test**: Every path through the tree must be verified
6. **Deploy**: Vercel/Netlify, mobile-first

**Key constraints:**
- Every result needs legal citation
- Mobile-first design
- No personal data collection
- Informative + humor tone
- Accessibility is required, not optional

---

## Resources

- **QUIZ_TREE.md**: Full decision tree with all questions
- **PROJECT_CONTEXT.md**: Project background and decisions
- **Legal docs**: In `context/` folder
- **Alistamento Online**: https://alistamento.eb.mil.br/
- **Github repo**: git@github.com:rafaelbressan/naoqueromealistar.git

---

**Last updated**: January 26, 2025

---

*Good luck, and remember: you're building something that helps young people understand their legal rights. That's meaningful work. Make it accurate, make it accessible, make it helpful.*
