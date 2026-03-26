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
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'completed'
  >('all');

  // Завантаження todos при старті
  useEffect(() => {
    const loadTodos = async () => {
      setIsTodosLoading(true);
      const data = await getTodos();

      setTodos(data);
      setIsTodosLoading(false);
    };

    loadTodos();
  }, []);

  // Завантаження user при обраному todo
  useEffect(() => {
    if (!selectedTodo) {
      return;
    }

    const loadUser = async () => {
      setIsUserLoading(true);
      const data = await getUser(selectedTodo.userId);

      setUser(data);
      setIsUserLoading(false);
    };

    loadUser();
  }, [selectedTodo]);

  // Фільтрація todos
  const filteredTodos = todos
    .filter(todo => {
      if (filterStatus === 'completed') {
        return todo.completed;
      }

      if (filterStatus === 'active') {
        return !todo.completed;
      }

      return true;
    })
    .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                setQuery={setQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </div>

            <div className="block">
              {isTodosLoading && <Loader />}
              <TodoList
                todos={filteredTodos}
                onSelectTodo={setSelectedTodo}
                selectedTodo={selectedTodo}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={user}
          isLoading={isUserLoading}
          onClose={() => {
            setSelectedTodo(null);
            setUser(null);
          }}
        />
      )}
    </>
  );
};
