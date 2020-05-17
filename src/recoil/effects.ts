import { Todo, TodoFilter } from './atoms';

import Utils from '../Utils';

const NAMESPACE = 'todoMVC-recoil';

export const storeTodos = (todos: Todo[]) => {
  Utils.store(NAMESPACE + '/todos', todos);
};

export const getTodos = (): Todo[] => {
  const store = localStorage.getItem(NAMESPACE + '/todos');
  return (store && JSON.parse(store)) || [];
};

export const getFilterByUrl = (): TodoFilter => {
  const hash = window.location.hash.slice(1);
  switch (hash) {
    case 'active':
      return 'active';
    case 'completed':
      return 'completed';
    default:
      return 'all';
  }
};
