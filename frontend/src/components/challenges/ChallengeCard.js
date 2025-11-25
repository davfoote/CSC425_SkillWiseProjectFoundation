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
      style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '30px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        padding: '28px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
      onClick={() => onChallengeClick && onChallengeClick(challenge)}
    >
      {/* Content */}
      <div style={{position: 'relative', zIndex: 10}}>
        {/* Header with Status and Difficulty */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '28px'}}>{statusInfo.icon}</span>
            <span style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              background: statusInfo.text === 'Available' ? 'linear-gradient(135deg, #34d399 0%, #059669 100%)' : '#e5e7eb',
              color: statusInfo.text === 'Available' ? 'white' : '#6b7280',
              boxShadow: statusInfo.text === 'Available' ? '0 4px 12px rgba(52,211,153,0.3)' : 'none'
            }}>
              {statusInfo.text}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: getDifficultyColor(challenge.difficulty_level).replace('bg-', '') === 'green-500' ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' :
                       getDifficultyColor(challenge.difficulty_level).replace('bg-', '') === 'yellow-500' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' :
                       'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <span style={{fontSize: '14px', fontWeight: '900', textTransform: 'capitalize'}}>
              {challenge.difficulty_level || 'medium'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '22px',
          fontWeight: '900',
          color: '#1e3a8a',
          marginBottom: '12px',
          lineHeight: '1.3'
        }}>
          {challenge.title || 'Untitled Challenge'}
        </h3>

        {/* Description */}
        <p style={{
          color: '#64748b',
          fontSize: '14px',
          marginBottom: '16px',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {challenge.description || 'No description available.'}
        </p>

        {/* Category */}
        {challenge.category && (
          <div style={{marginBottom: '16px'}}>
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(167,139,250,0.4)'
            }}>
              📚 {challenge.category}
            </span>
          </div>
        )}

        {/* Tags */}
        {challenge.tags && challenge.tags.length > 0 && (
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
              {challenge.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: 'rgba(167,139,250,0.15)',
                    color: '#7c3aed',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}
                >
                  #{tag}
                </span>
              ))}
              {challenge.tags.length > 3 && (
                <span style={{fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
                  +{challenge.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer with Time and Points */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '2px solid #e5e7eb',
          marginBottom: '16px'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px'}}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f1f5f9',
              padding: '8px 12px',
              borderRadius: '12px',
              fontWeight: '700',
              color: '#475569'
            }}>
              <span>⏱️</span>
              <span>{formatTime(challenge.estimated_time_minutes)}</span>
            </div>
            {challenge.points_reward && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontWeight: '900',
                color: '#92400e'
              }}>
                <span>🏆</span>
                <span>{challenge.points_reward} pts</span>
              </div>
            )}
          </div>

          {/* Peer Review Indicator */}
          {challenge.requires_peer_review && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#7c3aed',
              background: 'rgba(167,139,250,0.15)',
              padding: '8px 12px',
              borderRadius: '12px',
              fontWeight: '700'
            }}>
              <span>👥</span>
              <span>Peer Review</span>
            </div>
          )}
        </div>

        {/* Completion Status and Buttons */}
        <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px'}}>
        {/* Submit for Feedback Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSubmitForFeedback && onSubmitForFeedback(challenge);
          }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
            color: 'white',
            padding: '14px 16px',
            borderRadius: '18px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(244,114,182,0.4)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,114,182,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(244,114,182,0.4)';
          }}
        >
          <span style={{fontSize: '18px'}}>🤖</span>
          <span>Submit for AI Feedback</span>
        </button>

        {/* Mark Complete Button */}
        {isCompleted ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
            borderRadius: '18px',
            padding: '14px',
            color: 'white',
            fontWeight: '700',
            boxShadow: '0 4px 15px rgba(52,211,153,0.4)'
          }}>
            <span style={{fontSize: '18px'}}>✅</span>
            <span style={{fontSize: '14px'}}>Completed!</span>
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'white',
              border: '2px solid #a78bfa',
              color: '#7c3aed',
              padding: '14px 16px',
              borderRadius: '18px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#faf5ff';
                e.currentTarget.style.borderColor = '#7c3aed';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#a78bfa';
              }
            }}
          >
            {isLoading ? (
              <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <svg style={{animation: 'spin 1s linear infinite', height: '16px', width: '16px'}} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                </svg>
                <span>Completing...</span>
              </span>
            ) : (
              <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <span style={{fontSize: '18px'}}>✓</span>
                <span>Mark Complete</span>
              </span>
            )}
          </button>
        )}
      </div>

      {/* Max Attempts Indicator */}
      {challenge.max_attempts && (
        <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #e5e7eb'}}>
          <div style={{
            fontSize: '12px',
            color: '#64748b',
            textAlign: 'center',
            fontWeight: '700',
            background: '#f1f5f9',
            padding: '10px',
            borderRadius: '12px'
          }}>
            📋 Max attempts: <span style={{fontWeight: '900', color: '#1e3a8a'}}>{challenge.max_attempts}</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ChallengeCard;
