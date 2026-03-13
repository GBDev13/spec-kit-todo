import { Router } from 'express';
import { db } from '../db';
import { todos } from '../db/schema';
import { validate } from '../middleware/validate';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// GET /todos — retrieve all todos ordered by createdAt DESC
router.get('/', async (_req, res): Promise<void> => {
  try {
    const allTodos = await db.select().from(todos).orderBy(desc(todos.createdAt));
    res.json(allTodos);
  } catch {
    res.status(500).json({ error: 'Failed to load todos.' });
  }
});

// POST /todos — create a new todo
router.post(
  '/',
  validate(z.object({ text: z.string().trim().min(1, 'Todo text is required and must not be empty.').max(500) })),
  async (req, res): Promise<void> => {
    try {
      const [created] = await db.insert(todos).values({ text: req.body.text }).returning();
      res.status(201).json(created);
    } catch {
      res.status(500).json({ error: 'Failed to create todo.' });
    }
  }
);

// PATCH /todos/:id — toggle completion
router.patch(
  '/:id',
  validate(z.object({ completed: z.boolean({ required_error: 'completed must be a boolean.' }) })),
  async (req, res): Promise<void> => {
    const idResult = z.coerce.number().int().positive().safeParse(req.params.id);
    if (!idResult.success) {
      res.status(400).json({ error: 'Invalid id.' });
      return;
    }
    const id = idResult.data;
    try {
      const existing = await db.select().from(todos).where(eq(todos.id, id));
      if (existing.length === 0) {
        res.status(404).json({ error: 'Todo not found.' });
        return;
      }
      const [updated] = await db
        .update(todos)
        .set({ completed: req.body.completed })
        .where(eq(todos.id, id))
        .returning();
      res.json(updated);
    } catch {
      res.status(500).json({ error: 'Failed to update todo.' });
    }
  }
);

// DELETE /todos/:id — permanently delete a todo
router.delete('/:id', async (req, res): Promise<void> => {
  const idResult = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!idResult.success) {
    res.status(400).json({ error: 'Invalid id.' });
    return;
  }
  const id = idResult.data;
  try {
    const existing = await db.select().from(todos).where(eq(todos.id, id));
    if (existing.length === 0) {
      res.status(404).json({ error: 'Todo not found.' });
      return;
    }
    await db.delete(todos).where(eq(todos.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete todo.' });
  }
});

export default router;
