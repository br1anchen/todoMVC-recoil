import { selector } from 'recoil';

import { Todo, todosState, filterState } from './atoms';

export const selectFilteredTodos = selector<Todo[]>({
  key: 'selectFilteredTodos',
  get: ({ get }) => {
    const todos = get(todosState);
    const filter = get(filterState);

    return todos.filter((t) => {
      switch (filter) {
        case 'active':
          return !t.completed;
        case 'completed':
          return t.completed;
        default:
          return true;
      }
    });
  },
});

export const selectActiveTodoCount = selector<number>({
  key: 'selectActiveTodoCount',
  get: ({ get }) => {
    const todos = get(todosState);

    return todos.filter((t) => !t.completed).length;
  },
});
