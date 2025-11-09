// Goal service: use the Goal model to implement business logic
const Goal = require('../models/Goal');

const goalService = {
  // Get goals for a user and normalize fields
  getUserGoals: async (userId) => {
    const goals = await Goal.findByUserId(userId);
    // Map DB columns to API-friendly names
    return goals.map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      user_id: g.user_id,
      target_completion_date: g.target_completion_date,
      difficulty_level: g.difficulty_level,
      progress_percentage: g.progress_percentage || 0,
      is_completed: !!g.is_completed,
      created_at: g.created_at,
      updated_at: g.updated_at
    }));
  },

  // Create a new goal (attaches user_id)
  createGoal: async (goalData, userId) => {
    const payload = Object.assign({}, goalData, { user_id: userId });
    const created = await Goal.create(payload);
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      user_id: created.user_id,
      target_completion_date: created.target_completion_date,
      difficulty_level: created.difficulty_level,
      progress_percentage: created.progress_percentage || 0,
      is_completed: !!created.is_completed,
      created_at: created.created_at,
      updated_at: created.updated_at
    };
  },

  // Update progress percentage and mark completed if >=100
  updateProgress: async (goalId, progress) => {
    const is_completed = (progress >= 100);
    const updated = await Goal.update(goalId, { progress_percentage: progress, is_completed });
    return updated;
  },

  // Calculate completion percentage given goal and its linked challenges (simple placeholder)
  calculateCompletion: (goal) => {
    // If progress_percentage exists use it; fallback to 0
    return goal.progress_percentage || 0;
  }
};

module.exports = goalService;