import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navigation from '../layout/Navigation';
import ChallengeCard from './ChallengeCard';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
  const res = await axios.get('/challenges');
        setChallenges(res.data.data || []);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="py-6">
            <div className="text-6xl mb-4 text-center">💪</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Challenges</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading && <div className="md:col-span-3">Loading...</div>}
              {!loading && challenges.length === 0 && (
                <div className="md:col-span-3 bg-white rounded-lg shadow p-6">No challenges found.</div>
              )}
              {challenges.map(c => (
                <div key={c.id} className="col-span-1">
                  <ChallengeCard challenge={c} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Challenges;