// TODO: Aggregate routes
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/goals', require('./goals'));
router.use('/challenges', require('./challenges'));
router.use('/progress', require('./progress'));
router.use('/submissions', require('./submissions'));
router.use('/ai', require('./ai'));
router.use('/reviews', require('./reviews'));
router.use('/leaderboard', require('./leaderboard'));

module.exports = router;
