import React from 'react';
import Navigation from '../layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%)',
      position: 'relative'
    }}>
      {/* Floating decorations */}
      <div style={{position: 'absolute', top: '10%', left: '5%', fontSize: '60px', opacity: 0.3}}>☁️</div>
      <div style={{position: 'absolute', top: '20%', right: '10%', fontSize: '40px', opacity: 0.3}}>⭐</div>
      <div style={{position: 'absolute', bottom: '30%', left: '15%', fontSize: '50px', opacity: 0.3}}>✨</div>
      <div style={{position: 'absolute', bottom: '15%', right: '20%', fontSize: '55px', opacity: 0.3}}>👤</div>
      
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-3xl mx-auto">
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
              padding: '32px',
              borderRadius: '40px',
              marginBottom: '32px',
              boxShadow: '0 10px 30px rgba(251,191,36,0.3)'
            }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#1e3a8a',
                marginBottom: '8px',
                textAlign: 'center'
              }}>👤 My Profile</h1>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '30px',
              padding: '40px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '24px'}}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.4)'
                }}>
                  <span style={{color: 'white', fontSize: '40px', fontWeight: '900'}}>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 style={{fontSize: '32px', fontWeight: '900', color: '#1e3a8a', marginBottom: '8px'}}>
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p style={{fontSize: '16px', color: '#3b82f6', fontWeight: '600'}}>{user?.email}</p>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px'}}>
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                  padding: '24px',
                  borderRadius: '24px',
                  boxShadow: '0 4px 15px rgba(251,191,36,0.3)'
                }}>
                  <h3 style={{fontSize: '20px', fontWeight: '700', color: '#1e3a8a', marginBottom: '20px'}}>📋 Account Info</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div>
                      <label style={{fontSize: '12px', fontWeight: '600', color: '#1e40af', textTransform: 'uppercase'}}>First Name</label>
                      <p style={{fontSize: '16px', fontWeight: '700', color: '#1e3a8a', marginTop: '4px'}}>{user?.firstName}</p>
                    </div>
                    <div>
                      <label style={{fontSize: '12px', fontWeight: '600', color: '#1e40af', textTransform: 'uppercase'}}>Last Name</label>
                      <p style={{fontSize: '16px', fontWeight: '700', color: '#1e3a8a', marginTop: '4px'}}>{user?.lastName}</p>
                    </div>
                    <div>
                      <label style={{fontSize: '12px', fontWeight: '600', color: '#1e40af', textTransform: 'uppercase'}}>Email</label>
                      <p style={{fontSize: '16px', fontWeight: '700', color: '#1e3a8a', marginTop: '4px'}}>{user?.email}</p>
                    </div>
                    <div>
                      <label style={{fontSize: '12px', fontWeight: '600', color: '#1e40af', textTransform: 'uppercase'}}>Member Since</label>
                      <p style={{fontSize: '16px', fontWeight: '700', color: '#1e3a8a', marginTop: '4px'}}>
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                  padding: '24px',
                  borderRadius: '24px',
                  boxShadow: '0 4px 15px rgba(167,139,250,0.3)',
                  color: 'white'
                }}>
                  <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '20px'}}>📊 Learning Stats</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '14px', fontWeight: '600'}}>Active Goals</span>
                      <span style={{fontSize: '24px', fontWeight: '900'}}>0</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '14px', fontWeight: '600'}}>Completed Challenges</span>
                      <span style={{fontSize: '24px', fontWeight: '900'}}>0</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '14px', fontWeight: '600'}}>Current Streak</span>
                      <span style={{fontSize: '24px', fontWeight: '900'}}>0 🔥</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '14px', fontWeight: '600'}}>Total Points</span>
                      <span style={{fontSize: '24px', fontWeight: '900'}}>0 ⭐</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '32px',
                paddingTop: '32px',
                borderTop: '2px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <h3 style={{fontSize: '20px', fontWeight: '700', color: '#1e3a8a', marginBottom: '16px'}}>⚙️ Settings</h3>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '20px'}}>
                  Profile editing and settings will be available in a future update.
                </p>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'not-allowed',
                    opacity: 0.6
                  }}
                  disabled
                >
                  Edit Profile (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
