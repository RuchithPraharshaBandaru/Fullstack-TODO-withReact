import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/todos" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/todos" replace />} />
          <Route path="/todos" element={isAuthenticated ? <TodoList setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/todos" : "/login"} replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App; 