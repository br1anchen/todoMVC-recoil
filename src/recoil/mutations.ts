import { Todo } from './atoms';

import Utils from '../Utils';

export const toggleAllTodo = (toggle: boolean) => (oldTodos: Todo[]) =>
  oldTodos.map((t) => {
    return { ...t, completed: toggle };
  });

export const toggleTodo = (todoId: Todo['id']) => (oldTodos: Todo[]) =>
  oldTodos.map((t) => {
    return t.id !== todoId ? t : { ...t, completed: !t.completed };
  });

export const addTodo = (title: Todo['title']) => (oldTodos: Todo[]) =>
  oldTodos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false,
  });

export const removeTodo = (todoId: Todo['id']) => (oldTodos: Todo[]) =>
  oldTodos.filter((t) => {
    return t.id !== todoId;
  });

export const updateTodo = (todoId: Todo['id'], changes: Partial<Todo>) => (
  oldTodos: Todo[]
) =>
  oldTodos.map((t) => {
    return t.id !== todoId ? t : { ...t, ...changes };
  });

export const clearCompleted = () => (oldTodos: Todo[]) =>
  oldTodos.filter((t) => {
    return !t.completed;
  });
