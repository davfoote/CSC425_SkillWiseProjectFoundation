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
    <div style={{
      background: 'white',
      borderRadius: '30px',
      padding: '32px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      borderLeft: `8px solid ${goal.is_completed ? '#34d399' : isOverdue() ? '#f87171' : '#60a5fa'}`,
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
    }}>
      {/* Title and Description */}
      <div style={{marginBottom: '24px'}}>
        <h3 style={{fontSize: '28px', fontWeight: '900', color: '#1e3a8a', marginBottom: '12px', lineHeight: '1.2'}}>{goal.title}</h3>
        <p style={{color: '#6b7280', fontSize: '16px', lineHeight: '1.6'}}>{goal.description}</p>
      </div>

      {/* Badges Row */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px'}}>
        {goal.is_public && (
          <span style={{
            padding: '10px 18px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)',
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}>
            🌐 Public
          </span>
        )}
        <span style={{
          padding: '10px 18px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '700',
          background: goal.difficulty_level === 'easy' 
            ? 'linear-gradient(135deg, #d1fae5 0%, #34d399 100%)'
            : goal.difficulty_level === 'hard'
            ? 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)'
            : 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
          color: 'white',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap'
        }}>
          {goal.difficulty_level === 'easy' ? '😊' : goal.difficulty_level === 'hard' ? '💪' : '🎯'} {goal.difficulty_level.charAt(0).toUpperCase() + goal.difficulty_level.slice(1)}
        </span>
        <span style={{
          padding: '10px 18px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
          color: 'white',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap'
        }}>
          📚 {goal.category}
        </span>
        <span style={{
          padding: '10px 18px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
          color: 'white',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap'
        }}>
          ⭐ {goal.points_reward} points
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{marginBottom: '24px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
          <span style={{fontSize: '16px', fontWeight: '700', color: '#374151'}}>Progress</span>
          <span style={{fontSize: '20px', fontWeight: '900', color: '#3b82f6'}}>{goal.progress_percentage}%</span>
        </div>
        <div style={{width: '100%', height: '12px', background: '#e5e7eb', borderRadius: '10px', overflow: 'hidden'}}>
          <div
            style={{
              height: '100%',
              borderRadius: '10px',
              background: goal.progress_percentage >= 80 
                ? 'linear-gradient(90deg, #34d399 0%, #059669 100%)'
                : goal.progress_percentage >= 50
                ? 'linear-gradient(90deg, #fbbf24 0%, #d97706 100%)'
                : 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)',
              width: `${goal.progress_percentage}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Dates */}
      <div style={{
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '20px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '20px'
      }}>
        <div>
          <div style={{fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>🎯 Target</div>
          <div style={{fontSize: '16px', fontWeight: '900', color: isOverdue() ? '#f87171' : '#1e3a8a'}}>
            {formatDate(goal.target_completion_date)}
          </div>
          {isOverdue() && <div style={{fontSize: '12px', color: '#f87171', fontWeight: '700', marginTop: '4px'}}>⚠️ Overdue</div>}
        </div>
        <div>
          <div style={{fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>📅 Created</div>
          <div style={{fontSize: '16px', fontWeight: '900', color: '#1e3a8a'}}>
            {formatDate(goal.created_at)}
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {goal.is_completed && (
        <div style={{
          marginBottom: '24px',
          padding: '20px',
          background: 'linear-gradient(135deg, #d1fae5 0%, #34d399 100%)',
          borderRadius: '20px',
          border: '3px solid #059669'
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: '28px', marginRight: '12px'}}>✅</div>
            <span style={{fontSize: '16px', color: 'white', fontWeight: '700', textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
              Completed {formatDate(goal.completion_date)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons - pushed to bottom */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'auto'}}>
        {!goal.is_completed && (
          <button
            onClick={() => onUpdateProgress(goal)}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)',
              color: 'white',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)',
              transition: 'all 0.2s',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(96, 165, 250, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 165, 250, 0.3)';
            }}
          >
            📊 Update Progress
          </button>
        )}
        <button
          onClick={() => onEdit(goal)}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
            color: 'white',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(192, 132, 252, 0.3)',
            transition: 'all 0.2s',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(192, 132, 252, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(192, 132, 252, 0.3)';
          }}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(goal)}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)',
            color: 'white',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(248, 113, 113, 0.3)',
            transition: 'all 0.2s',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(248, 113, 113, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 113, 113, 0.3)';
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
