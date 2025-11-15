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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h1>
            <p className="text-gray-600">
              Track your achievements and see how far you've come on your learning journey.
            </p>
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Overall Progress - Large Circular */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Overall Progress</h2>
            <div className="flex justify-center">
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
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                You've completed <span className="font-semibold">{progressData.overall.completed}</span> out of{' '}
                <span className="font-semibold">{progressData.overall.total}</span> total items
              </p>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* Goals Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📎 Goals Progress</h3>
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Challenges Progress</h3>
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
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Progress Visualization Options</h3>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Interactive Demo</h3>
            <p className="text-gray-600 mb-6">
              Click the button below to simulate completing a challenge and see the progress bar update in real-time!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg p-6 shadow">
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
                className="ml-0 sm:ml-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                ✓ Complete Challenge
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              * This is a demo. In the actual implementation, progress updates automatically when you complete real challenges.
            </p>
          </div>

          {/* Refresh Button */}
          <div className="text-center mt-8">
            <button
              onClick={loadProgressData}
              disabled={loading}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
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
