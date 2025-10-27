// src/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// Get all goals for the authenticated user
router.get('/', auth, goalController.getGoals);

// Get a single goal by ID
router.get('/:id', auth, goalController.getGoalById);

// Create a new goal
router.post('/', auth, goalController.createGoal);

// Update an existing goal
router.put('/:id', auth, goalController.updateGoal);

// Delete a goal
router.delete('/:id', auth, goalController.deleteGoal);

module.exports = router;
