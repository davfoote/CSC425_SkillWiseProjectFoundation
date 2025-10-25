// TODO: Implement AI routes
const express = require('express');
const router = express.Router();

router.post('/generate-challenges', (req, res) => res.json({ message: 'ai generate placeholder' }));

module.exports = router;
