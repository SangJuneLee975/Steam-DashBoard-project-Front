import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isLoggedInState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import TodoModal from './TodoModal';
import '../css/TodoListPage.css';
import { startSpeechRecognition } from './speechRecognition';

const TodoListPage = () => {
  const [isLoggedIn] = useRecoilState(isLoggedInState);
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); //

  // 할 일 목록을 가져오는 함수
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      axiosInstance
        .get('/api/todos')
        .then((response) => {
          setTodos(response.data); // 가져온 할 일 목록을 상태에 저장
        })
        .catch((error) => {
          console.error('Error fetching todos:', error);
        });
    }
  }, [isLoggedIn, navigate]);

  // 새로운 할 일을 추가하기 위한 함수
  const addTodo = () => {
    setSelectedTodo({ title: '', description: '', isCompleted: false });
    setShowModal(true);
  };

  // 할 일을 저장하는 함수
  const saveTodo = (todo) => {
    if (todo.id) {
      axiosInstance
        .put(`/api/todos/${todo.id}`, todo)
        .then((response) => {
          setTodos(todos.map((t) => (t.id === todo.id ? response.data : t)));
        })
        .catch((error) => {
          console.error('Error updating todo:', error);
        });
    } else {
      axiosInstance
        .post('/api/todos', todo)
        .then((response) => {
          setTodos([...todos, response.data]);
        })
        .catch((error) => {
          console.error('Error adding todo:', error);
        });
    }
    setShowModal(false);
  };

  // 할 일을 삭제하는 함수
  const deleteTodo = (id) => {
    axiosInstance
      .delete(`/api/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting todo:', error);
      });
  };

  // 할 일 완료 여부를 토글하는 함수
  const toggleTodoCompletion = (id) => {
    const todo = todos.find((t) => t.id === id);
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };

    console.log('Toggling completion:', updatedTodo);

    axiosInstance
      .put(`/api/todos/${id}`, updatedTodo)
      .then((response) => {
        setTodos(todos.map((t) => (t.id === id ? response.data : t)));
      })
      .catch((error) => {
        console.error('Error toggling completion:', error);
      });
  };

  // 완료된 할 일 목록과 미완료 할 일 목록 구분
  const completedTodos = todos.filter((todo) => todo.isCompleted); // 완료된 할 일 목록
  const activeTodos = todos.filter((todo) => !todo.isCompleted); // 미완료 할 일 목록

  return (
    <div className="todo-background">
      <div className="todo-list-container">
        <h1></h1>
        <div>
          <button className="add-todo-button" onClick={addTodo}>
            ➕ 할 일 추가하기
          </button>
        </div>

        <ul className="todo-list">
          {activeTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div className="todo-row">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => toggleTodoCompletion(todo.id)}
                  className="checkbox"
                />
                <div className="todo-content">
                  <div
                    className={`todo-title ${
                      todo.isCompleted ? 'todo-completed' : ''
                    }`}
                  >
                    {todo.title}
                  </div>
                  <div
                    className={`todo-description ${
                      todo.isCompleted ? 'todo-completed' : ''
                    }`}
                  >
                    {todo.description || ''}
                  </div>
                </div>
                <div className="todo-actions">
                  <AiFillEdit
                    className="todo-icon edit-icon"
                    onClick={() => {
                      setSelectedTodo(todo);
                      setShowModal(true);
                    }}
                  />
                  <AiFillDelete
                    className="todo-icon delete-icon"
                    onClick={() => deleteTodo(todo.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="completed-todos-section">
          <h3>완료됨({completedTodos.length}개)</h3>
          <ul className="todo-list">
            {completedTodos.length > 0 ? (
              completedTodos.map((todo) => (
                <li key={todo.id} className="completed-todo-item">
                  <div className="todo-row">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => toggleTodoCompletion(todo.id)}
                      className="checkbox"
                    />
                    <div className="todo-content">
                      <div className="todo-title">{todo.title}</div>
                      <div className="todo-description">
                        {todo.description || ''}
                      </div>
                    </div>
                    <div className="todo-actions">
                      <AiFillEdit
                        className="todo-icon edit-icon"
                        onClick={() => {
                          setSelectedTodo(todo);
                          setShowModal(true);
                        }}
                      />
                      <AiFillDelete
                        className="todo-icon delete-icon"
                        onClick={() => deleteTodo(todo.id)}
                      />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="todo-item">
                <div className="todo-row"></div>
              </li>
            )}
          </ul>
        </div>

        {showModal && (
          <TodoModal
            todo={selectedTodo}
            onSave={saveTodo}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TodoListPage;
