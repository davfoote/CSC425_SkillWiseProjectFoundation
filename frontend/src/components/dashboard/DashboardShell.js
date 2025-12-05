import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';

const DashboardShell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Updated: Nov 20, 2025 - 2:02 PM - CLEAN HORIZONTAL LAYOUT */}
      <Navigation />

      {/* Decorative Elements */}
      <div style={{position: 'absolute', top: '50px', left: '5%', fontSize: '60px', opacity: 0.3}}>☁️</div>
      <div style={{position: 'absolute', top: '100px', right: '10%', fontSize: '40px', opacity: 0.4}}>⭐</div>
      <div style={{position: 'absolute', top: '200px', left: '15%', fontSize: '30px', opacity: 0.3}}>✨</div>
      <div style={{position: 'absolute', bottom: '150px', right: '5%', fontSize: '50px', opacity: 0.3}}>☁️</div>
      <div style={{position: 'absolute', top: '300px', right: '20%', fontSize: '35px', opacity: 0.4}}>⭐</div>

      {/* Hero Header Section */}
      <div className="w-full px-6 lg:px-12 py-8">
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
            borderRadius: '40px',
            padding: '40px 60px',
            maxWidth: '700px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            border: '4px solid rgba(251, 146, 60, 0.5)',
            position: 'relative',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#1e3a8a',
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              Welcome back, {user?.firstName}!
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#1e40af',
              fontWeight: '500'
            }}>
              Ready to continue your learning journey? Let's make today count
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-6 lg:px-12 py-8" style={{position: 'relative', zIndex: 1}}>
        {/* Stats Grid - Fun circular badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
            borderRadius: '50%',
            width: '180px',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(251, 146, 60, 0.4)',
            border: '5px solid white'
          }}>
            <p style={{fontSize: '48px', fontWeight: '900', color: 'white', margin: 0}}>0</p>
            <p style={{fontSize: '16px', fontWeight: '700', color: 'white', margin: 0}}>days</p>
            <p style={{fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginTop: '5px'}}>Current Streak</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: '50%',
            width: '180px',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)',
            border: '5px solid white'
          }}>
            <p style={{fontSize: '48px', fontWeight: '900', color: 'white', margin: 0}}>0</p>
            <p style={{fontSize: '14px', fontWeight: '700', color: 'white', marginTop: '5px'}}>Completed</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
            borderRadius: '50%',
            width: '180px',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
            border: '5px solid white'
          }}>
            <p style={{fontSize: '48px', fontWeight: '900', color: 'white', margin: 0}}>0</p>
            <p style={{fontSize: '14px', fontWeight: '700', color: 'white', marginTop: '5px'}}>Challenges Taken</p>
          </div>
        </div>

        {/* Main Content Grid - Side by side panels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '30% 40% 30%',
          gap: '24px'
        }}>
          {/* Quick Actions */}
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '900', color: '#1e3a8a', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>Quick Actions</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <button onClick={() => navigate('/goals')} style={{
                background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
                border: 'none',
                borderRadius: '20px',
                padding: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }} onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(236, 72, 153, 0.4)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(236, 72, 153, 0.3)';
              }}>
                <div style={{fontSize: '40px'}}>🏆</div>
                <div style={{textAlign: 'left', flex: 1}}>
                  <h3 style={{color: 'white', fontSize: '18px', fontWeight: '700', margin: 0}}>Create Goal</h3>
                  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '13px', margin: '3px 0 0 0'}}>Set learning objectives</p>
                </div>
              </button>

              <button onClick={() => navigate('/challenges')} style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                border: 'none',
                borderRadius: '20px',
                padding: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }} onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.4)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.3)';
              }}>
                <div style={{fontSize: '40px'}}>🔥</div>
                <div style={{textAlign: 'left', flex: 1}}>
                  <h3 style={{color: 'white', fontSize: '18px', fontWeight: '700', margin: 0}}>Take Challenge</h3>
                  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '13px', margin: '3px 0 0 0'}}>Practice your skills</p>
                </div>
              </button>

              <button onClick={() => navigate('/progress')} style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
                border: 'none',
                borderRadius: '20px',
                padding: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }} onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
              }}>
                <div style={{fontSize: '40px'}}>📊</div>
                <div style={{textAlign: 'left', flex: 1}}>
                  <h3 style={{color: 'white', fontSize: '18px', fontWeight: '700', margin: 0}}>View Progress</h3>
                  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '13px', margin: '3px 0 0 0'}}>Track achievements</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity Chart */}
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '25px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              border: '3px solid rgba(255, 255, 255, 0.8)'
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{fontSize: '24px', fontWeight: '900', color: '#1e3a8a', margin: 0}}>Recent Activity</h2>
                <select style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#4b5563',
                  background: 'white'
                }}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="text-center py-12">
                <div className="text-6xl mb-3">📈</div>
                <p style={{color: '#6b7280', fontWeight: '600', marginBottom: '8px'}}>No activity yet</p>
                <p style={{fontSize: '14px', color: '#9ca3af'}}>Start working on goals and challenges to see your progress here.</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {/* Learning Goals Widget */}
              <div style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '25px',
                padding: '25px',
                boxShadow: '0 10px 25px rgba(251, 191, 36, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.5)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{fontSize: '20px', fontWeight: '900', color: 'white', margin: 0}}>Learning Goals</h3>
                </div>
                <div className="text-center py-4">
                  <div style={{fontSize: '50px', marginBottom: '10px'}}>⭐</div>
                  <p style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '15px'}}>Create First Goal</p>
                  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '13px'}}>No goals yet</p>
                </div>
              </div>

              {/* Challenges Widget */}
              <div style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                borderRadius: '25px',
                padding: '25px',
                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.5)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{fontSize: '20px', fontWeight: '900', color: 'white', margin: 0}}>Challenges</h3>
                </div>
                <div className="text-center py-4">
                  <div style={{fontSize: '50px', marginBottom: '10px'}}>💪</div>
                  <p style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '15px'}}>Browse Challenges</p>
                  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '13px'}}>No challenges yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
