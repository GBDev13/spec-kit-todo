# Data Model: Core Todo Functionality

**Phase**: 1 | **Date**: 2026-03-12 | **Branch**: `001-core-todo`

## Entities

### Todo

The sole entity in v1. Represents a single task managed by the user.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | integer (auto-increment) | NOT NULL, PRIMARY KEY | Auto-assigned by SQLite; exposed as `number` in API and frontend |
| `text` | string | NOT NULL, min 1 char (trimmed), max 500 chars | Whitespace-only input rejected at API boundary via Zod |
| `completed` | boolean | NOT NULL, default `false` | Stored as SQLite integer (0/1); Drizzle maps to JS boolean |
| `createdAt` | string (ISO 8601) | NOT NULL, auto-set on insert | Populated by Drizzle `$defaultFn`; e.g., `"2026-03-12T10:00:00.000Z"` |
| `userId` | string (UUID) | NULLABLE | Not enforced in v1. Reserved for future multi-user support per Principle V. |

---

## Schema Definitions

**Drizzle schema** (`backend/src/db/schema.ts`):

```typescript
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  text:      text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  userId:    text('user_id'),
});

export type Todo    = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
```

**Frontend interface** (`frontend/src/types.ts`):

```typescript
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  userId?: string | null;
}
```

---

## Validation Rules

| Rule | Operation | Enforcement |
|------|-----------|-------------|
| `text` must not be empty or whitespace-only | POST /todos | Zod: `z.string().trim().min(1)` at API boundary; also client-side for inline feedback |
| `text` max 500 characters | POST /todos | Zod: `.max(500)` |
| `completed` must be a boolean | PATCH /todos/:id | Zod: `z.boolean()` |
| `id` must be a positive integer | PATCH, DELETE /todos/:id | Express route param coercion + Zod `z.coerce.number().int().positive()` |

---

## State Transitions

```
created
  │
  ▼
[active: completed=false]
  │  ◀──── toggle ────┐
  └──── toggle ───▶  [completed: completed=true]
  │
  └──── delete ───▶  (removed permanently)
```

- A todo is created in the **active** state (`completed: false`).
- `completed` toggles between `true` and `false` on each PATCH request — the frontend sends the new desired value.
- Deletion is permanent. No soft-delete or trash in v1.

---

## Display Order

Todos are returned from the API ordered by `createdAt DESC` (newest first), matching the spec assumption: "Todos are displayed in reverse-chronological order by default."
