import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';

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
              <Dashboard />
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
