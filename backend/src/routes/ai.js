// src/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Generate AI feedback for a user’s submission
router.post('/feedback', auth, aiController.generateFeedback);

// Get AI-generated hints for a specific challenge
router.get('/hints/:challengeId', auth, aiController.getHints);

// Suggest new challenges based on user history and performance
router.get('/suggestions', auth, aiController.suggestChallenges);

// Analyze user progress and provide insights or recommendations
router.get('/analysis', auth, aiController.analyzeProgress);

module.exports = router;
