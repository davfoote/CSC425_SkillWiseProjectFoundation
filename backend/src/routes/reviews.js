// TODO: Implement peer review routes
const express = require('express');
const router = express.Router();

router.post('/:submissionId/review', (req, res) => res.json({ message: 'review submit placeholder' }));

module.exports = router;
