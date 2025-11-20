import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import DashboardShell from './components/dashboard/DashboardShell';
import Goals from './components/goals/Goals';
import Challenges from './components/challenges/Challenges';
import Progress from './components/progress/Progress';
import ProgressBarDemo from './components/progress/ProgressBarDemo';
import Profile from './components/profile/Profile';
import ErrorTestButton from './components/ErrorTestButton';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (loginData) => {
    console.log('Login success callback triggered:', loginData);
    login(loginData.user, loginData.token);

    // Force navigation to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 100);
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated() ?
              <Navigate to="/dashboard" replace /> :
              <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to SkillWise
                    </h1>
                    <p className="text-lg text-gray-600">
                    Sign in to your account
                    </p>
                  </div>
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                </div>
              </div>
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated() ?
              <Navigate to="/dashboard" replace /> :
              <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to SkillWise
                    </h1>
                    <p className="text-lg text-gray-600">
                    Your AI-powered learning platform
                    </p>
                  </div>
                  <SignupForm />
                </div>
              </div>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress-demo"
          element={
            <ProtectedRoute>
              <ProgressBarDemo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated() ?
              <Navigate to="/dashboard" replace /> :
              <Navigate to="/login" replace />
          }
        />
      </Routes>
    </div>
  );
};

function App () {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ErrorTestButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
