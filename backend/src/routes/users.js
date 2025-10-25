// TODO: Implement user routes
const express = require('express');
const router = express.Router();

router.get('/me', (req, res) => res.json({ message: 'user me placeholder' }));

module.exports = router;
