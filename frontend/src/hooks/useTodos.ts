import { useState, useEffect } from 'react';
import { Todo } from '../types';
import * as api from '../api/todos';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number, completed: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getTodos()
      .then((data) => {
        setTodos(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load todos.');
      })
      .finally(() => setLoading(false));
  }, []);

  async function addTodo(text: string): Promise<void> {
    try {
      const created = await api.createTodo(text);
      setTodos((prev) => [created, ...prev]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create todo.');
    }
  }

  async function toggleTodo(id: number, completed: boolean): Promise<void> {
    try {
      const updated = await api.toggleTodo(id, completed);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update todo.');
    }
  }

  async function deleteTodo(id: number): Promise<void> {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo.');
    }
  }

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo };
}
