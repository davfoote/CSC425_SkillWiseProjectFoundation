// src/services/goalService.js
const Goal = require('../models/Goal');
const { AppError } = require('../middleware/errorHandler');

const goalService = {
  /**
   * Get all goals for a specific user
   * Includes dynamic completion calculation
   */
  async getUserGoals (userId) {
    try {
      const goals = await Goal.findByUserId(userId);

      return goals.map((goal) => ({
        ...goal,
        completion: goalService.calculateCompletion(goal),
        isCompleted: (goal.progress ?? 0) >= 100 || goal.status === 'completed',
      }));
    } catch (error) {
      console.error('Error fetching user goals:', error.message);
      throw new AppError('Failed to retrieve goals', 500, 'GOAL_FETCH_ERROR');
    }
  },

  /**
   * Create a new goal after validating input
   */
  async createGoal (goalData, userId) {
    try {
      if (!goalData.title) {
        throw new AppError('Goal title is required', 400, 'MISSING_TITLE');
      }

      const validTypes = ['learning', 'practice', 'project', 'habit'];
      if (goalData.type && !validTypes.includes(goalData.type)) {
        throw new AppError('Invalid goal type', 400, 'INVALID_TYPE');
      }

      const newGoal = await Goal.create({
        title: goalData.title.trim(),
        description: goalData.description?.trim() || null,
        user_id: userId,
        target_date: goalData.target_date || null,
        type: goalData.type || 'learning',
      });

      return {
        ...newGoal,
        completion: 0,
        status: 'active',
      };
    } catch (error) {
      console.error('Error creating goal:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create goal', 500, 'GOAL_CREATE_ERROR');
    }
  },

  /**
   * Update goal progress safely and calculate new status
   */
  async updateProgress (goalId, progress) {
    try {
      if (progress < 0 || progress > 100 || isNaN(progress)) {
        throw new AppError('Progress must be a number between 0 and 100', 400, 'INVALID_PROGRESS');
      }

      const existingGoal = await Goal.findById(goalId);
      if (!existingGoal) {
        throw new AppError('Goal not found', 404, 'GOAL_NOT_FOUND');
      }

      const newStatus = progress >= 100 ? 'completed' : 'active';

      const updatedGoal = await Goal.update(goalId, {
        progress,
        status: newStatus,
      });

      return {
        ...updatedGoal,
        completion: goalService.calculateCompletion(updatedGoal),
      };
    } catch (error) {
      console.error('Error updating goal progress:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update goal progress', 500, 'GOAL_UPDATE_ERROR');
    }
  },

  /**
   * Calculate completion percentage
   * If goal.progress exists, return it; otherwise derive from metadata.
   */
  calculateCompletion (goal) {
    if (!goal) return 0;

    // Prefer explicit progress if set
    if (goal.progress !== undefined && goal.progress !== null) {
      return Math.min(100, Math.max(0, Number(goal.progress)));
    }

    // Simple heuristic fallback: goals with a target date
    if (goal.target_date) {
      const created = new Date(goal.created_at);
      const target = new Date(goal.target_date);
      const now = new Date();
      if (target <= created) return 100;
      const elapsed = Math.min(now - created, target - created);
      return Math.round((elapsed / (target - created)) * 100);
    }

    return 0;
  },
};

module.exports = goalService;
