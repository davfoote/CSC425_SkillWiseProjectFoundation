/**
 * Challenge Routes - /api/challenges/*
 * 
 * Provides endpoints for challenge management including:
 * - GET /         - List all challenges with filtering
 * - GET /:id      - Get specific challenge details
 * - POST /        - Create new challenge (admin)
 * - PUT /:id      - Update challenge (admin)
 * - DELETE /:id   - Delete challenge (admin)
 */

const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const auth = require('../middleware/auth');

// Get all challenges with optional filtering
// Query params: category, difficulty, isActive
router.get('/', auth, challengeController.getChallenges);

// Get single challenge by ID
router.get('/:id', auth, challengeController.getChallengeById);

// Create new challenge (admin only - basic implementation)
router.post('/', auth, challengeController.createChallenge);

// Update challenge (admin only - basic implementation)
router.put('/:id', auth, challengeController.updateChallenge);

// Delete challenge (admin only - basic implementation)
router.delete('/:id', auth, challengeController.deleteChallenge);

module.exports = router;