import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../layout/Navigation';
import ChallengeCard from './ChallengeCard';
import GenerateChallengeModal from './GenerateChallengeModal';
import SubmissionForm from './SubmissionForm';
import challengeService from '../../services/challengeService';
import progressService from '../../services/progressService';

const Challenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    isActive: true,
  });
  const [stats, setStats] = useState({
    total: 0,
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
    byCategory: {},
  });

  const handleQuickLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

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
      byCategory: {},
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
      [filterType]: value === prev[filterType] ? '' : value, // Toggle off if same value
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
      isActive: true,
    });
  };

  const handleChallengeGenerated = (challenge) => {
    // Add the AI-generated challenge to the local state
    setChallenges((prev) => [challenge, ...prev]);
    calculateStats([challenge, ...challenges]);
    
    // Show success notification
    console.log('AI Challenge generated:', challenge);
  };

  const handleSubmitForFeedback = (challenge) => {
    setSelectedChallenge(challenge);
    setIsSubmissionFormOpen(true);
    setFeedbackResult(null);
  };

  const handleSubmissionComplete = (result) => {
    setFeedbackResult(result);
    setIsSubmissionFormOpen(false);
    
    // Show success notification
    console.log('Feedback received:', result);
    alert(`Feedback received! Overall Score: ${result.feedback.overallScore}/100`);
  };

  const handleSubmissionCancel = () => {
    setIsSubmissionFormOpen(false);
    setSelectedChallenge(null);
    setFeedbackResult(null);
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(challenges.map(c => c.category).filter(Boolean))];

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
      <div style={{position: 'absolute', bottom: '15%', right: '20%', fontSize: '55px', opacity: 0.3}}>💪</div>
      
      <Navigation />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Hero Header */}
          <div className="text-center mb-10 relative">
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
              padding: '40px',
              borderRadius: '40px',
              marginBottom: '32px',
              boxShadow: '0 10px 30px rgba(251,191,36,0.3)'
            }}>
              <div style={{fontSize: '80px', marginBottom: '16px'}}>💪</div>
              
              <h1 style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#1e3a8a',
                marginBottom: '16px'
              }}>
                Challenges
              </h1>
              <p style={{fontSize: '18px', color: '#1e40af', fontWeight: '600', marginBottom: '32px'}}>
                Explore and tackle coding challenges to level up your skills 🚀
              </p>

              {/* Stats Cards */}
              <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px'}}>
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  padding: '24px',
                  minWidth: '140px',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{fontSize: '36px', fontWeight: '900', color: '#3b82f6', marginBottom: '4px'}}>{stats.total}</div>
                  <div style={{fontSize: '14px', fontWeight: '600', color: '#64748b'}}>Total Challenges</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  padding: '24px',
                  minWidth: '140px'
                }}>
                  <div style={{fontSize: '36px', fontWeight: '900', color: '#34d399', marginBottom: '4px'}}>{stats.byDifficulty.easy}</div>
                  <div style={{fontSize: '14px', fontWeight: '600', color: '#64748b'}}>Easy</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  padding: '24px',
                  minWidth: '140px'
                }}>
                  <div style={{fontSize: '36px', fontWeight: '900', color: '#fbbf24', marginBottom: '4px'}}>{stats.byDifficulty.medium}</div>
                  <div style={{fontSize: '14px', fontWeight: '600', color: '#64748b'}}>Medium</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  padding: '24px',
                  minWidth: '140px'
                }}>
                  <div style={{fontSize: '36px', fontWeight: '900', color: '#f87171', marginBottom: '4px'}}>{stats.byDifficulty.hard}</div>
                  <div style={{fontSize: '14px', fontWeight: '600', color: '#64748b'}}>Hard</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '24px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-3 items-center flex-wrap">
                <span style={{fontSize: '14px', fontWeight: '700', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '18px'}}>🔍</span> Filter by:
                </span>

                {/* Category Filter */}
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2.5 border-2 border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all hover:border-purple-300"
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
                  className="px-4 py-2.5 border-2 border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all hover:border-purple-300"
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
                  className="px-4 py-2.5 border-2 border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all hover:border-purple-300"
                >
                  <option value="true">Active Only</option>
                  <option value="">All Statuses</option>
                </select>
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(244,114,182,0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,114,182,0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(244,114,182,0.4)';
                  }}
                >
                  <span style={{fontSize: '18px'}}>🤖</span> Generate AI Challenge
                </button>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '16px',
                    border: '2px solid #3b82f6',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Clear Filters
                </button>
                <button
                  onClick={loadChallenges}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: loading ? '#d1d5db' : 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 15px rgba(52,211,153,0.4)',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? '⏳ Loading...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div style={{
              background: 'rgba(254,202,202,0.95)',
              borderRadius: '24px',
              padding: '24px',
              marginBottom: '24px',
              border: '2px solid #f87171',
              boxShadow: '0 4px 15px rgba(248,113,113,0.3)'
            }}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                <div style={{fontSize: '40px'}}>⚠️</div>
                <div style={{flex: 1}}>
                  <h3 style={{fontSize: '18px', fontWeight: '900', color: '#991b1b', marginBottom: '8px'}}>Oops! Something went wrong</h3>
                  <p style={{color: '#991b1b', marginBottom: '12px', fontWeight: '600'}}>{error}</p>
                  <button
                    onClick={loadChallenges}
                    style={{
                      padding: '12px 24px',
                      background: 'white',
                      color: '#dc2626',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{textAlign: 'center', padding: '80px 0'}}>
              <div style={{display: 'inline-block'}}>
                <div style={{fontSize: '80px', marginBottom: '16px'}}>⏳</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}>
                  <div style={{width: '12px', height: '12px', background: '#a78bfa', borderRadius: '50%', animation: 'bounce 1s infinite'}}></div>
                  <div style={{width: '12px', height: '12px', background: '#a78bfa', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: '150ms'}}></div>
                  <div style={{width: '12px', height: '12px', background: '#a78bfa', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: '300ms'}}></div>
                </div>
                <p style={{color: '#1e3a8a', marginTop: '16px', fontWeight: '700', fontSize: '16px'}}>Loading amazing challenges...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && challenges.length === 0 && (
            <div style={{textAlign: 'center', padding: '80px 0'}}>
              <div style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '30px',
                padding: '48px',
                maxWidth: '500px',
                margin: '0 auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }}>
                <div style={{fontSize: '80px', marginBottom: '24px'}}>🔍</div>
                <h3 style={{fontSize: '28px', fontWeight: '900', color: '#1e3a8a', marginBottom: '16px'}}>No challenges found</h3>
                <p style={{fontSize: '16px', color: '#3b82f6', marginBottom: '32px', fontWeight: '600'}}>
                  {filters.category || filters.difficulty ?
                    'No challenges match your current filters. Try adjusting your search criteria.' :
                    'No challenges are available at the moment. Why not generate one with AI?'
                  }
                </p>
                {(filters.category || filters.difficulty) ? (
                  <button
                    onClick={clearFilters}
                    style={{
                      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
                      transition: 'all 0.2s'
                    }}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      background: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(244,114,182,0.4)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{fontSize: '18px'}}>🤖</span> Generate AI Challenge
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Challenges Grid */}
          {!loading && !error && challenges.length > 0 && (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'}}>
              {challenges.map((challenge, index) => (
                <div key={challenge.id}>
                  <ChallengeCard
                    challenge={challenge}
                    onChallengeClick={handleChallengeClick}
                    onProgressUpdate={handleProgressUpdate}
                    onSubmitForFeedback={handleSubmitForFeedback}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* AI Challenge Generation Modal */}
      <GenerateChallengeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChallengeGenerated={handleChallengeGenerated}
      />

      {/* Submission Form Modal */}
      {isSubmissionFormOpen && selectedChallenge && (
        <SubmissionForm
          challenge={selectedChallenge}
          onSubmit={handleSubmissionComplete}
          onCancel={handleSubmissionCancel}
        />
      )}
    </div>
  );
};

export default Challenges;
