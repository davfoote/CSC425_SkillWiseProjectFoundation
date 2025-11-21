const express = require('express');
const router = express.Router();

// Simple route to throw an error for testing Sentry
router.get('/sentry-test', (req, res) => {
  throw new Error('Sentry test error - backend');
});

module.exports = router;
