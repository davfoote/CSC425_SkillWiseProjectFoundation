// Goal CRUD endpoints implementation with Express, Prisma, and PostgreSQL
const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');
const { goalValidation } = require('../middleware/validation');

/**
 * @route   GET /api/goals
 * @desc    Get all goals for authenticated user
 * @access  Private
 */
router.get('/', auth, goalController.getGoals);

/**
 * @route   GET /api/goals/:id
 * @desc    Get single goal by ID
 * @access  Private (user can only access their own goals)
 */
router.get('/:id', auth, goalController.getGoalById);

/**
 * @route   POST /api/goals
 * @desc    Create new goal
 * @access  Private
 */
router.post('/', auth, goalValidation, goalController.createGoal);

/**
 * @route   PUT /api/goals/:id
 * @desc    Update existing goal
 * @access  Private (user can only update their own goals)
 */
router.put('/:id', auth, goalController.updateGoal);

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete goal
 * @access  Private (user can only delete their own goals)
 */
router.delete('/:id', auth, goalController.deleteGoal);

/**
 * @route   PATCH /api/goals/:id/progress
 * @desc    Update goal progress percentage
 * @access  Private (user can only update their own goals)
 */
router.patch('/:id/progress', auth, goalController.updateProgress);

module.exports = router;
