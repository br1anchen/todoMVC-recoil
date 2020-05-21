import { atom } from 'recoil';
import { getStoredState } from './localStorage';
import { routerAtom } from './router';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const todosState = atom<Todo[]>({
  key: 'todos',
  default: getStoredState('todos'),
  persistence_UNSTABLE: {
    type: 'url',
    validator: (storedValue, _defaultVal) => {
      return storedValue;
    },
  },
});

export const editingTodoIdState = atom<string | null>({
  key: 'editingTodoId',
  default: null,
});

export type TodoFilter = 'all' | 'active' | 'completed';
export const todoFilterState = routerAtom<TodoFilter>({
  path: '/:todoFilter',
  paramKey: 'todoFilter',
  default: 'all',
});
