import { useState, FormEvent } from 'react';

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setInputError('Todo text cannot be empty.');
      return;
    }
    setInputError(null);
    await onAdd(trimmed);
    setText('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={500}
        aria-label="New todo text"
      />
      <button type="submit">Add</button>
      {inputError && <p className="input-error">{inputError}</p>}
    </form>
  );
}
