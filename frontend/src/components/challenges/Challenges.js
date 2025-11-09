import React, { useEffect, useState } from 'react';
import Navigation from '../layout/Navigation';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const statusClasses = {
  open: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-700'
};

const sampleChallenges = [
  { id: 1, title: 'Build a REST API', description: 'Create a CRUD API using Express and Postgres.', status: 'open' },
  { id: 2, title: 'React Hooks Deep Dive', description: 'Complete exercises on useState, useEffect, and custom hooks.', status: 'in-progress' },
  { id: 3, title: 'Unit Testing', description: 'Write unit tests for services and controllers.', status: 'draft' },
  { id: 4, title: 'Deployment Pipeline', description: 'Set up CI/CD for the project.', status: 'completed' }
];

const Challenges = () => {
  const { token } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const resp = await axios.get('/api/challenges', { headers });
        if (!mounted) return;
        const data = resp?.data?.challenges || resp?.data || [];
        setChallenges(data);
      } catch (err) {
        // If backend not available or auth fails, fall back to sample data
        console.warn('Failed to fetch challenges, using sample data:', err?.message || err);
        if (!mounted) return;
        setError('Could not load challenges from server — showing sample challenges.');
        setChallenges(sampleChallenges);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchChallenges();
    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-4xl">💪</div>
              <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
              <p className="text-gray-600">Browse available challenges and start learning.</p>
            </div>
            <div>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading challenges...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-md bg-yellow-50 text-yellow-800">{error}</div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((c) => (
                <div key={c.id} className="bg-white rounded-lg shadow p-5 flex flex-col">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${statusClasses[c.status] || 'bg-gray-100 text-gray-700'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 flex-1">{c.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500">ID: {c.id}</div>
                    <button onClick={() => navigate(`/challenges/${c.id}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm">Open</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Challenges;