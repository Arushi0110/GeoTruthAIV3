import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UploadNews from './pages/UploadNews';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import Footer from './components/Footer';
import Notification from './components/Notification';
import PublicLayout from './components/PublicLayout';
import ProtectedLayout from './components/ProtectedLayout';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Smart root redirect: guests → /login, logged-in → /home
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 animate-pulse">Loading…</div>;
  return user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

const AppContent = ({ showNotification }) => {
  return (
    <Routes>
      {/* ROOT – smart redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* PUBLIC ROUTES - no navbar/footer */}
      <Route path="/login" element={
        <PublicLayout>
          <Login showNotification={showNotification} />
        </PublicLayout>
      } />
      <Route path="/signup" element={
        <PublicLayout>
          <Signup showNotification={showNotification} />
        </PublicLayout>
      } />
      <Route path="/forgot-password" element={
        <PublicLayout>
          <ForgotPassword showNotification={showNotification} />
        </PublicLayout>
      } />

      {/* PROTECTED ROUTES */}
      <Route path="/home" element={
        <ProtectedLayout>
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        </ProtectedLayout>
      } />
      <Route path="/dashboard" element={
        <ProtectedLayout>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </ProtectedLayout>
      } />
      <Route path="/verify" element={
        <ProtectedLayout>
          <ProtectedRoute>
            <UploadNews showNotification={showNotification} />
          </ProtectedRoute>
        </ProtectedLayout>
      } />
      <Route path="/analytics" element={
        <ProtectedLayout>
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        </ProtectedLayout>
      } />
      <Route path="/profile" element={
        <ProtectedLayout>
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </ProtectedLayout>
      } />

      {/* 404 – smart redirect */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};

const App = () => {
  const [notification, setNotification] = useState(null);
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const handleApiError = (e) => {
      showNotification('error', e.detail.message);
    };
    window.addEventListener('api-error', handleApiError);
    return () => window.removeEventListener('api-error', handleApiError);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent showNotification={showNotification} />
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;

