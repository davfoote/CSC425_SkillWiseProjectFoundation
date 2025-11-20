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
              fontSize: '32px',
              fontWeight: '900',
              color: '#1e3a8a',
              marginBottom: '32px',
              textAlign: 'center'
            }}>Overall Progress</h2>
            <div style={{display: 'flex', justifyContent: 'center'}}>
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
              <p style={{color: '#6b7280'}}>
                You've completed <span style={{fontWeight: '600'}}>{progressData.overall.completed}</span> out of{' '}
                <span style={{fontWeight: '600'}}>{progressData.overall.total}</span> total items
              </p>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* Goals Progress */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
              borderRadius: '24px',
              boxShadow: '0 8px 25px rgba(251,191,36,0.3)',
              padding: '32px'
            }}>
              <h3 style={{fontSize: '24px', fontWeight: '900', color: '#1e3a8a', marginBottom: '24px'}}>📎 Goals Progress</h3>
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
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-600 text-lg">{progressData.goals.completed}</div>
                  <div className="text-green-800">Completed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600 text-lg">{progressData.goals.total - progressData.goals.completed}</div>
                  <div className="text-blue-800">In Progress</div>
                </div>
              </div>
            </div>

            {/* Challenges Progress */}
            <div style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
              borderRadius: '24px',
              boxShadow: '0 8px 25px rgba(167,139,250,0.3)',
              padding: '32px'
            }}>
              <h3 style={{fontSize: '24px', fontWeight: '900', color: 'white', marginBottom: '24px'}}>🏆 Challenges Progress</h3>
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
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600 text-lg">{progressData.challenges.completed}</div>
                  <div className="text-blue-800">Completed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-600 text-lg">{progressData.challenges.total - progressData.challenges.completed}</div>
                  <div className="text-gray-800">Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Visualization Demos */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            padding: '40px',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '900',
              color: '#1e3a8a',
              marginBottom: '32px',
              textAlign: 'center'
            }}>📊 Progress Visualization Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Circular Progress - Medium */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Circular Progress</h4>
                <div className="flex justify-center">
                  <ProgressBar
                    percentage={progressData.overall.percentage}
                    title="Overall"
                    type="circular"
                    size="medium"
                    animated={true}
                  />
                </div>
              </div>

              {/* Bar Chart Progress */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Bar Chart</h4>
                <ProgressBar
                  percentage={progressData.goals.percentage}
                  total={progressData.goals.total}
                  completed={progressData.goals.completed}
                  title="Goals"
                  type="bar"
                  showStats={false}
                  color="#10B981"
                />
              </div>

              {/* Mini Progress */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Mini Progress</h4>
                <div className="space-y-3">
                  <ProgressBar
                    percentage={progressData.goals.percentage}
                    type="mini"
                    color="#10B981"
                  />
                  <ProgressBar
                    percentage={progressData.challenges.percentage}
                    type="mini"
                    color="#3B82F6"
                  />
                  <ProgressBar
                    percentage={progressData.overall.percentage}
                    type="mini"
                    color="#F59E0B"
                  />
                </div>
              </div>

              {/* Linear Progress */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Linear Progress</h4>
                <ProgressBar
                  percentage={progressData.challenges.percentage}
                  total={progressData.challenges.total}
                  completed={progressData.challenges.completed}
                  title="Challenges"
                  type="linear"
                  showStats={false}
                  color="#3B82F6"
                />
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
            borderRadius: '30px',
            padding: '40px',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(251,191,36,0.3)'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '900',
              color: '#1e3a8a',
              marginBottom: '16px',
              textAlign: 'center'
            }}>🎯 Interactive Demo</h3>
            <p style={{
              fontSize: '16px',
              color: '#1e40af',
              fontWeight: '600',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Click the button below to simulate completing a challenge and see the progress bar update in real-time!
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div className="flex-1 mb-4 sm:mb-0">
                <ProgressBar
                  percentage={progressData.challenges.percentage}
                  total={progressData.challenges.total}
                  completed={progressData.challenges.completed}
                  title="Challenges Progress"
                  type="linear"
                  showStats={true}
                  animated={true}
                />
              </div>

              <button
                onClick={handleMarkChallengeComplete}
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(52,211,153,0.4)',
                  transition: 'all 0.2s',
                  marginTop: '16px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(52,211,153,0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(52,211,153,0.4)';
                }}
              >
                ✓ Complete Challenge
              </button>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#1e40af',
              marginTop: '16px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              * This is a demo. In the actual implementation, progress updates automatically when you complete real challenges.
            </p>
          </div>

          {/* Refresh Button */}
          <div style={{textAlign: 'center', marginTop: '32px'}}>
            <button
              onClick={loadProgressData}
              disabled={loading}
              style={{
                background: loading ? '#d1d5db' : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(59,130,246,0.4)',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.5)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.4)';
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
