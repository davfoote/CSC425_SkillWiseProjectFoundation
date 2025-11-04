import React, { useState, useEffect } from 'react';
import Navigation from '../layout/Navigation';
import ChallengeCard from './ChallengeCard';
import challengeService from '../../services/challengeService';
import progressService from '../../services/progressService';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    isActive: true
  });
  const [stats, setStats] = useState({
    total: 0,
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
    byCategory: {}
  });

  // Load challenges on component mount and filter changes
  useEffect(() => {
    loadChallenges();
  }, [filters]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create filter object for API call
      const apiFilters = {};
      if (filters.category) apiFilters.category = filters.category;
      if (filters.difficulty) apiFilters.difficulty = filters.difficulty;
      if (filters.isActive !== undefined) apiFilters.isActive = filters.isActive;

      const response = await challengeService.getChallenges(apiFilters);
      
      // Handle both array response and object with data property
      const challengesData = Array.isArray(response) ? response : response.challenges || [];
      
      setChallenges(challengesData);
      calculateStats(challengesData);
      
    } catch (err) {
      console.error('Error loading challenges:', err);
      setError(err.message || 'Failed to load challenges. Please try again.');
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (challengesData) => {
    const stats = {
      total: challengesData.length,
      byDifficulty: { easy: 0, medium: 0, hard: 0 },
      byCategory: {}
    };

    challengesData.forEach(challenge => {
      // Count by difficulty
      const difficulty = challenge.difficulty_level?.toLowerCase() || 'medium';
      if (stats.byDifficulty[difficulty] !== undefined) {
        stats.byDifficulty[difficulty]++;
      }

      // Count by category
      if (challenge.category) {
        stats.byCategory[challenge.category] = (stats.byCategory[challenge.category] || 0) + 1;
      }
    });

    setStats(stats);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === prev[filterType] ? '' : value // Toggle off if same value
    }));
  };

  const handleChallengeClick = (challenge) => {
    // TODO: Navigate to challenge detail view or open modal
    console.log('Challenge clicked:', challenge);
  };

  // Handle progress update when a challenge is completed
  const handleProgressUpdate = async (challengeId, isCompleted) => {
    try {
      // Update progress tracking
      await progressService.updateChallengeCompletion(challengeId, isCompleted);
      
      // Show success message
      console.log(`Challenge ${challengeId} completion status updated to ${isCompleted}`);
      
      // Optionally reload challenges to reflect any changes
      // loadChallenges();
      
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      isActive: true
    });
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(challenges.map(c => c.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💪</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Challenges</h1>
            <p className="text-gray-600 mb-6">
              Explore and tackle coding challenges to improve your skills
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Challenges</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-green-600">{stats.byDifficulty.easy}</div>
                <div className="text-sm text-gray-600">Easy</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.byDifficulty.medium}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-red-600">{stats.byDifficulty.hard}</div>
                <div className="text-sm text-gray-600">Hard</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                
                {/* Category Filter */}
                <select 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select 
                  value={filters.difficulty} 
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                {/* Status Filter */}
                <select 
                  value={filters.isActive.toString()} 
                  onChange={(e) => handleFilterChange('isActive', e.target.value === 'true')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active Only</option>
                  <option value="">All Statuses</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={loadChallenges}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="text-red-400">⚠️</div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={loadChallenges}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading challenges...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && challenges.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
              <p className="text-gray-600 mb-6">
                {filters.category || filters.difficulty ? 
                  'No challenges match your current filters. Try adjusting your search criteria.' :
                  'No challenges are available at the moment. Check back later!'
                }
              </p>
              {(filters.category || filters.difficulty) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Challenges Grid */}
          {!loading && !error && challenges.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onChallengeClick={handleChallengeClick}
                  onProgressUpdate={handleProgressUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Challenges;