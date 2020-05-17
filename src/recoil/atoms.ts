import { atom } from 'recoil';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const todosState = atom<Todo[]>({
  key: 'todos',
  default: [],
});

export type TodoFilter = 'all' | 'active' | 'completed';

export const filterState = atom<TodoFilter>({
  key: 'todoFilter',
  default: 'all',
});

export const editingTodoIdState = atom<string | null>({
  key: 'editingTodoId',
  default: null,
});
