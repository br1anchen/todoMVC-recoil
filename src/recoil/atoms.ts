import { atom } from 'recoil';
import { getTodos, getFilterByUrl } from './effects';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const todosState = atom<Todo[]>({
  key: 'todos',
  default: getTodos(),
  persistence_UNSTABLE: {
    type: 'url',
    validator: (newVal, defaultVal) => {
      console.log('newVal: ', newVal);
      console.log('defaultVal: ', defaultVal);
      return newVal;
    },
  },
});

export type TodoFilter = 'all' | 'active' | 'completed';

export const filterState = atom<TodoFilter>({
  key: 'todoFilter',
  default: getFilterByUrl(),
});

export const editingTodoIdState = atom<string | null>({
  key: 'editingTodoId',
  default: null,
});
