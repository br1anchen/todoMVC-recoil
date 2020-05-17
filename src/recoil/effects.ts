import { Todo } from './atoms';

import Utils from '../Utils';

const NAMESPACE = 'todoMVC-recoil';

export const storeTodos = (todos: Todo[]) => {
  Utils.store(NAMESPACE + '/todos', todos);
};

export const getTodos = (): Todo[] => {
  const store = localStorage.getItem(NAMESPACE + '/todos');
  return (store && JSON.parse(store)) || [];
};
