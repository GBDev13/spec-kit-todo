<!--
SYNC IMPACT REPORT
==================
Version change: UNVERSIONED → 1.0.0 (initial ratification)

Modified principles: N/A (initial creation)

Added sections:
  - Core Principles (5 principles)
  - Technical Scope & Exclusions
  - Development Workflow
  - Governance

Removed sections: N/A

Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check section is generic; no updates needed
  ✅ .specify/templates/spec-template.md — No constitution-specific tokens; no updates needed
  ✅ .specify/templates/tasks-template.md — No constitution-specific tokens; no updates needed

Follow-up TODOs: None. All placeholders resolved.
-->

# Todo App Constitution

## Core Principles

### I. Simplicity First

Every feature decision MUST default to the simplest solution that fulfills the requirement.
Unnecessary abstractions, premature generalizations, and over-engineered patterns are prohibited.
YAGNI (You Aren't Gonna Need It) applies at every layer: if a capability is not required by the
current scope, it MUST NOT be implemented. Complexity MUST be justified explicitly in a Complexity
Tracking table before it is introduced.

**Rationale**: The PRD explicitly mandates a "deliberately minimal scope" and a solution that is
"easy to understand, deploy, and extend." Complexity is the primary risk to this project's success.

### II. Core CRUD Completeness

The application MUST fully implement all four CRUD operations (Create, Read, Update/Complete,
Delete) for Todo items before any other feature work begins. Each operation MUST be:

- Backed by a persistent API endpoint with consistent response contracts.
- Reflected in the UI immediately upon success (optimistic or confirmed update — either is
  acceptable; be consistent).
- Covered by at least a basic error state (network failure, not-found, validation error).

**Rationale**: The product's sole purpose is reliable task management. A partial CRUD
implementation is not a shippable MVP.

### III. Responsive & Polished UX (NON-NEGOTIABLE)

The frontend MUST:

- Render correctly on desktop and mobile viewports (responsive layout required).
- Display distinct visual states for: empty list, loading, error, active tasks, and completed tasks.
- Reflect user actions (add, complete, delete) without requiring a page reload.
- Remain usable without any onboarding, tooltips, or user guidance — the interface MUST be
  self-evident.

**Rationale**: The PRD defines success as a user completing all core actions without guidance.
An unpolished or non-responsive UI directly fails this success criterion.

### IV. Data Durability & Error Resilience

The backend API MUST:

- Persist todo data across restarts and sessions using durable storage (a database, not in-memory).
- Return consistent HTTP status codes and structured error payloads.
- Validate all input at the API boundary and reject malformed requests with descriptive errors.

The frontend MUST:

- Handle API errors gracefully without crashing or showing blank screens.
- Never silently discard user actions — failures MUST be communicated to the user.

**Rationale**: The PRD requires "stability across refreshes and sessions" and "basic error handling
both client-side and server-side." Durable persistence is non-negotiable for a functional product.

### V. Future-Friendly, Not Future-Proof

The architecture MUST NOT prevent the addition of user authentication or multi-user support in
a future version. This means:

- The data model SHOULD include an optional `userId` or `ownerId` field (nullable/optional, not
  enforced in v1).
- API routes SHOULD follow a structure that can be scoped per-user in future (e.g., `/todos` can
  later become `/users/:id/todos` without a full rewrite).
- No singleton or hardcoded-user assumptions MUST be embedded in business logic.

This principle does NOT authorize implementing auth, multi-user logic, or any related feature
in v1. It only governs structural decisions that would be costly to undo later.

**Rationale**: The PRD explicitly states the architecture "should not prevent these features from
being added later." However, building them now violates Principle I (Simplicity First).

## Technical Scope & Exclusions

### In Scope (v1)

- Create, view, complete, and delete todo items.
- Each todo has: short text description, completion status, creation timestamp.
- Single-user experience (no authentication required).
- Full-stack: a REST API backend + a browser-based frontend.
- Responsive layout (desktop + mobile).
- Sensible empty, loading, and error states in the UI.
- Data persisted to a database across sessions.

### Explicitly Out of Scope (v1)

The following MUST NOT be implemented in v1, regardless of technical feasibility:

- User accounts, login, authentication, or authorization.
- Multi-user or collaborative features.
- Task prioritization, deadlines, reminders, or notifications.
- Tags, categories, or filtering beyond completion status.
- Bulk operations (e.g., "complete all", "delete completed").
- Offline support or local caching strategies.
- Real-time sync (WebSockets, SSE, etc.).

Any request to include these features MUST be deferred to a future version and documented.

## Development Workflow

- All features MUST be specified before implementation begins. Use `/speckit.specify` to create
  the spec, `/speckit.plan` to produce the implementation plan, and `/speckit.tasks` to generate
  the task list.
- Tasks MUST be organized by user story so each story can be implemented, tested, and validated
  independently.
- The MVP is defined as: a user can add a todo and see it listed. All other stories are layered
  on top of this core.
- Commits SHOULD be made at logical task boundaries (per task or per user story checkpoint).
- API contracts MUST be documented before implementation (in `contracts/` under the feature spec
  directory).
- No task is "done" until it works end-to-end — backend + frontend + persistence — for its user
  story.

## Governance

This constitution supersedes all other project practices and informal conventions. Any deviation
MUST be documented in the Complexity Tracking table of the relevant plan.md.

**Amendment procedure**:
1. Propose the change with a rationale and identify which principle(s) are affected.
2. Update this file, increment the version per semantic versioning rules.
3. Propagate changes to dependent templates per the Sync Impact Report format.
4. Commit with message: `docs: amend constitution to vX.Y.Z (<change summary>)`.

**Versioning policy**:
- MAJOR: Backward-incompatible removal or redefinition of a core principle.
- MINOR: New principle or section added, or material expansion of existing guidance.
- PATCH: Clarifications, wording, non-semantic refinements.

**Compliance**: All implementation plans MUST include a Constitution Check section that gates
progress on principle compliance. Any violation requires explicit justification.

**Version**: 1.0.0 | **Ratified**: 2026-03-12 | **Last Amended**: 2026-03-12
