import React, { useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

const TodoItem = ({ todo, onDelete, onEdit }) => {
  return (
    <div className="todo-item">
      <div className="todo-content">
        <h3>{todo.title}</h3>
        <p>{todo.description || ''}</p>
      </div>
      <div className="todo-actions">
        <AiFillEdit
          onClick={() => onEdit(todo)}
          style={{ cursor: 'pointer', marginRight: '10px' }}
        />
        <AiFillDelete
          onClick={() => onDelete(todo.id)}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default TodoItem;
