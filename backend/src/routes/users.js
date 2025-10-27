// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Get authenticated user's profile
router.get('/profile', auth, userController.getProfile);

// Update authenticated user's profile information
router.put('/profile', auth, userController.updateProfile);

// Get user learning statistics and performance data
router.get('/statistics', auth, userController.getStatistics);

// Delete user account and related data
router.delete('/account', auth, userController.deleteAccount);

module.exports = router;
