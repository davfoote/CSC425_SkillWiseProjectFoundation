// User routes with JWT authentication
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/jwtAuth');

// GET /profile route - Get current user profile
router.get('/profile', authenticateToken, userController.getProfile);

// PUT /profile route - Update user profile
router.put('/profile', authenticateToken, userController.updateProfile);

// GET /statistics route - Get user statistics
router.get('/statistics', authenticateToken, userController.getStatistics);

// DELETE /account route - Delete user account
router.delete('/account', authenticateToken, userController.deleteAccount);

// GET /me route - Get current user data (simple endpoint for testing)
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
