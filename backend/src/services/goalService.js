const prisma = require('../database/prisma');

const goalService = {
  // Get goals for a user
  getUserGoals: async (userId) => {
    const goals = await prisma.goal.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' }
    });
    return goals.map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      user_id: g.userId,
      target_completion_date: g.targetCompletionDate,
      difficulty_level: g.difficultyLevel,
      progress_percentage: g.progressPercentage || 0,
      is_completed: !!g.isCompleted,
      created_at: g.createdAt,
      updated_at: g.updatedAt
    }));
  },

  // Create a new goal
  createGoal: async (goalData, userId) => {
    const payload = {
      title: goalData.title,
      description: goalData.description || null,
      userId: Number(userId),
      targetCompletionDate: goalData.target_completion_date ? new Date(goalData.target_completion_date) : null,
      difficultyLevel: goalData.difficulty_level || 'medium'
    };

    const created = await prisma.goal.create({ data: payload });
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      user_id: created.userId,
      target_completion_date: created.targetCompletionDate,
      difficulty_level: created.difficultyLevel,
      progress_percentage: created.progressPercentage || 0,
      is_completed: !!created.isCompleted,
      created_at: created.createdAt,
      updated_at: created.updatedAt
    };
  },

  // Update a goal (generic update)
  updateGoal: async (goalId, updateData) => {
    const data = {};
    if (updateData.title !== undefined) data.title = updateData.title;
    if (updateData.description !== undefined) data.description = updateData.description;
    if (updateData.target_completion_date !== undefined) data.targetCompletionDate = updateData.target_completion_date ? new Date(updateData.target_completion_date) : null;
    if (updateData.progress_percentage !== undefined) data.progressPercentage = Number(updateData.progress_percentage);
    if (updateData.is_completed !== undefined) data.isCompleted = Boolean(updateData.is_completed);
    if (updateData.difficulty_level !== undefined) data.difficultyLevel = updateData.difficulty_level;

    const updated = await prisma.goal.update({
      where: { id: Number(goalId) },
      data
    });
    return updated;
  },

  // Update progress helper
  updateProgress: async (goalId, progress) => {
    const isCompleted = Number(progress) >= 100;
    const updated = await prisma.goal.update({
      where: { id: Number(goalId) },
      data: { progressPercentage: Number(progress), isCompleted }
    });
    return updated;
  },

  // Calculate completion percentage
  calculateCompletion: (goal) => {
    return goal.progressPercentage || 0;
  }
};

module.exports = goalService;