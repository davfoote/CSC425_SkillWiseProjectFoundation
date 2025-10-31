import React from 'react';

const ChallengeCard = ({ challenge, onChallengeClick }) => {
  // Determine status display
  const getStatusInfo = (challenge) => {
    if (!challenge.is_active) {
      return { text: 'Inactive', color: 'bg-gray-100 text-gray-600', icon: '🚫' };
    }
    
    // For now, we'll use simple status logic since submissions aren't implemented yet
    // In future sprints, this could check user submissions/completions
    return { text: 'Available', color: 'bg-green-100 text-green-700', icon: '✨' };
  };

  // Determine difficulty color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-red-500'
    };
    return colors[difficulty?.toLowerCase()] || colors.medium;
  };

  // Format estimated time
  const formatTime = (minutes) => {
    if (!minutes) return 'No time limit';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const statusInfo = getStatusInfo(challenge);

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-300"
      onClick={() => onChallengeClick && onChallengeClick(challenge)}
    >
      {/* Header with Status and Difficulty */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{statusInfo.icon}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className={`w-3 h-3 rounded-full ${getDifficultyColor(challenge.difficulty_level)}`}
            title={`${challenge.difficulty_level || 'medium'} difficulty`}
          ></div>
          <span className="text-xs text-gray-500 capitalize">
            {challenge.difficulty_level || 'medium'}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {challenge.title || 'Untitled Challenge'}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {challenge.description || 'No description available.'}
      </p>

      {/* Category and Tags */}
      {challenge.category && (
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            📚 {challenge.category}
          </span>
        </div>
      )}

      {/* Tags */}
      {challenge.tags && challenge.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {challenge.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {challenge.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{challenge.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer with Time and Points */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{formatTime(challenge.estimated_time_minutes)}</span>
          </div>
          {challenge.points_reward && (
            <div className="flex items-center space-x-1">
              <span>🏆</span>
              <span>{challenge.points_reward} pts</span>
            </div>
          )}
        </div>
        
        {/* Peer Review Indicator */}
        {challenge.requires_peer_review && (
          <div className="flex items-center space-x-1 text-xs text-purple-600">
            <span>👥</span>
            <span>Peer Review</span>
          </div>
        )}
      </div>

      {/* Max Attempts Indicator */}
      {challenge.max_attempts && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            Max attempts: {challenge.max_attempts}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;