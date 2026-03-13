# Quickstart: Core Todo Functionality

**Branch**: `001-core-todo`

## Prerequisites

- Node.js 20 LTS or later (`node --version`)
- npm 9+ (`npm --version`)

---

## 1. Backend setup

```bash
cd backend
npm install

# Generate and apply database migrations (creates todo.db)
npm run db:generate
npm run db:migrate

# Start development server (hot reload via ts-node-dev)
npm run dev
# → Listening on http://localhost:3001
```

**Environment** — create `backend/.env`:
```env
DATABASE_URL=./todo.db
PORT=3001
```

### Backend npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Express server with ts-node-dev (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled build (`node dist/server.js`) |
| `npm run db:generate` | Generate Drizzle migration files from schema |
| `npm run db:migrate` | Apply pending migrations to `todo.db` |
| `npm test` | Run Vitest integration tests (uses an in-memory test DB) |

---

## 2. Frontend setup

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
# → Local: http://localhost:5173
```

**Environment** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### Frontend npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm test` | Run Vitest component tests |

---

## 3. Run both together

Open two terminals from the repo root:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 4. Verify the installation

1. Open http://localhost:5173 — you should see the todo list with an empty state message.
2. Type a task and submit — it appears at the top of the list as active.
3. Click the checkbox — it toggles to completed (strikethrough text).
4. Click delete — the item is removed immediately.
5. Refresh the page — all todos are still present (persistence confirmed).
6. Open http://localhost:5173 on a mobile viewport — the layout should be fully responsive.
