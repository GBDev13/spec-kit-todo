import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import './styles.css';

export default function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="container">
      <header>
        <h1>Todo List</h1>
      </header>
      <main>
        <TodoForm onAdd={addTodo} />
        <TodoList
          todos={todos}
          loading={loading}
          error={error}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  );
}
