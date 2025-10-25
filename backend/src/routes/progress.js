// TODO: Implement progress routes
const express = require('express');
const router = express.Router();

router.get('/goals/:goalId', (req, res) => res.json({ message: 'progress for goal placeholder' }));

module.exports = router;
