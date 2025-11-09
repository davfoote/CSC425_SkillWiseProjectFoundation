import React, { useEffect, useState } from 'react';
import Navigation from '../layout/Navigation';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const sampleChallenges = [
  { id: 1, title: 'Build a REST API', description: 'Create a CRUD API using Express and Postgres.', status: 'completed' },
  { id: 2, title: 'React Hooks Deep Dive', description: 'Complete exercises on useState, useEffect, and custom hooks.', status: 'in-progress' },
  { id: 3, title: 'Unit Testing', description: 'Write unit tests for services and controllers.', status: 'open' },
  { id: 4, title: 'Deployment Pipeline', description: 'Set up CI/CD for the project.', status: 'open' }
];

const Progress = () => {
  const { token } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const resp = await axios.get('/api/challenges', { headers });
        if (!mounted) return;
        const data = resp?.data?.challenges || resp?.data || [];
        setChallenges(data);
      } catch (err) {
        console.warn('Failed to load challenges for progress, using sample data:', err?.message || err);
        if (!mounted) return;
        setError('Could not load challenges from server — showing sample data.');
        setChallenges(sampleChallenges);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => { mounted = false; };
  }, [token]);

  const completedCount = challenges.filter((c) => c.status === 'completed').length;
  const total = challenges.length || 1;
  const percent = Math.round((completedCount / total) * 100);

  const data = [{ name: 'completed', value: percent }];

  const toggleComplete = async (challenge) => {
    const newStatus = challenge.status === 'completed' ? 'open' : 'completed';
    // optimistic UI
    setChallenges((prev) => prev.map((c) => (c.id === challenge.id ? { ...c, status: newStatus } : c)));
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`/api/challenges/${challenge.id}`, { status: newStatus }, { headers });
    } catch (err) {
      console.error('Failed to update challenge status', err);
      // revert
      setChallenges((prev) => prev.map((c) => (c.id === challenge.id ? { ...c, status: challenge.status } : c)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-4xl">📊</div>
              <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
              <p className="text-gray-600">Track your completion across challenges.</p>
            </div>
            <div>
              <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Refresh</button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading progress...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Completion</h3>
              <div style={{ width: 180, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
                    <RadialBar minAngle={15} background clockWise={true} dataKey="value" cornerRadius={10} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold">{percent}%</div>
                <div className="text-sm text-gray-500">{completedCount} of {total} challenges completed</div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Challenges</h3>
              {error && <div className="mb-4 p-2 text-sm bg-yellow-50 text-yellow-800 rounded">{error}</div>}
              <ul className="space-y-3">
                {challenges.map((c) => (
                  <li key={c.id} className="flex items:center justify-between border rounded-md p-3">
                    <div>
                      <div className="text-md font-medium text-gray-900">{c.title}</div>
                      <div className="text-sm text-gray-600">{c.description}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`text-sm px-2 py-1 rounded ${c.status === 'completed' ? 'bg-green-100 text-green-800' : c.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                        {c.status}
                      </div>
                      <button onClick={() => toggleComplete(c)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm">
                        {c.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;