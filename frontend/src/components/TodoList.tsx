import { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onToggle?: (id: number, completed: boolean) => void;
  onDelete?: (id: number) => void;
}

export function TodoList({ todos, loading, error, onToggle, onDelete }: TodoListProps) {
  if (loading) {
    return <div className="loading">Loading todos…</div>;
  }

  if (error) {
    return <p className="error-banner">{error}</p>;
  }

  if (todos.length === 0) {
    return <p className="empty-state">No todos yet. Add one above!</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
