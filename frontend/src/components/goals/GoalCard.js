import React from 'react';

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (level) => {
    const colors = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100',
    };
    return colors[level] || colors.medium;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const isOverdue = () => {
    return new Date(goal.target_completion_date) < new Date() && !goal.is_completed;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      goal.is_completed
        ? 'border-green-500'
        : isOverdue()
          ? 'border-red-500'
          : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{goal.description}</p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {goal.is_public && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Public
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(goal.difficulty_level)}`}>
            {goal.difficulty_level.charAt(0).toUpperCase() + goal.difficulty_level.slice(1)}
          </span>
        </div>
      </div>

      {/* Category and Points */}
      <div className="flex justify-between items-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          {goal.category}
        </span>
        <span className="text-sm font-medium text-gray-600">
          {goal.points_reward} points
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{goal.progress_percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(goal.progress_percentage)}`}
            style={{ width: `${goal.progress_percentage}%` }}
          />
        </div>
      </div>

      {/* Dates and Status */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Target Date:</span>
          <div className={`font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
            {formatDate(goal.target_completion_date)}
            {isOverdue() && <span className="text-red-500 ml-1">(Overdue)</span>}
          </div>
        </div>
        <div>
          <span className="text-gray-600">Created:</span>
          <div className="font-medium text-gray-900">
            {formatDate(goal.created_at)}
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {goal.is_completed && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-800 font-medium">
              Completed on {formatDate(goal.completion_date)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {!goal.is_completed && (
          <button
            onClick={() => onUpdateProgress(goal)}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            Update Progress
          </button>
        )}
        <button
          onClick={() => onEdit(goal)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(goal)}
          className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
