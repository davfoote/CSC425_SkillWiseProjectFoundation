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
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Goal</h2>
        <p className="text-gray-600">
          Set a new learning goal to track your progress and achievements.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Learn React Hooks"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe what you want to achieve and how you plan to do it..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register('category')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
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
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Difficulty Level Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Difficulty Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'easy', label: 'Easy', description: 'Beginner friendly', points: '100 pts', color: 'green' },
              { value: 'medium', label: 'Medium', description: 'Some experience needed', points: '200 pts', color: 'yellow' },
              { value: 'hard', label: 'Hard', description: 'Advanced challenge', points: '300 pts', color: 'red' },
            ].map((level) => (
              <label key={level.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={level.value}
                  {...register('difficulty_level')}
                  className="sr-only"
                />
                <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                  register('difficulty_level').value === level.value ||
                  (!register('difficulty_level').value && level.value === 'medium')
                    ? `border-${level.color}-500 bg-${level.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className={`text-lg font-semibold text-${level.color}-600`}>{level.label}</div>
                  <div className="text-sm text-gray-600">{level.description}</div>
                  <div className={`text-xs font-medium text-${level.color}-700`}>{level.points}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.difficulty_level && (
            <p className="mt-1 text-sm text-red-600">{errors.difficulty_level.message}</p>
          )}
        </div>

        {/* Target Completion Date */}
        <div>
          <label htmlFor="target_completion_date" className="block text-sm font-medium text-gray-700 mb-1">
            Target Completion Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="target_completion_date"
            {...register('target_completion_date')}
            min={getMinDate()}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.target_completion_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.target_completion_date && (
            <p className="mt-1 text-sm text-red-600">{errors.target_completion_date.message}</p>
          )}
        </div>

        {/* Public Goal Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="is_public"
            {...register('is_public')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_public" className="text-sm text-gray-700">
            Make this goal public (visible to other users)
          </label>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Goal...
              </div>
            ) : (
              'Create Goal'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalCreationForm;
