import React from 'react';
import axios from '../../api/axiosInstance';

const ChallengeCard = ({ challenge }) => {
  if (!challenge) return null;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const markComplete = async () => {
    if (challenge.is_completed) return;
    setLoading(true);
    setError(null);
    try {
      await axios.put(`/challenges/${challenge.id}`, { is_completed: true });
      // Notify other parts of the app (Goals) to refresh progress
      window.dispatchEvent(new Event('challenge:completed'));
    } catch (err) {
      setError(err.message || 'Failed to mark complete');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Difficulty: {challenge.difficulty_level || 'medium'}</span>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs ${challenge.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {challenge.is_active ? 'Active' : 'Inactive'}
          </span>
          {challenge.is_completed ? (
            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">Completed</span>
          ) : (
            <button onClick={markComplete} disabled={loading} className="px-2 py-1 rounded text-xs bg-indigo-600 text-white">
              {loading ? 'Marking...' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default ChallengeCard;
