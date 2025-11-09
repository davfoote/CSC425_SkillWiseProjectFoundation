import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchChallenge = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const resp = await axios.get(`/api/challenges/${id}`, { headers });
        if (!mounted) return;
        setChallenge(resp?.data?.challenge || resp?.data || null);
      } catch (err) {
        console.warn('Failed to load challenge:', err?.message || err);
        if (!mounted) return;
        setError('Could not load challenge.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchChallenge();
    return () => { mounted = false; };
  }, [id, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 mb-4">&larr; Back</button>

          {loading && <div className="text-gray-600">Loading challenge...</div>}

          {error && <div className="text-red-600">{error}</div>}

          {!loading && !error && challenge && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
              <p className="text-sm text-gray-500 mb-4">Status: {challenge.status || 'unknown'}</p>
              <p className="text-gray-700 mb-4">{challenge.description}</p>
              {/* Additional details could go here: difficulty, points, content, etc. */}
            </div>
          )}

          {!loading && !error && !challenge && (
            <div className="text-gray-600">Challenge not found.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChallengeDetail;
