// src/routes/challengeRoutes.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const auth = require('../middleware/auth');

// Local restrictTo helper to avoid reliance on exported middleware shape during
// test runs. Keeps route-level authorization explicit and test-friendly.
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'You do not have permission to perform this action.' });
  }
  return next();
};

// Get all challenges
router.get('/', auth, challengeController.getChallenges);

// Get a single challenge by ID
router.get('/:id', auth, challengeController.getChallengeById);

// Create a new challenge (admin only)
router.post('/', auth, restrictTo('admin'), challengeController.createChallenge);

// Update an existing challenge (admin only)
router.put('/:id', auth, restrictTo('admin'), challengeController.updateChallenge);

// Delete a challenge (admin only)
router.delete('/:id', auth, restrictTo('admin'), challengeController.deleteChallenge);

module.exports = router;
