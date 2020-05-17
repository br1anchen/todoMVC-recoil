import React, { useState, useCallback } from 'react';
import cn from 'classnames';

import { Todo } from '../overmind/state';

interface Props {
  todo: Todo;
  isEditing?: boolean;
  onSave: (val: string) => void;
  onDestroy: (id: string) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onToggle: (id: string) => void;
}

const TodoItem = ({
  todo,
  isEditing,
  onSave,
  onDestroy,
  onEdit,
  onCancel,
  onToggle,
}: Props) => {
  const [editText, setEditText] = useState<string>(todo.title);

  const handleToggleChange = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo]);

  const handleEdit = useCallback(() => {
    onEdit(todo.id);
    setEditText(todo.title);
  }, [todo, onEdit, setEditText]);

  const handleDestroy = useCallback(() => {
    onDestroy(todo.id);
  }, [todo, onDestroy]);

  const handleSubmit = useCallback(() => {
    const val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val);
    } else {
      onDestroy(todo.id);
    }
  }, [editText, onSave, setEditText, onDestroy, todo]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditText(event.target.value);
    },
    [setEditText]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode === 27) {
        setEditText(todo.title);
        onCancel(todo.id);
      } else if (event.keyCode === 13) {
        handleSubmit();
      }
    },
    [setEditText, todo, onCancel, handleSubmit]
  );

  return (
    <li
      className={cn({
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleChange}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy} />
      </div>
      <input
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default TodoItem;
