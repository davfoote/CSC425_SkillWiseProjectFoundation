// AI routes for generating challenges, feedback, and hints
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// POST /ai/generateChallenge - Generate a new challenge using AI
router.post('/generateChallenge', auth, aiController.generateChallenge);

// POST /ai/feedback - Generate AI feedback for submission
router.post('/feedback', auth, aiController.generateFeedback);

// GET /ai/hints/:challengeId - Get hints for a challenge
router.get('/hints/:challengeId', auth, aiController.getHints);

// GET /ai/suggestions - Get challenge suggestions
router.get('/suggestions', auth, aiController.suggestChallenges);

// GET /ai/analysis - Get progress analysis
router.get('/analysis', auth, aiController.analyzeProgress);

module.exports = router;
