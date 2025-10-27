import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  function handleFakeLogin() {
    setUser({ id: 1, email: 'student@example.com' });
    navigate(from, { replace: true });
  }

  return (
    <div>
      <h1>Login</h1>
      <p>Placeholder login page.</p>
      <button onClick={handleFakeLogin}>Fake Login</button>
    </div>
  );
}
