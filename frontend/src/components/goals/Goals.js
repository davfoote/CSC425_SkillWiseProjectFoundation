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
      const fetchedGoals = await goalService.getGoals();
      setGoals(Array.isArray(fetchedGoals.data) ? fetchedGoals.data : []);
    } catch (err) {
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="text-4xl mr-3">🎯</span>
                  My Goals
                </h1>
                <p className="text-gray-600 mt-2">
                  Track your learning journey and achieve your objectives.
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                + Create New Goal
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-green-800">{successMessage}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Goals</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
                <div className="text-sm text-gray-600">Not Started</div>
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
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Goals Yet</h2>
              <p className="text-gray-600 mb-8">
                Start your learning journey by creating your first goal!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Create Your First Goal
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