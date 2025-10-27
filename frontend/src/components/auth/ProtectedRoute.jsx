// TODO: simple protected route wrapper
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, preserving attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
