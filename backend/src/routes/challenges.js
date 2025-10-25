// TODO: Implement challenge routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'challenges list placeholder' }));

module.exports = router;
