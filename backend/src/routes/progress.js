// src/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

// Get user progress overview
router.get('/', auth, progressController.getProgress);

// Record a new progress event (e.g., challenge completed, points earned)
router.post('/event', auth, progressController.updateProgress);

// Get progress analytics and performance stats
router.get('/analytics', auth, progressController.getAnalytics);

// Get user milestones and achievements
router.get('/milestones', auth, progressController.getMilestones);

module.exports = router;
