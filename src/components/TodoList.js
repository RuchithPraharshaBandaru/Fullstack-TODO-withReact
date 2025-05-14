import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import config from '../config';

const CATEGORIES = ['personal', 'work', 'shopping', 'health', 'other'];
const PRIORITIES = ['low', 'medium', 'high'];

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const CATEGORY_COLORS = {
  personal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  health: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

const PRIORITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1
};

function TodoList({ setIsAuthenticated }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.apiUrl}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${config.apiUrl}/api/todos`,
        { 
          text: newTodo,
          category: selectedCategory,
          priority: selectedPriority
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      console.log('New todo response:', response.data);
      setTodos(prevTodos => [response.data, ...prevTodos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error.response || error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`${config.apiUrl}/api/todos/${id}`,
        { completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos(prevTodos => prevTodos.map(todo =>
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error.response || error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiUrl}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const sortedAndFilteredTodos = React.useMemo(() => {
    return todos
      .filter(todo => {
        const categoryMatch = filterCategory === 'all' || todo.category === filterCategory;
        const priorityMatch = filterPriority === 'all' || todo.priority === filterPriority;
        return categoryMatch && priorityMatch;
      })
      .sort((a, b) => {
        // Sort by priority first (high to low)
        const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [todos, filterCategory, filterPriority]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12 transition-colors duration-200">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20 transition-colors duration-200">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 dark:text-gray-300 sm:text-lg sm:leading-7">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Todo List</h1>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {darkMode ? '🌞' : '🌙'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <form onSubmit={addTodo} className="mt-8 space-y-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Add a new todo"
                      className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="flex gap-4">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {PRIORITIES.map(priority => (
                          <option key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Add Todo
                    </button>
                  </div>
                </form>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-4">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="all">All Priorities</option>
                      {PRIORITIES.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {sortedAndFilteredTodos.map((todo) => (
                    <div
                      key={todo._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded mt-2 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                        />
                        <div className="flex flex-col">
                          <span className={`${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                            {todo.text}
                          </span>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${CATEGORY_COLORS[todo.category]}`}>
                              {todo.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${PRIORITY_COLORS[todo.priority]}`}>
                              {todo.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList; 