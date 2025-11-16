/**
 * Challenge Routes - /api/challenges/*
 *
 * Provides endpoints for challenge management including:
 * - GET /         - List all challenges with filtering
 * - GET /:id      - Get specific challenge details
 * - GET /goal/:goalId - Get challenges for a specific goal
 * - POST /        - Create new challenge
 * - PUT /:id      - Update challenge
 * - DELETE /:id   - Delete challenge
 */

const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const auth = require('../middleware/auth');

// Get all challenges with optional filtering
// Query params: category, difficulty, isActive, goalId, userId
router.get('/', auth, challengeController.getChallenges);

// Get challenges for a specific goal (must be before /:id route to avoid conflicts)
router.get('/goal/:goalId', auth, challengeController.getChallengesByGoal);

// Get single challenge by ID
router.get('/:id', auth, challengeController.getChallengeById);

// Create new challenge
router.post('/', auth, challengeController.createChallenge);

// Update challenge
router.put('/:id', auth, challengeController.updateChallenge);

// Delete challenge
router.delete('/:id', auth, challengeController.deleteChallenge);

module.exports = router;
