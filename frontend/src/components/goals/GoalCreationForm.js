import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import goalService from '../../services/goalService';

// Validation schema matching backend
const goalSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  difficulty_level: z
    .enum(['easy', 'medium', 'hard'], {
      errorMap: () => ({ message: 'Please select a valid difficulty level' }),
    }),
  target_completion_date: z
    .string()
    .min(1, 'Target completion date is required')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Target completion date must be in the future',
    }),
  is_public: z.boolean().optional(),
});

const GoalCreationForm = ({ onGoalCreated, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      difficulty_level: 'medium',
      is_public: false,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const newGoal = await goalService.createGoal(data);
      reset();
      onGoalCreated(newGoal);
    } catch (error) {
      setSubmitError(error.message || 'Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      borderRadius: '30px',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{marginBottom: '32px'}}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '900',
          color: '#1e3a8a',
          marginBottom: '8px'
        }}>🎯 Create New Goal</h2>
        <p style={{
          fontSize: '16px',
          color: '#3b82f6',
          fontWeight: '600'
        }}>
          Set a new learning goal to track your progress and achievements!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        {/* Title Field */}
        <div>
          <label htmlFor="title" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '8px'
          }}>
            Goal Title <span style={{color: '#ef4444'}}>*</span>
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.title ? '2px solid #ef4444' : '2px solid #e5e7eb',
              borderRadius: '16px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = errors.title ? '#ef4444' : '#e5e7eb'}
            placeholder="e.g., Learn React Hooks"
          />
          {errors.title && (
            <p style={{marginTop: '4px', fontSize: '14px', color: '#ef4444', fontWeight: '600'}}>{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '8px'
          }}>
            Description <span style={{color: '#ef4444'}}>*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.description ? '2px solid #ef4444' : '2px solid #e5e7eb',
              borderRadius: '16px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb'}
            placeholder="Describe what you want to achieve and how you plan to do it..."
          />
          {errors.description && (
            <p style={{marginTop: '4px', fontSize: '14px', color: '#ef4444', fontWeight: '600'}}>{errors.description.message}</p>
          )}
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '8px'
          }}>
            Category <span style={{color: '#ef4444'}}>*</span>
          </label>
          <select
            id="category"
            {...register('category')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.category ? '2px solid #ef4444' : '2px solid #e5e7eb',
              borderRadius: '16px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s',
              background: 'white',
              cursor: 'pointer'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = errors.category ? '#ef4444' : '#e5e7eb'}
          >
            <option value="">Select a category</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="DevOps">DevOps</option>
            <option value="Design">Design</option>
            <option value="Project Management">Project Management</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p style={{marginTop: '4px', fontSize: '14px', color: '#ef4444', fontWeight: '600'}}>{errors.category.message}</p>
          )}
        </div>

        {/* Difficulty Level Field */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '12px'
          }}>
            Difficulty Level <span style={{color: '#ef4444'}}>*</span>
          </label>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
            {[
              { value: 'easy', label: 'Easy', description: 'Beginner friendly', points: '100 pts', gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)' },
              { value: 'medium', label: 'Medium', description: 'Some experience', points: '200 pts', gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' },
              { value: 'hard', label: 'Hard', description: 'Advanced challenge', points: '300 pts', gradient: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)' },
            ].map((level) => (
              <label key={level.value} style={{cursor: 'pointer'}}>
                <input
                  type="radio"
                  value={level.value}
                  {...register('difficulty_level')}
                  style={{display: 'none'}}
                />
                <div style={{
                  background: level.gradient,
                  borderRadius: '20px',
                  padding: '20px',
                  textAlign: 'center',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  opacity: 0.7
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.opacity = '0.7';
                }}>
                  <div style={{fontSize: '18px', fontWeight: '900', marginBottom: '4px'}}>{level.label}</div>
                  <div style={{fontSize: '13px', opacity: 0.9, marginBottom: '4px'}}>{level.description}</div>
                  <div style={{fontSize: '12px', fontWeight: '700'}}>{level.points}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.difficulty_level && (
            <p style={{marginTop: '8px', fontSize: '14px', color: '#ef4444', fontWeight: '600'}}>{errors.difficulty_level.message}</p>
          )}
        </div>

        {/* Target Completion Date */}
        <div>
          <label htmlFor="target_completion_date" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '8px'
          }}>
            Target Completion Date <span style={{color: '#ef4444'}}>*</span>
          </label>
          <input
            type="date"
            id="target_completion_date"
            {...register('target_completion_date')}
            min={getMinDate()}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.target_completion_date ? '2px solid #ef4444' : '2px solid #e5e7eb',
              borderRadius: '16px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = errors.target_completion_date ? '#ef4444' : '#e5e7eb'}
          />
          {errors.target_completion_date && (
            <p style={{marginTop: '4px', fontSize: '14px', color: '#ef4444', fontWeight: '600'}}>{errors.target_completion_date.message}</p>
          )}
        </div>

        {/* Public Goal Toggle */}
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <input
            type="checkbox"
            id="is_public"
            {...register('is_public')}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: '#3b82f6'
            }}
          />
          <label htmlFor="is_public" style={{
            fontSize: '14px',
            color: '#1e3a8a',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Make this goal public (visible to other users)
          </label>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div style={{
            background: 'rgba(254,202,202,0.9)',
            border: '2px solid #f87171',
            borderRadius: '16px',
            padding: '16px'
          }}>
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
              <div style={{fontSize: '24px'}}>⚠️</div>
              <p style={{fontSize: '14px', color: '#991b1b', fontWeight: '600', margin: 0}}>{submitError}</p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div style={{display: 'flex', gap: '12px', paddingTop: '16px'}}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '16px 32px',
              background: isSubmitting ? '#d1d5db' : 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(52,211,153,0.4)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(52,211,153,0.5)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(52,211,153,0.4)';
              }
            }}
          >
            {isSubmitting ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <svg style={{animation: 'spin 1s linear infinite', width: '20px', height: '20px'}} fill="none" viewBox="0 0 24 24">
                  <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Goal...
              </div>
            ) : (
              '✨ Create Goal'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '16px 32px',
              background: 'rgba(209,213,219,0.8)',
              color: '#374151',
              border: '2px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = 'rgba(156,163,175,0.8)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = 'rgba(209,213,219,0.8)';
              }
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalCreationForm;
