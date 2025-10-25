// TODO: Implement auth routes
const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => res.json({ message: 'register route placeholder' }));
router.post('/login', (req, res) => res.json({ message: 'login route placeholder' }));

module.exports = router;
