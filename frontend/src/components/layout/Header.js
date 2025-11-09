import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Courses', path: '/goals' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Leaderboard', path: '/progress' },
    { name: 'Profile', path: '/profile' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-transparent border-b" style={{background: 'transparent'}}>
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow">
            <span className="text-white font-bold">SW</span>
          </div>
          <div>
            <Link to="/dashboard" className="text-xl font-semibold text-primary">SkillWise</Link>
            <div className="text-xs muted">AI-powered learning</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map(item => (
            <Link key={item.name} to={item.path} className="text-sm text-muted hover:text-primary">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <div className="text-sm">{user?.firstName || 'Guest'}</div>
            <div className="text-xs muted">{user?.email || ''}</div>
          </div>
          {user ? (
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Logout</button>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
