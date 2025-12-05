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
              <LoginForm onLoginSuccess={handleLoginSuccess} />
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated() ?
              <Navigate to="/dashboard" replace /> :
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%)',
                padding: '20px'
              }}>
                <div style={{maxWidth: '1200px', width: '100%'}}>
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '48px',
                    padding: '32px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                    borderRadius: '32px',
                    border: '4px solid #f59e0b',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{fontSize: '72px', marginBottom: '16px'}}>🎓</div>
                    <h1 style={{fontSize: '56px', fontWeight: '900', color: '#1e3a8a', marginBottom: '12px', lineHeight: '1.1'}}>
                      Welcome to SkillWise
                    </h1>
                    <p style={{fontSize: '24px', color: '#6b7280', fontWeight: '700'}}>
                      🚀 Your AI-powered learning platform
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
