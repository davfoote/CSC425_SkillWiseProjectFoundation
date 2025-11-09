// Goal business logic using the existing Goal model (Postgres)
const Goal = require('../models/Goal');

const goalService = {
  // Get all goals for a specific user
  getUserGoals: async (userId) => {
    if (!userId) throw new Error('UserId is required');
    const goals = await Goal.findByUserId(userId);
    return goals;
  },

  // Create a new goal for the user with minimal validation
  createGoal: async (goalData, userId) => {
    if (!userId) throw new Error('UserId is required');
    if (!goalData || !goalData.title) {
      const err = new Error('Title is required');
      err.statusCode = 400;
      throw err;
    }

    const payload = {
      title: goalData.title,
      description: goalData.description || null,
      user_id: userId,
      // normalize possible keys
      target_date: goalData.targetDate || goalData.target_date || null,
      type: goalData.type || null,
    };

    const created = await Goal.create(payload);
    return created;
  },

  // Update an existing goal (only fields provided)
  updateGoal: async (goalId, updateData, userId) => {
    if (!goalId) throw new Error('Goal id is required');

    // Ensure the goal exists and belongs to the user
    const existing = await Goal.findById(goalId);
    if (!existing) {
      const err = new Error('Goal not found');
      err.statusCode = 404;
      throw err;
    }
    if (existing.user_id !== userId) {
      const err = new Error('Not authorized to update this goal');
      err.statusCode = 403;
      throw err;
    }

    const updatePayload = {
      title: updateData.title,
      description: updateData.description,
      target_date: updateData.targetDate || updateData.target_date,
      progress: typeof updateData.progress !== 'undefined' ? updateData.progress : undefined,
      status: updateData.status,
    };

    const updated = await Goal.update(goalId, updatePayload);
    return updated;
  },

  // Delete a goal (with ownership check)
  deleteGoal: async (goalId, userId) => {
    if (!goalId) throw new Error('Goal id is required');

    const existing = await Goal.findById(goalId);
    if (!existing) {
      const err = new Error('Goal not found');
      err.statusCode = 404;
      throw err;
    }
    if (existing.user_id !== userId) {
      const err = new Error('Not authorized to delete this goal');
      err.statusCode = 403;
      throw err;
    }

    const deleted = await Goal.delete(goalId);
    return deleted;
  },

  // Simple helper to compute completion percent (if progress field present)
  calculateCompletion: (goal) => {
    if (!goal) return 0;
    if (typeof goal.progress !== 'undefined' && goal.progress !== null) {
      return Number(goal.progress);
    }
    if (typeof goal.progress_percentage !== 'undefined' && goal.progress_percentage !== null) {
      return Number(goal.progress_percentage);
    }
    return 0;
  }
};

module.exports = goalService;