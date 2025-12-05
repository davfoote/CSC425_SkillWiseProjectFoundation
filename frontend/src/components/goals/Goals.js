import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../layout/Navigation';
import GoalCreationForm from './GoalCreationForm';
import GoalCard from './GoalCard';
import goalService from '../../services/goalService';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, redirecting to login');
        window.location.href = '/login';
        return;
      }
      
      const fetchedGoals = await goalService.getGoals();
      setGoals(Array.isArray(fetchedGoals.data) ? fetchedGoals.data : []);
    } catch (err) {
      console.error('Error loading goals:', err);
      // If auth error, redirect to login
      if (err.response?.status === 401 || err.message?.includes('401')) {
        console.log('Authentication error, redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        window.location.href = '/login';
        return;
      }
      setError(err.message || 'Failed to load goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalCreated = (newGoal) => {
    setGoals(prevGoals => [newGoal.data, ...prevGoals]);
    setShowCreateForm(false);
    setSuccessMessage('Goal created successfully! 🎉');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleEdit = (goal) => {
    // TODO: Implement edit functionality in future user story
    console.log('Edit goal:', goal);
  };

  const handleDelete = async (goal) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.deleteGoal(goal.id);
        setGoals(prevGoals => prevGoals.filter(g => g.id !== goal.id));
        setSuccessMessage('Goal deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete goal');
      }
    }
  };

  const handleUpdateProgress = (goal) => {
    // TODO: Implement progress update in future user story
    console.log('Update progress for goal:', goal);
  };

  const getGoalStats = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.is_completed).length;
    const inProgress = goals.filter(g => !g.is_completed && g.progress_percentage > 0).length;
    const notStarted = goals.filter(g => !g.is_completed && g.progress_percentage === 0).length;

    return { total, completed, inProgress, notStarted };
  };

  const stats = getGoalStats();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Please log in to view your goals</h1>
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
      <div style={{position: 'absolute', bottom: '15%', right: '20%', fontSize: '55px', opacity: 0.3}}>🎯</div>
      
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
              padding: '32px',
              borderRadius: '40px',
              marginBottom: '32px',
              boxShadow: '0 10px 30px rgba(251,191,36,0.3)'
            }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    color: '#1e3a8a',
                    marginBottom: '16px'
                  }}>
                    🎯 My Goals
                  </h1>
                  <p style={{fontSize: '18px', color: '#1e40af', fontWeight: '600'}}>
                    Track your learning journey and achieve your objectives!
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  style={{
                    background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(5,150,105,0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(5,150,105,0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(5,150,105,0.4)';
                  }}
                >
                  + Create New Goal
                </button>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div style={{
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #34d399 100%)',
                border: '3px solid #059669',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(52, 211, 153, 0.4)',
                animation: 'slideDown 0.3s ease-out'
              }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{fontSize: '32px', marginRight: '16px'}}>🎉</div>
                  <p style={{fontSize: '20px', fontWeight: '700', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Stats Dashboard */}
            <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '32px', flexWrap: 'wrap', gap: '20px'}}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(251,191,36,0.4)',
                color: 'white'
              }}>
                <div style={{fontSize: '48px', fontWeight: '900', marginBottom: '8px'}}>{stats.total}</div>
                <div style={{fontSize: '14px', fontWeight: '600'}}>Total Goals</div>
              </div>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(52,211,153,0.4)',
                color: 'white'
              }}>
                <div style={{fontSize: '48px', fontWeight: '900', marginBottom: '8px'}}>{stats.completed}</div>
                <div style={{fontSize: '14px', fontWeight: '600'}}>Completed</div>
              </div>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(96,165,250,0.4)',
                color: 'white'
              }}>
                <div style={{fontSize: '48px', fontWeight: '900', marginBottom: '8px'}}>{stats.inProgress}</div>
                <div style={{fontSize: '14px', fontWeight: '600'}}>In Progress</div>
              </div>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(167,139,250,0.4)',
                color: 'white'
              }}>
                <div style={{fontSize: '48px', fontWeight: '900', marginBottom: '8px'}}>{stats.notStarted}</div>
                <div style={{fontSize: '14px', fontWeight: '600'}}>Not Started</div>
              </div>
            </div>
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <GoalCreationForm
                  onGoalCreated={handleGoalCreated}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          )}

          {/* Goals List */}
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 mt-2">Loading your goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '40px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{fontSize: '120px', marginBottom: '24px'}}>🎯</div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#1e3a8a',
                marginBottom: '16px'
              }}>
                No Goals Yet
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#3b82f6',
                marginBottom: '40px',
                fontWeight: '600'
              }}>
                Start your learning journey by creating your first goal!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                  color: 'white',
                  padding: '20px 48px',
                  borderRadius: '25px',
                  fontSize: '18px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(167,139,250,0.5)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(167,139,250,0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(167,139,250,0.5)';
                }}
              >
                ✨ Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Goals;
