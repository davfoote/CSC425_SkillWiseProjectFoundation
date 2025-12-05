import React, { useState, useEffect } from 'react';
import Navigation from '../layout/Navigation';
import ProgressBar from './ProgressBar';
import progressService from '../../services/progressService';

const Progress = () => {
  const [progressData, setProgressData] = useState({
    overall: { percentage: 0, completed: 0, total: 0 },
    goals: { percentage: 0, completed: 0, total: 0 },
    challenges: { percentage: 0, completed: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load progress data
  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await progressService.calculateOverallProgress();
      setProgressData(data);

    } catch (err) {
      console.error('Error loading progress:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  // Simulate challenge completion for demo
  const handleMarkChallengeComplete = async () => {
    try {
      const updatedProgress = await progressService.updateChallengeCompletion('demo-challenge', true);
      setProgressData(updatedProgress);

      // Show success message (could be replaced with toast notification)
      alert('Challenge marked as complete! Progress updated.');

    } catch (err) {
      console.error('Error updating challenge:', err);
      alert('Error updating progress. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading progress...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
      <div style={{position: 'absolute', bottom: '15%', right: '20%', fontSize: '55px', opacity: 0.3}}>📊</div>
      
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Header */}
          <div className="text-center mb-8">
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
              padding: '40px',
              borderRadius: '40px',
              marginBottom: '32px',
              boxShadow: '0 10px 30px rgba(251,191,36,0.3)'
            }}>
              <div style={{fontSize: '80px', marginBottom: '16px'}}>📊</div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#1e3a8a',
                marginBottom: '16px'
              }}>Learning Progress</h1>
              <p style={{fontSize: '18px', color: '#1e40af', fontWeight: '600'}}>
                Track your achievements and see how far you've come on your learning journey!
              </p>
            </div>
            {error && (
              <div style={{
                marginTop: '16px',
                background: 'rgba(254,202,202,0.9)',
                border: '2px solid #f87171',
                color: '#991b1b',
                padding: '16px 24px',
                borderRadius: '20px',
                fontWeight: '600'
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Overall Progress - Large Circular */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            padding: '40px',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '32px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
              padding: '16px 24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)'
            }}>📊 Overall Progress</h2>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
              <ProgressBar
                percentage={progressData.overall.percentage}
                total={progressData.overall.total}
                completed={progressData.overall.completed}
                title="Overall Progress"
                type="circular"
                size="large"
                animated={true}
              />
            </div>
            <div style={{marginTop: '24px', textAlign: 'center'}}>
              <p style={{color: '#1e3a8a', fontSize: '20px', fontWeight: '600'}}>
                You've completed <span style={{fontWeight: '900', color: '#059669', fontSize: '24px'}}>{progressData.overall.completed}</span> out of{' '}
                <span style={{fontWeight: '900', color: '#3b82f6', fontSize: '24px'}}>{progressData.overall.total}</span> total items
              </p>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* Goals Progress */}
            <div style={{
              background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
              borderRadius: '30px',
              boxShadow: '0 8px 24px rgba(192, 132, 252, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(192, 132, 252, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(192, 132, 252, 0.3)';
            }}>
            <div style={{
              padding: '32px'
            }}>
              <h3 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>🎯 Goals Progress</h3>
              <ProgressBar
                percentage={progressData.goals.percentage}
                total={progressData.goals.total}
                completed={progressData.goals.completed}
                title="Goals Completed"
                type="linear"
                showStats={true}
                animated={true}
                color="#10B981"
              />
              <div style={{marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div style={{textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '20px'}}>
                  <div style={{fontWeight: '900', color: 'white', fontSize: '32px', textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>{progressData.goals.completed}</div>
                  <div style={{color: 'white', fontWeight: '700', fontSize: '16px', marginTop: '8px'}}>✅ Completed</div>
                </div>
                <div style={{textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '20px'}}>
                  <div style={{fontWeight: '900', color: 'white', fontSize: '32px', textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>{progressData.goals.total - progressData.goals.completed}</div>
                  <div style={{color: 'white', fontWeight: '700', fontSize: '16px', marginTop: '8px'}}>🎯 In Progress</div>
                </div>
              </div>
            </div>
            </div>

            {/* Challenges Progress */}
            <div style={{
              background: 'linear-gradient(135deg, #fce7f3 0%, #f472b6 100%)',
              borderRadius: '30px',
              boxShadow: '0 8px 24px rgba(244, 114, 182, 0.3)',
              padding: '32px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(244, 114, 182, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 114, 182, 0.3)';
            }}>
              <h3 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>🏆 Challenges Progress</h3>
              <ProgressBar
                percentage={progressData.challenges.percentage}
                total={progressData.challenges.total}
                completed={progressData.challenges.completed}
                title="Challenges Completed"
                type="linear"
                showStats={true}
                animated={true}
                color="#3B82F6"
              />
              <div style={{marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div style={{textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '20px'}}>
                  <div style={{fontWeight: '900', color: 'white', fontSize: '32px', textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>{progressData.challenges.completed}</div>
                  <div style={{color: 'white', fontWeight: '700', fontSize: '16px', marginTop: '8px'}}>✅ Completed</div>
                </div>
                <div style={{textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '20px'}}>
                  <div style={{fontWeight: '900', color: 'white', fontSize: '32px', textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>{progressData.challenges.total - progressData.challenges.completed}</div>
                  <div style={{color: 'white', fontWeight: '700', fontSize: '16px', marginTop: '8px'}}>📋 Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div style={{textAlign: 'center', marginTop: '32px'}}>
            <button
              onClick={loadProgressData}
              disabled={loading}
              style={{
                background: loading ? '#d1d5db' : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                color: 'white',
                padding: '16px 48px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '18px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
                }
              }}
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Progress'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
