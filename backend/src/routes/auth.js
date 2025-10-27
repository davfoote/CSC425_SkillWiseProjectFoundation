// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

// User login
router.post('/login', validation.loginValidation, authController.login);

// User registration
router.post('/register', validation.registerValidation, authController.register);

// Logout user and invalidate tokens
router.post('/logout', authController.logout);

// Refresh JWT token
router.post('/refresh', authController.refreshToken);

// (Optional) Future routes for password recovery
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

module.exports = router;
