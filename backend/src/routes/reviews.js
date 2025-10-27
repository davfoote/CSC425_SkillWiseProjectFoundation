// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const peerReviewController = require('../controllers/peerReviewController');
const auth = require('../middleware/auth');

// Get review assignments for the authenticated user
router.get('/assignments', auth, peerReviewController.getReviewAssignments);

// Submit a new peer review
router.post('/', auth, peerReviewController.submitReview);

// Get all reviews received by the authenticated user
router.get('/received', auth, peerReviewController.getReceivedReviews);

// Get review history (reviews user has completed)
router.get('/history', auth, peerReviewController.getReviewHistory);

module.exports = router;
