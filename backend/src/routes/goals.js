// TODO: Implement goals routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'goals list placeholder' }));
router.post('/', (req, res) => res.json({ message: 'create goal placeholder' }));

module.exports = router;
