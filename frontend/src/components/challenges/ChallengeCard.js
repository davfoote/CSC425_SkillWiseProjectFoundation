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
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-purple-300 overflow-hidden hover-lift"
      onClick={() => onChallengeClick && onChallengeClick(challenge)}
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header with Status and Difficulty */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{statusInfo.icon}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} shadow-sm`}>
              {statusInfo.text}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
            <div
              className={`w-2.5 h-2.5 rounded-full ${getDifficultyColor(challenge.difficulty_level)} shadow-sm`}
              title={`${challenge.difficulty_level || 'medium'} difficulty`}
            ></div>
            <span className="text-xs font-bold text-gray-700 capitalize">
              {challenge.difficulty_level || 'medium'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200" style={{ fontFamily: 'var(--font-heading)' }}>
          {challenge.title || 'Untitled Challenge'}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {challenge.description || 'No description available.'}
        </p>

        {/* Category and Tags */}
        {challenge.category && (
          <div className="mb-3">
            <span className="inline-block bg-gradient-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
              📚 {challenge.category}
            </span>
          </div>
        )}

        {/* Tags */}
        {challenge.tags && challenge.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {challenge.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
              {challenge.tags.length > 3 && (
                <span className="text-xs text-gray-500 font-medium flex items-center">
                  +{challenge.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer with Time and Points */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-xs text-gray-600 font-medium">
            <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <span>⏱️</span>
              <span>{formatTime(challenge.estimated_time_minutes)}</span>
            </div>
            {challenge.points_reward && (
              <div className="flex items-center space-x-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1.5 rounded-lg">
                <span>🏆</span>
                <span className="font-bold">{challenge.points_reward} pts</span>
              </div>
            )}
          </div>

          {/* Peer Review Indicator */}
          {challenge.requires_peer_review && (
            <div className="flex items-center space-x-1.5 text-xs text-purple-600 bg-purple-50 px-2.5 py-1.5 rounded-lg font-semibold">
              <span>👥</span>
              <span>Peer Review</span>
            </div>
          )}
        </div>

        {/* Completion Status and Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        {/* Submit for Feedback Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSubmitForFeedback && onSubmitForFeedback(challenge);
          }}
          className="w-full bg-gradient-primary text-white py-2.5 px-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 text-sm font-bold flex items-center justify-center space-x-2 hover:-translate-y-0.5"
        >
          <span className="text-lg">🤖</span>
          <span>Submit for AI Feedback</span>
        </button>

        {/* Mark Complete Button */}
        {isCompleted ? (
          <div className="flex items-center justify-center space-x-2 text-green-600 bg-gradient-success rounded-xl py-2.5 shadow-md text-white font-bold">
            <span className="text-lg">✅</span>
            <span className="text-sm">Completed!</span>
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            disabled={isLoading}
            className="w-full bg-white border-2 border-purple-300 text-purple-600 py-2.5 px-4 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                </svg>
                <span>Completing...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span className="text-lg">✓</span>
                <span>Mark Complete</span>
              </span>
            )}
          </button>
        )}
      </div>

      {/* Max Attempts Indicator */}
      {challenge.max_attempts && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center font-medium bg-gray-50 py-2 rounded-lg">
            📋 Max attempts: <span className="font-bold text-gray-700">{challenge.max_attempts}</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ChallengeCard;
