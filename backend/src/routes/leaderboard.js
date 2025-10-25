// TODO: Implement leaderboard routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'leaderboard placeholder' }));

module.exports = router;
