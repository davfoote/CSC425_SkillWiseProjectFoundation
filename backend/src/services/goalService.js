// Goal business logic and database operations using Prisma
const prisma = require('../database/prisma');

const goalService = {
  // Get all goals for a user
  getUserGoals: async (userId) => {
    try {
      const goals = await prisma.goal.findMany({
        where: {
          userId: parseInt(userId)
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficultyLevel: true,
          targetCompletionDate: true,
          isCompleted: true,
          completionDate: true,
          progressPercentage: true,
          pointsReward: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      // Transform field names to match API expectations
      return goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        difficulty_level: goal.difficultyLevel,
        target_completion_date: goal.targetCompletionDate,
        is_completed: goal.isCompleted,
        completion_date: goal.completionDate,
        progress_percentage: goal.progressPercentage,
        points_reward: goal.pointsReward,
        is_public: goal.isPublic,
        created_at: goal.createdAt,
        updated_at: goal.updatedAt
      }));
    } catch (error) {
      throw new Error(`Failed to fetch user goals: ${error.message}`);
    }
  },

  // Get single goal by ID and user ID
  getGoalById: async (goalId, userId) => {
    try {
      const goal = await prisma.goal.findFirst({
        where: {
          id: parseInt(goalId),
          userId: parseInt(userId)
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficultyLevel: true,
          targetCompletionDate: true,
          isCompleted: true,
          completionDate: true,
          progressPercentage: true,
          pointsReward: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      if (!goal) return null;
      
      // Transform field names to match API expectations
      return {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        difficulty_level: goal.difficultyLevel,
        target_completion_date: goal.targetCompletionDate,
        is_completed: goal.isCompleted,
        completion_date: goal.completionDate,
        progress_percentage: goal.progressPercentage,
        points_reward: goal.pointsReward,
        is_public: goal.isPublic,
        created_at: goal.createdAt,
        updated_at: goal.updatedAt
      };
    } catch (error) {
      throw new Error(`Failed to fetch goal: ${error.message}`);
    }
  },

  // Create new goal
  createGoal: async (goalData) => {
    try {
      const {
        user_id,
        title,
        description,
        category,
        difficulty_level = 'medium',
        target_completion_date,
        is_public = false
      } = goalData;

      // Calculate points based on difficulty
      const pointsReward = goalService.calculatePointsReward(difficulty_level);

      const goal = await prisma.goal.create({
        data: {
          userId: parseInt(user_id),
          title,
          description,
          category,
          difficultyLevel: difficulty_level,
          targetCompletionDate: target_completion_date ? new Date(target_completion_date) : null,
          isPublic: is_public,
          pointsReward
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficultyLevel: true,
          targetCompletionDate: true,
          isCompleted: true,
          completionDate: true,
          progressPercentage: true,
          pointsReward: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Transform field names to match API expectations
      return {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        difficulty_level: goal.difficultyLevel,
        target_completion_date: goal.targetCompletionDate,
        is_completed: goal.isCompleted,
        completion_date: goal.completionDate,
        progress_percentage: goal.progressPercentage,
        points_reward: goal.pointsReward,
        is_public: goal.isPublic,
        created_at: goal.createdAt,
        updated_at: goal.updatedAt
      };
    } catch (error) {
      throw new Error(`Failed to create goal: ${error.message}`);
    }
  },

  // Update existing goal
  updateGoal: async (goalId, userId, updateData) => {
    try {
      const allowedFields = {
        'title': 'title',
        'description': 'description',
        'category': 'category',
        'difficulty_level': 'difficultyLevel',
        'target_completion_date': 'targetCompletionDate',
        'is_public': 'isPublic',
        'progress_percentage': 'progressPercentage',
        'is_completed': 'isCompleted'
      };

      const prismaUpdateData = {};

      Object.keys(updateData).forEach(key => {
        if (allowedFields[key]) {
          const prismaField = allowedFields[key];
          let value = updateData[key];
          
          // Handle special cases
          if (key === 'target_completion_date' && value) {
            value = new Date(value);
          }
          
          prismaUpdateData[prismaField] = value;
        }
      });

      if (Object.keys(prismaUpdateData).length === 0) {
        throw new Error('No valid fields to update');
      }

      // If completing goal, set completion_date and progress to 100%
      if (updateData.is_completed) {
        prismaUpdateData.completionDate = new Date();
        prismaUpdateData.progressPercentage = 100;
      }

      const goal = await prisma.goal.update({
        where: {
          id: parseInt(goalId),
          userId: parseInt(userId)
        },
        data: prismaUpdateData,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficultyLevel: true,
          targetCompletionDate: true,
          isCompleted: true,
          completionDate: true,
          progressPercentage: true,
          pointsReward: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Transform field names to match API expectations
      return {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        difficulty_level: goal.difficultyLevel,
        target_completion_date: goal.targetCompletionDate,
        is_completed: goal.isCompleted,
        completion_date: goal.completionDate,
        progress_percentage: goal.progressPercentage,
        points_reward: goal.pointsReward,
        is_public: goal.isPublic,
        created_at: goal.createdAt,
        updated_at: goal.updatedAt
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Goal not found
      }
      throw new Error(`Failed to update goal: ${error.message}`);
    }
  },

  // Delete goal
  deleteGoal: async (goalId, userId) => {
    try {
      const deletedGoal = await prisma.goal.delete({
        where: {
          id: parseInt(goalId),
          userId: parseInt(userId)
        },
        select: {
          id: true
        }
      });
      return !!deletedGoal;
    } catch (error) {
      if (error.code === 'P2025') {
        return false; // Goal not found
      }
      throw new Error(`Failed to delete goal: ${error.message}`);
    }
  },

  // Update goal progress
  updateProgress: async (goalId, progress) => {
    try {
      const goal = await prisma.goal.update({
        where: {
          id: parseInt(goalId)
        },
        data: {
          progressPercentage: parseInt(progress)
        },
        select: {
          progressPercentage: true
        }
      });
      
      return {
        progress_percentage: goal.progressPercentage
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Goal not found
      }
      throw new Error(`Failed to update progress: ${error.message}`);
    }
  },

  // Calculate points reward based on difficulty
  calculatePointsReward: (difficulty_level) => {
    const pointsMap = {
      'easy': 100,
      'medium': 200,
      'hard': 300
    };
    return pointsMap[difficulty_level] || 200;
  },

  // Calculate goal completion percentage
  calculateCompletion: (goal) => {
    if (goal.is_completed) {
      return 100;
    }
    return goal.progress_percentage || 0;
  }
};

module.exports = goalService;