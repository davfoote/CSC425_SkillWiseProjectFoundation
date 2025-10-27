// src/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');

// Submit work for a specific challenge or task
router.post('/', auth, submissionController.submitWork);

// Get a specific submission by ID
router.get('/:id', auth, submissionController.getSubmission);

// Get all submissions made by a specific user
router.get('/user/:userId', auth, submissionController.getUserSubmissions);

// Update or resubmit a submission
router.put('/:id', auth, submissionController.updateSubmission);

module.exports = router;
