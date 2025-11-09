import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navigation from '../layout/Navigation';
import GoalForm from './GoalForm';
import ProgressBar from '../progress/ProgressBar';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
  const res = await axios.get('/goals');
        setGoals(res.data.data || []);
      } catch (err) {
        // expose error to console and optionally show a toast later
        console.error('Failed to fetch goals', err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();

    // Listen for challenge completion events so we can refresh goals/progress
    const onChallengeCompleted = () => {
      setLoading(true);
      fetchGoals();
    };
    window.addEventListener('challenge:completed', onChallengeCompleted);
    return () => window.removeEventListener('challenge:completed', onChallengeCompleted);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="py-6">
            <div className="text-6xl mb-4 text-center">🎯</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Goals</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <GoalForm onCreated={(g) => setGoals(prev => [g, ...prev])} />
              </div>
              <div className="md:col-span-2">
                <div className="space-y-4">
                  {goals.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-6">No goals yet. Create your first goal.</div>
                  )}
                  {goals.map(goal => (
                    <div key={goal.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{goal.title}</h3>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                        <div className="text-sm text-gray-500">{goal.difficulty_level}</div>
                      </div>
                      <div className="mt-3">
                        <ProgressBar percent={goal.progress_percentage} />
                        <div className="text-xs text-gray-500 mt-2">{goal.progress_percentage || 0}% complete</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Goals;