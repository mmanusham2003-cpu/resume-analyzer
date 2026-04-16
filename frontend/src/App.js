import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import Home from './pages/Home';

function App() {
  return (
    <>
      {/* Animated mesh background */}
      <div className="bg-gradient-mesh" />

      {/* Navigation */}
      <Navbar />

      {/* Main content area below fixed navbar */}
      <main style={{ paddingTop: '72px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzer"
            element={
              <ProtectedRoute>
                <Analyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyzer/:id"
            element={
              <ProtectedRoute>
                <Analyzer />
              </ProtectedRoute>
            }
          />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-family)',
        }}
      />
    </>
  );
}

export default App;