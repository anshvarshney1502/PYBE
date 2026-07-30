# PyBe — Ansh's Pull Request Submission

This pull request introduces the **Case Study Learning Engine** into PyBE with **Topic: Sorting & Searching Basics** — a Duolingo-style interactive micro-learning experience following PyBE's core pedagogical philosophy.

📚 View the project wiki: [WIKI.md](WIKI.md) | Product Spec: [product.md](product.md)

---

## 🎯 PR Overview (Ansh's Contribution)

### ✈️ Topic: Sorting & Searching Basics

Following PyBE's educational philosophy (**Problem → Thinking → Concept Discovery → Python → Reflection**), learners are guided through 4 levels set in an Airport Security scenario:

| Level | Title | Concept Discovered |
|-------|-------|-------------------|
| 1 | Passenger Missing | Linear Search — why checking one-by-one works on unsorted data |
| 2 | Organize & Sort | Sorting — why organizing data is an investment that pays off |
| 3 | Binary Search | Binary Search — how halving the search space finds answers in $O(\log N)$ |
| 4 | System Strategy | Algorithmic judgement — when to use Linear vs Binary Search |

### 🧠 Pedagogical Approach (Duolingo-Style)

Each level is a **3-stage micro-learning engine**:

1. **Stage 1 — Logic Test** (`Stage1LogicTest.jsx`): A real-world scenario card with 2–3 options. The learner picks an approach. If wrong, a reflection prompt guides them to think deeper before trying again.
2. **Stage 2 — Concept Reveal** (`Stage2ConceptReveal.jsx`): The correct concept is revealed with a visual diagram/animation to reinforce the idea without lecturing.
3. **Stage 3 — Code Build** (`Stage3CodeBuild.jsx`): Fill-in-the-blank Python code builder — only 1 blank per level, keeping focus sharp. Powered by **Pyodide** (in-browser Python execution).

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Express.js + Node.js (Port `5002`) — JSON-backed content API
- **Frontend**: React + Vite (Port `5173`) — modular stage-based component system
- **Python Runtime**: Pyodide (runs Python in-browser via WebAssembly — no server needed)
- **Storage**: `content.json` (topics/levels/case studies) + `db.json` (sessions)

### New Files Added

| File | Purpose |
|------|---------|
| `client/src/learning/LearningPage.jsx` | Top-level topic & level selection UI with React Error Boundary |
| `client/src/learning/CaseStudyEngine.jsx` | Orchestrates Stage 1 → 2 → 3 transitions per level |
| `client/src/learning/Stage1LogicTest.jsx` | Option-based logic test with reflection branching |
| `client/src/learning/Stage2ConceptReveal.jsx` | Concept reveal with visualization card |
| `client/src/learning/Stage3CodeBuild.jsx` | Guided fill-in-the-blank Python code builder |
| `client/src/learning/usePyodide.js` | Custom hook to load/manage Pyodide runtime |
| `client/src/learning/utils.jsx` | Shared design tokens, markdown renderer, code template parser |
| `server/src/data/content.json` | Full topic dataset (4 levels, case studies, options, reflections) |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd summership-26-prs/Ansh
npm run installAll
```

### 2. Configure Environment

Server (`server/.env`):
```env
PORT=5002
CLIENT_ORIGIN=http://localhost:5173
```

Client (`client/.env`):
```env
VITE_API_URL=http://localhost:5002/api
```

### 3. Run Development Servers

```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Case Study Learning** (new): [http://localhost:5173/learn](http://localhost:5173/learn)
- **Backend API**: [http://localhost:5002/api](http://localhost:5002/api)

---

## 🧪 How to Test

1. Open [http://localhost:5173/learn](http://localhost:5173/learn)
2. **"Sorting & Searching Basics"** will be auto-selected in the topic dropdown
3. Click **Level 1** → complete Stage 1 (pick an option) → Stage 2 (read concept) → Stage 3 (fill the blank & run Python)
4. Click **Next Level →** and proceed through all 4 levels without any blank screen

---

## ✅ What Was Fixed (Bug Fixes)

- **Blank screen on level transition**: Added a React `ErrorBoundary` that catches runtime errors instead of crashing to a blank page
- **Level-to-level state reset**: `CaseStudyEngine` now resets `caseStudyIndex`, `currentStage`, and `levelDone` whenever `levelId` changes
- **Type coercion bugs**: All `levelId` comparisons use `Number()` to prevent string concatenation issues (`'1' + 1 = '11'`)
- **Null-safety**: All stage components guard against `undefined` data in options, reflections, and code tokens
