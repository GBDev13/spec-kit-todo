# Research: Core Todo Functionality

**Phase**: 0 | **Date**: 2026-03-12 | **Branch**: `001-core-todo`

All NEEDS CLARIFICATION items from the Technical Context are resolved below.

---

## Backend Framework

**Decision**: Node.js + Express + TypeScript

**Rationale**: Shares a language with the frontend, minimizing context-switching across the full stack. Express is intentionally minimal (router + middleware only), directly aligned with constitution Principle I (Simplicity First). TypeScript provides compile-time safety for API contracts without runtime cost. Express scales gracefully to auth middleware later (Principle V) — adding an `authenticate` middleware to a route group is a one-line change.

**Alternatives considered**:
- Python + FastAPI: Excellent DX and automatic OpenAPI docs, but introduces Python into a project where the frontend will be TypeScript. Splitting languages increases context cost with no benefit for v1 scope.
- NestJS: Violates YAGNI directly — DI containers, decorators, and module boilerplate for 4 endpoints.
- Hono / Fastify: More performant but less ubiquitous. No performance requirement justifies departing from Express's ecosystem depth.

---

## Database

**Decision**: SQLite via Drizzle ORM

**Rationale**: Single file, zero infrastructure, zero configuration. ACID-compliant and production-quality. Fully satisfies Principle IV (Data Durability) with no operational overhead. Drizzle ORM is TypeScript-native, generates readable SQL, and supports both SQLite and PostgreSQL with the same schema definition — the v1→v2 database migration is a connection string and driver swap, nothing more (Principle V compliance).

**Alternatives considered**:
- PostgreSQL: Right choice for multi-user concurrent production apps. Mandates an external running service — unjustified complexity for a single-user v1. YAGNI.
- MongoDB: Document flexibility is not needed for a 4-field entity with a fixed schema.
- Raw `better-sqlite3` (no ORM): Valid and even simpler. Drizzle is chosen for its TypeScript type inference and zero-cost SQLite→Postgres migration path.
- In-memory / JSON file (`lowdb`): Explicitly prohibited by constitution Principle IV.

---

## Input Validation

**Decision**: Zod

**Rationale**: TypeScript-native schema validation. Integrates directly with Express middleware to validate request bodies at the API boundary (Principle IV). Schemas double as TypeScript type sources (`z.infer<>`), eliminating duplicate type declarations.

**Alternatives considered**:
- Joi: JavaScript-native, less ergonomic with TypeScript.
- `express-validator`: More verbose chain API for simple schemas.
- Manual `if` checks: Brittle and not a schema.

---

## Frontend Framework

**Decision**: React 18 + TypeScript

**Rationale**: The dominant SPA ecosystem with the largest learning-resource surface area — ideal for a study project. Component model maps directly to the 5 required UI states (loading, empty, error, active, completed). TypeScript ensures the Todo entity type flows from API response to UI without unsafe casting.

**Alternatives considered**:
- Vue 3: Comparable DX and good TypeScript support. No advantage for this scope; smaller ecosystem.
- Vanilla JS: Would require hand-rolling reactivity for instant UI updates. More ceremony for no benefit — violates Simplicity First in practice.

---

## Frontend State Management

**Decision**: `useTodos` custom hook (`useState`)

**Rationale**: The entire state surface is `todos: Todo[]`, `loading: boolean`, `error: string | null`. One custom hook covers it. No shared state crosses unrelated component trees. YAGNI prevents any external library.

**Alternatives considered**:
- Zustand: Good for cross-cutting global state. Overkill here — one hook suffices.
- Redux Toolkit: Unjustifiable boilerplate for 4 operations.
- TanStack Query: Excellent for cache invalidation and background refetch. Not in scope for v1.

---

## Styling

**Decision**: Plain CSS (single `styles.css` with mobile-first media queries)

**Rationale**: Responsive layout and 5 distinct visual states are fully achievable with plain CSS. Most transparent and educational choice for a study project where code clarity matters.

**Alternatives considered**:
- Tailwind CSS: Fast prototyping but utility-class markup obscures element semantics. Not ideal for a study project.
- CSS Modules: Appropriate for large apps to prevent class collisions. Unnecessary at this component count.
- Component libraries (MUI, shadcn): Bring their own API surface and styling systems — overkill, and obscures how layout/state classes work.

---

## Build Tool

**Decision**: Vite 5

**Rationale**: Current standard for greenfield React/TypeScript SPAs. Near-instant cold starts, native ESM in dev, minimal config. `npm create vite@latest` scaffolding produces an immediately understandable project structure.

**Alternatives considered**:
- Create React App: Deprecated. Webpack-based and slow.
- Next.js: Adds SSR, file-system routing, and server components not required by the spec. The spec requires a browser SPA, not a full-stack framework.

---

## Testing

**Decision**: Vitest + supertest (backend); Vitest + React Testing Library + msw (frontend)

**Rationale**: Vitest is zero-config for both Vite (frontend) and Node/TypeScript (backend), with a Jest-compatible API. React Testing Library enforces behavior-over-implementation testing, directly aligned with the spec's acceptance scenarios. `msw` intercepts at the network layer for more realistic component tests than mocking `fetch` directly.

**Alternatives considered**:
- Jest: Requires extra config for ESM and Vite transforms. Vitest is the simpler choice.
- Cypress / Playwright: E2E tools appropriate for full-stack integration testing. Can be added in a future iteration without displacing Vitest.
