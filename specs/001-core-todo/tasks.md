# Tasks: Core Todo Functionality

**Input**: Design documents from `/specs/001-core-todo/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/todos.md ✅, quickstart.md ✅

**Tests**: Not included — not explicitly requested in spec.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Web app layout: `backend/src/`, `frontend/src/` at repository root per plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — both packages scaffolded with correct deps, scripts, and config before any source code.

- [X] T001 Initialize backend project: create backend/package.json (deps: express, drizzle-orm, better-sqlite3, zod, cors; devDeps: typescript, ts-node-dev, @types/express, @types/better-sqlite3, @types/cors, vitest, supertest, @types/supertest; scripts: dev, build, start, db:generate, db:migrate, test)
- [X] T002 [P] Create backend/tsconfig.json (strict: true, target: ES2020, module: CommonJS, outDir: dist) and backend/drizzle.config.ts (driver: better-sqlite3, schema: src/db/schema.ts, out: src/db/migrations)
- [X] T003 [P] Initialize frontend project: create frontend/package.json (deps: react, react-dom; devDeps: vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom, vitest, @testing-library/react, msw; scripts: dev, build, preview, test)
- [X] T004 [P] Create frontend/tsconfig.json (strict: true, jsx: react-jsx, target: ESNext) and frontend/vite.config.ts (React plugin, server.proxy /api → localhost:3001)
- [X] T005 [P] Create backend/.env (DATABASE_URL=./todo.db, PORT=3001, ALLOWED_ORIGIN=http://localhost:5173) and frontend/.env (VITE_API_URL=http://localhost:3001)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Create Drizzle todos table schema (id: integer PK autoIncrement, text: text notNull, completed: integer boolean notNull default false, createdAt: text notNull $defaultFn ISO timestamp, userId: text nullable) in backend/src/db/schema.ts; export Todo and NewTodo inferred types
- [X] T007 Set up SQLite database connection: create Database instance from DATABASE_URL env var using better-sqlite3, wrap with drizzle(), export db singleton in backend/src/db/index.ts; run npm run db:generate then npm run db:migrate to create backend/src/db/migrations/
- [X] T008 [P] Create Zod request validation middleware: accept a ZodSchema, parse req.body, call next() on success, return 400 JSON { error: string } on failure in backend/src/middleware/validate.ts
- [X] T009 Create Express app in backend/src/app.ts: apply express.json(), cors({ origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173' }); export app without calling listen; create backend/src/server.ts as entry point: import app, call app.listen(PORT)
- [X] T010 [P] Create shared TypeScript types in frontend/src/types.ts (Todo interface: id, text, completed, createdAt, userId?) and thin fetch wrappers in frontend/src/api/todos.ts (getTodos, createTodo, toggleTodo, deleteTodo using VITE_API_URL, throw on non-ok responses)

**Checkpoint**: Foundation ready — database migrated, app wiring complete, API client defined. User story implementation can now begin.

---

## Phase 3: User Story 1 — View Todo List (Priority: P1) 🎯 MVP

**Goal**: User opens the app and sees the full todo list with loading, empty, and error states handled.

**Independent Test**: Start both servers, open http://localhost:5173 — should see either the todo list or an empty state message. No blank/broken screens.

### Implementation

- [X] T011 [US1] Add GET /todos route handler: query db for all todos ordered by createdAt DESC, return 200 JSON array (empty array if none), return 500 { error: "Failed to load todos." } on DB error; create backend/src/routes/todos.ts with Express Router and mount at /todos in backend/src/app.ts
- [X] T012 [US1] Implement useTodos custom hook in frontend/src/hooks/useTodos.ts: state (todos: Todo[], loading: boolean, error: string | null); useEffect calls getTodos() on mount, sets loading true before fetch and false after, sets error on failure
- [X] T013 [US1] Implement TodoList component in frontend/src/components/TodoList.tsx: accepts todos, loading, error props; renders loading spinner div when loading, error message paragraph when error, empty state message when todos.length === 0, or maps todos to TodoItem when populated
- [X] T014 [P] [US1] Implement TodoItem component in frontend/src/components/TodoItem.tsx: accepts todo prop (Todo type); renders todo.text in a span and a visual completed indicator (checked/unchecked) — no interactive callbacks yet
- [X] T015 [US1] Compose root component in frontend/src/App.tsx: call useTodos hook, render page header and TodoList with todos/loading/error props; import styles.css
- [X] T016 [P] [US1] Create global responsive CSS in frontend/src/styles.css: mobile-first layout (flex column, max-width container), header styles, list styles, loading state (spinner or text), empty state (centered message), error state (red/warning banner), active todo item row style; desktop breakpoint media query

**Checkpoint**: User Story 1 fully functional — app loads, displays todos, handles all non-ideal states (loading, empty, error).

---

## Phase 4: User Story 2 — Create a Todo (Priority: P2)

**Goal**: User submits text and a new todo appears immediately at the top of the list as active.

**Independent Test**: Submit a new todo → it appears at top of list as active. Submit empty input → inline validation message shown. Refresh → new todo persists.

### Implementation

- [X] T017 [US2] Add POST /todos route handler to backend/src/routes/todos.ts: apply validate(z.object({ text: z.string().trim().min(1).max(500) })) middleware, insert new todo into DB, return 201 with created todo; return 400 { error: "Todo text is required and must not be empty." } on validation failure; return 500 { error: "Failed to create todo." } on DB error
- [X] T018 [US2] Add addTodo(text: string) action to useTodos hook in frontend/src/hooks/useTodos.ts: call createTodo API, prepend returned todo to todos[] state on success, set error string on API failure
- [X] T019 [US2] Implement TodoForm component in frontend/src/components/TodoForm.tsx: controlled text input, client-side trim validation (show inline error if empty), calls onAdd(text) prop on valid submit, clears input after successful add, accepts onAdd: (text: string) => Promise<void> prop
- [X] T020 [US2] Add TodoForm to frontend/src/App.tsx: pass useTodos.addTodo as onAdd prop, render TodoForm above TodoList

**Checkpoint**: User Stories 1 and 2 both fully functional — can view and create todos.

---

## Phase 5: User Story 3 — Complete a Todo (Priority: P3)

**Goal**: User toggles a todo's completion; visual appearance updates immediately and persists on refresh.

**Independent Test**: Click checkbox on active todo → strikethrough appears. Click again → returns to active. Refresh → toggled state preserved.

### Implementation

- [X] T021 [US3] Add PATCH /todos/:id route handler to backend/src/routes/todos.ts: coerce id param (z.coerce.number().int().positive()), apply validate(z.object({ completed: z.boolean() })) middleware, return 404 { error: "Todo not found." } if absent, update completed field in DB, return 200 with updated todo; return 500 { error: "Failed to update todo." } on DB error
- [X] T022 [US3] Add toggleTodo(id: number, completed: boolean) action to useTodos hook in frontend/src/hooks/useTodos.ts: call toggleTodo API, update matching todo in todos[] state on success, set error string on failure
- [X] T023 [US3] Add toggle checkbox to TodoItem in frontend/src/components/TodoItem.tsx: checkbox input bound to todo.completed, calls onToggle(todo.id, !todo.completed) on change; accept onToggle?: (id: number, completed: boolean) => void prop; add completed CSS class to item when todo.completed is true
- [X] T024 [US3] Add completed todo styles to frontend/src/styles.css: .completed class applies text-decoration: line-through and muted/grey color to todo text; ensure visual distinction is clear at a glance
- [X] T025 [US3] Thread onToggle prop through TodoList in frontend/src/components/TodoList.tsx (accept and pass to each TodoItem) and wire useTodos.toggleTodo as onToggle in frontend/src/App.tsx

**Checkpoint**: User Stories 1, 2, and 3 all fully functional — can view, create, and toggle todos.

---

## Phase 6: User Story 4 — Delete a Todo (Priority: P4)

**Goal**: User removes a todo permanently; it disappears immediately from the UI and is gone after refresh.

**Independent Test**: Click delete on a todo → removed from list immediately. Refresh → still gone. Simulate failure → item stays in list with error message shown.

### Implementation

- [X] T026 [US4] Add DELETE /todos/:id route handler to backend/src/routes/todos.ts: coerce and validate id param, return 404 { error: "Todo not found." } if absent, delete from DB, return 204 No Content; return 500 { error: "Failed to delete todo." } on DB error
- [X] T027 [US4] Add deleteTodo(id: number) action to useTodos hook in frontend/src/hooks/useTodos.ts: call deleteTodo API, filter removed todo from todos[] state on success (204), set error string on API failure so item remains in list
- [X] T028 [US4] Add delete button to TodoItem in frontend/src/components/TodoItem.tsx: button element calls onDelete(todo.id) on click; accept onDelete?: (id: number) => void prop; style as small icon/text button
- [X] T029 [US4] Thread onDelete prop through TodoList in frontend/src/components/TodoList.tsx (accept and pass to each TodoItem) and wire useTodos.deleteTodo as onDelete in frontend/src/App.tsx

**Checkpoint**: All four user stories fully functional — full CRUD loop complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and any cross-cutting improvements.

- [X] T030 [P] Add delete button and error notification styles to frontend/src/styles.css: style delete button (subtle, positioned right of todo row), style error banner/toast for failed operations (dismissible or auto-clear)
- [X] T031 Validate full quickstart.md flow end-to-end: run backend (cd backend && npm run dev), run frontend (cd frontend && npm run dev), open http://localhost:5173, perform all 6 quickstart verification steps (empty state → create → toggle → delete → refresh → mobile viewport)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Phase 2 completion
  - Stories proceed sequentially in priority order (US1 → US2 → US3 → US4)
  - US2–US4 each build on the shared files from prior phases (routes/todos.ts, useTodos.ts, TodoItem.tsx)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Unblocked after Phase 2 — no story dependencies
- **US2 (P2)**: Unblocked after Phase 2 — builds on US1 files (useTodos, App.tsx, routes)
- **US3 (P3)**: Unblocked after Phase 2 — builds on US1/US2 files (same route file, same hook, TodoItem)
- **US4 (P4)**: Unblocked after Phase 2 — builds on US1/US2/US3 files (same route file, same hook, TodoItem)

> Note: US2–US4 share `backend/src/routes/todos.ts`, `frontend/src/hooks/useTodos.ts`, and `frontend/src/components/TodoItem.tsx` — they MUST be implemented sequentially, not in parallel.

### Within Each User Story

- Backend route before frontend hook (contract drives implementation)
- Hook action before component (component calls hook)
- Component before prop threading (thread after component accepts the prop)

### Parallel Opportunities

- T002, T003, T004, T005 can all run in parallel with T001 (different files)
- T008, T010 can run in parallel within Phase 2
- T014, T016 can run in parallel within Phase 3 (TodoItem and styles are independent)
- T030 can run in parallel in Phase 7

---

## Parallel Example: Phase 1 Setup

```bash
# All can launch simultaneously (different files, no deps):
Task: T001 - backend/package.json + install
Task: T002 - backend/tsconfig.json + drizzle.config.ts
Task: T003 - frontend/package.json + install
Task: T004 - frontend/tsconfig.json + vite.config.ts
Task: T005 - .env files
```

## Parallel Example: User Story 1

```bash
# After T013 (TodoItem display-only), T014 and T016 can run simultaneously:
Task: T014 - frontend/src/components/TodoItem.tsx (display-only, no callbacks)
Task: T016 - frontend/src/styles.css (layout, states, media queries)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T010) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T011–T016)
4. **STOP and VALIDATE**: Open http://localhost:5173 — full list view with all states works
5. Demo if ready — read-only todo list is a complete, shippable increment

### Incremental Delivery

1. Setup + Foundational → app boots, API reachable
2. User Story 1 → working read-only todo list (MVP!)
3. User Story 2 → create todos, list grows
4. User Story 3 → toggle completion, full active/done workflow
5. User Story 4 → delete, full CRUD loop — complete app
6. Polish → visual refinement, final validation

---

## Notes

- [P] tasks = different files, no unresolved dependencies — safe to run concurrently
- [Story] label maps each task to the user story it delivers
- `backend/src/routes/todos.ts` grows across US1–US4; implement each handler as a new block in the same router file
- `frontend/src/hooks/useTodos.ts` grows across US1–US4; add each action incrementally
- `frontend/src/components/TodoItem.tsx` grows across US1, US3, US4; add props incrementally
- Commit after each checkpoint to preserve working increments
- Stop at any checkpoint to validate the story independently before continuing
