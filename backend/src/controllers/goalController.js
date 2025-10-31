// Goals CRUD operations controller
const goalService = require('../services/goalService');
const { z } = require('zod');

// Validation schemas
const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  category: z.string().max(100, "Category must be less than 100 characters").optional(),
  difficulty_level: z.enum(['easy', 'medium', 'hard']).default('medium'),
  target_completion_date: z.string().optional().refine(date => {
    if (!date) return true;
    const parsedDate = new Date(date);
    return parsedDate > new Date();
  }, "Target date must be in the future"),
  is_public: z.boolean().default(false)
});

const goalController = {
  // Get all goals for authenticated user
  getGoals: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const goals = await goalService.getUserGoals(userId);
      
      res.json({
        success: true,
        data: goals,
        message: 'Goals retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single goal by ID
  getGoalById: async (req, res, next) => {
    try {
      const goalId = req.params.id;
      const userId = req.user.userId;
      
      const goal = await goalService.getGoalById(goalId, userId);
      
      if (!goal) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
      }

      res.json({
        success: true,
        data: goal,
        message: 'Goal retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new goal
  createGoal: async (req, res, next) => {
    try {
      // Validate request body
      const validatedData = createGoalSchema.parse(req.body);
      const userId = req.user.userId;

      // Create goal
      const newGoal = await goalService.createGoal({
        ...validatedData,
        user_id: userId
      });

      res.status(201).json({
        success: true,
        data: newGoal,
        message: 'Goal created successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }
      next(error);
    }
  },

  // Update existing goal
  updateGoal: async (req, res, next) => {
    try {
      const goalId = req.params.id;
      const userId = req.user.userId;
      
      // Validate request body (partial update allowed)
      const validatedData = createGoalSchema.partial().parse(req.body);

      const updatedGoal = await goalService.updateGoal(goalId, userId, validatedData);

      if (!updatedGoal) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
      }

      res.json({
        success: true,
        data: updatedGoal,
        message: 'Goal updated successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }
      next(error);
    }
  },

  // Delete goal
  deleteGoal: async (req, res, next) => {
    try {
      const goalId = req.params.id;
      const userId = req.user.userId;

      const deleted = await goalService.deleteGoal(goalId, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
      }

      res.json({
        success: true,
        message: 'Goal deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Update goal progress
  updateProgress: async (req, res, next) => {
    try {
      const goalId = req.params.id;
      const { progress_percentage } = req.body;
      
      // Validate progress percentage
      if (typeof progress_percentage !== 'number' || progress_percentage < 0 || progress_percentage > 100) {
        return res.status(400).json({
          success: false,
          message: 'Progress percentage must be a number between 0 and 100'
        });
      }
      
      const updatedProgress = await goalService.updateProgress(goalId, progress_percentage);
      
      if (!updatedProgress) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
      }

      res.json({
        success: true,
        data: updatedProgress,
        message: 'Goal progress updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = goalController;