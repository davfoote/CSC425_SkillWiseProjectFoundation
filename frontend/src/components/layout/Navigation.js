import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Goals', path: '/goals', icon: '🎯' },
    { name: 'Challenges', path: '/challenges', icon: '💪' },
    { name: 'Progress', path: '/progress', icon: '📊' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      borderBottom: '4px solid rgba(255,255,255,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Large App Name */}
          <div className="flex items-center">
            <h1 style={{
              fontSize: '36px',
              fontWeight: '900',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              SkillWise
            </h1>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center space-x-2 flex-1 justify-center px-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isActive(item.path) 
                    ? 'rgba(255,255,255,0.95)' 
                    : 'rgba(255,255,255,0.15)',
                  color: isActive(item.path) ? '#1e40af' : 'white',
                  boxShadow: isActive(item.path) ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* User Menu - Clean and Simple */}
          <div className="flex items-center space-x-3">
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '50px',
              padding: '8px 20px 8px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700'
                }}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div style={{textAlign: 'left'}}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1e3a8a',
                  margin: 0
                }}>
                  {user?.firstName}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                e.currentTarget.style.color = '#1e40af';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'white';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
