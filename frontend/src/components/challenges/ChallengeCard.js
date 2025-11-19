import React, { useState } from 'react';
import challengeService from '../../services/challengeService';

const ChallengeCard = ({ challenge, onChallengeClick, onProgressUpdate, onSubmitForFeedback }) => {
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
      hard: 'bg-red-500',
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle marking challenge as complete
  const handleMarkComplete = async (e) => {
    e.stopPropagation(); // Prevent card click event

    try {
      setIsLoading(true);
      await challengeService.markChallengeComplete(challenge.id);
      setIsCompleted(true);

      // Trigger progress update callback if provided
      if (onProgressUpdate) {
        onProgressUpdate(challenge.id, true);
      }

    } catch (error) {
      console.error('Error marking challenge complete:', error);
      alert('Failed to mark challenge as complete. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Completion Status and Buttons */}
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
        {/* Submit for Feedback Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSubmitForFeedback && onSubmitForFeedback(challenge);
          }}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <span>🤖</span>
          <span>Submit for AI Feedback</span>
        </button>

        {/* Mark Complete Button */}
        {isCompleted ? (
          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg py-2">
            <span>✅</span>
            <span className="text-sm font-medium">Completed!</span>
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Completing...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>✓</span>
                <span>Mark Complete</span>
              </span>
            )}
          </button>
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
