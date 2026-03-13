export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  userId?: string | null;
}
