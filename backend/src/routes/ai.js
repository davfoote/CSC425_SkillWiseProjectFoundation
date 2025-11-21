// TODO: Implement AI routes

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const { optionalAuth } = require('../middleware/jwtAuth');
const multer = require('multer');

// Use memory storage so files are available in req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// POST: Generate a challenge (optional auth — logs user if provided)
router.post('/generateChallenge', optionalAuth, aiController.generateChallenge);

// Submit for feedback (accepts file or text). Provide both /submitForFeedback and /feedback
router.post('/submitForFeedback', optionalAuth, upload.single('file'), aiController.submitForFeedback);
router.post('/feedback', auth, upload.single('file'), aiController.submitForFeedback);
router.get('/hints/:challengeId', auth, aiController.getHints);
router.get('/suggestions', auth, aiController.suggestChallenges);
router.get('/analysis', auth, aiController.analyzeProgress);

module.exports = router;
