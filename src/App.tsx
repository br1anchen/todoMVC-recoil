import React, { useCallback, useState } from 'react';

import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';

const App = () => {
  const { state, actions } = useOvermind();
  const [newTodo, setNewTodo] = useState<string>('');

  const handleToggleAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      actions.toggleAllTodo(event.target.checked);
    },
    [actions]
  );

  const handleNewTodoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodo(event.target.value);
    },
    [setNewTodo]
  );

  const handleNewTodoKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode !== 13) {
        return;
      }

      event.preventDefault();

      if (newTodo) {
        actions.addTodo(newTodo);
        setNewTodo('');
      }
    },
    [newTodo, actions]
  );

  const todoItems = state.filteredTodos.map((todo) => {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={actions.toggleTodo}
        onDestroy={actions.removeTodo}
        onEdit={actions.editingTodo}
        isEditing={state.editingTodoId === todo.id}
        onSave={actions.saveEditingTodo}
        onCancel={actions.cancelEditingTodo}
      />
    );
  });

  const footer = state.todos.length > 0 && (
    <TodoFooter
      activeCount={state.activeTodoCount}
      completedCount={state.todos.length - state.activeTodoCount}
      filter={state.filter}
      onClearCompleted={actions.clearCompleted}
    />
  );

  const main = state.todos.length > 0 && (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={handleToggleAll}
        checked={state.activeTodoCount === 0}
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
          value={newTodo}
          onChange={handleNewTodoChange}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      {main}
      {footer}
    </div>
  );
};

export default App;
