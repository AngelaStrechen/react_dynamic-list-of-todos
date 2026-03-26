/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos, getUser } from './api';
import { Todo } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'completed'
  >('all');

  // ================================
  // Функції завантаження даних
  // ================================

  async function loadTodos() {
    setIsLoading(true);
    const data = await getTodos();

    setTodos(data);
    setIsLoading(false);
  }

  async function loadUser(userId: number) {
    setIsLoading(true);
    const data = await getUser(userId);

    setUser(data);
    setIsLoading(false);
  }

  // ================================
  // useEffect для завантаження Todos при старті
  // ================================
  useEffect(() => {
    loadTodos();
  }, []);

  // useEffect для завантаження User при виборі Todo
  useEffect(() => {
    if (selectedTodo) {
      loadUser(selectedTodo.userId);
    }
  }, [selectedTodo]);

  // ================================
  // Фільтрація todos
  // ================================
  const filteredTodos = todos
    .filter(todo => {
      if (filterStatus === 'completed') {
        return todo.completed;
      }

      if (filterStatus === 'active') {
        return !todo.completed;
      }

      return true; // all
    })
    .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            {/* Фільтр */}
            <div className="block">
              <TodoFilter
                query={query}
                setQuery={setQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </div>

            {/* Loader і список Todos */}
            <div className="block">
              {isLoading && <Loader />}
              <TodoList
                todos={filteredTodos}
                onSelectTodo={setSelectedTodo}
                selectedTodo={selectedTodo} // щоб показувати eye/eye-slash
              />
            </div>
          </div>
        </div>
      </div>

      {/* Модалка для обраного Todo */}
      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={user}
          onClose={() => {
            setSelectedTodo(null);
            setUser(null);
          }}
        />
      )}
    </>
  );
};
