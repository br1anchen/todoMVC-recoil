import React, { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';

import { editingTodoIdState, todosState, filterState } from './recoil/atoms';
import { selectFilteredTodos, selectActiveTodoCount } from './recoil/selectors';
import {
  toggleAllTodo,
  toggleTodo,
  addTodo,
  removeTodo,
  updateTodo,
  clearCompleted,
} from './recoil/mutations';

const TodoApp = () => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const filteredTodos = useRecoilValue(selectFilteredTodos);
  const activeTodoCount = useRecoilValue(selectActiveTodoCount);
  const [todos, setTodos] = useRecoilState(todosState);
  const [editingTodoId, setEditingTodoId] = useRecoilState(editingTodoIdState);
  const filter = useRecoilValue(filterState);

  const handleSaveEditingTodo = useCallback(
    (newTitle: string) => {
      setTodos(updateTodo(editingTodoId!, { title: newTitle }));
      setEditingTodoId(null);
    },
    [editingTodoId, setTodos, setEditingTodoId]
  );

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== 13) {
      return;
    }

    event.preventDefault();

    if (newTodoTitle) {
      setTodos(addTodo(newTodoTitle));
      setNewTodoTitle('');
    }
  };

  const todoItems = filteredTodos.map((todo) => {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={(todoId) => setTodos(toggleTodo(todoId))}
        onDestroy={(todoId) => setTodos(removeTodo(todoId))}
        onEdit={setEditingTodoId}
        isEditing={editingTodoId === todo.id}
        onSave={handleSaveEditingTodo}
        onCancel={() => setEditingTodoId(null)}
      />
    );
  });

  const footer = todos.length > 0 && (
    <TodoFooter
      activeCount={activeTodoCount}
      completedCount={todos.length - activeTodoCount}
      filter={filter}
      onClearCompleted={() => setTodos(clearCompleted())}
    />
  );

  const main = todos.length > 0 && (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={(event) => setTodos(toggleAllTodo(event.target.checked))}
        checked={activeTodoCount === 0}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">{todoItems}</ul>
    </section>
  );

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      {main}
      {footer}
    </div>
  );
};

export default TodoApp;
