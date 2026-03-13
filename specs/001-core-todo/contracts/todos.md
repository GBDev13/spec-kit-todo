# API Contract: Todos

**Resource**: `/todos`
**Version**: v1
**Auth**: None (single-user; no authentication in v1)
**Base URL**: `http://localhost:3001` (development)
**Content-Type**: `application/json`

---

## Endpoints

### GET /todos

Retrieve all todos, ordered by creation date descending (newest first).

**Request**: No body, no query parameters.

**Response 200 OK**:
```json
[
  {
    "id": 1,
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2026-03-12T10:00:00.000Z",
    "userId": null
  }
]
```

**Response — empty list**: `200 OK` with `[]`

**Response 500**:
```json
{ "error": "Failed to load todos." }
```

---

### POST /todos

Create a new todo. Responds with the created resource.

**Request body**:
```json
{ "text": "Buy groceries" }
```

**Validation**:
- `text`: required, string, non-empty after trimming, max 500 characters.

**Response 201 Created**:
```json
{
  "id": 2,
  "text": "Buy groceries",
  "completed": false,
  "createdAt": "2026-03-12T10:05:00.000Z",
  "userId": null
}
```

**Response 400** (validation failure):
```json
{ "error": "Todo text is required and must not be empty." }
```

**Response 500**:
```json
{ "error": "Failed to create todo." }
```

---

### PATCH /todos/:id

Update the completion status of a todo.

**Path parameter**: `id` — positive integer.

**Request body**:
```json
{ "completed": true }
```

**Validation**:
- `completed`: required, boolean.

**Response 200 OK**:
```json
{
  "id": 2,
  "text": "Buy groceries",
  "completed": true,
  "createdAt": "2026-03-12T10:05:00.000Z",
  "userId": null
}
```

**Response 400** (validation failure):
```json
{ "error": "completed must be a boolean." }
```

**Response 404** (not found):
```json
{ "error": "Todo not found." }
```

**Response 500**:
```json
{ "error": "Failed to update todo." }
```

---

### DELETE /todos/:id

Permanently delete a todo.

**Path parameter**: `id` — positive integer.

**Request body**: None.

**Response 204 No Content**: Empty body.

**Response 404** (not found):
```json
{ "error": "Todo not found." }
```

**Response 500**:
```json
{ "error": "Failed to delete todo." }
```

---

## Error Response Shape

All error responses use this shape:
```json
{ "error": "<human-readable message>" }
```

| Status | Meaning |
|--------|---------|
| 200 | Success with body |
| 201 | Resource created |
| 204 | Success, no body (delete) |
| 400 | Validation error (client fault) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## CORS

The backend MUST allow cross-origin requests from the Vite dev server origin (`http://localhost:5173`) during development. Configure `cors` middleware in `app.ts`:

```typescript
import cors from 'cors';
app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173' }));
```

---

## Future Extensibility Note

Routes are at `/todos`. When multi-user support is added, routes can be re-scoped to `/users/:userId/todos` with minimal changes to existing handlers. The `userId` field in each Todo response is reserved for this transition.
