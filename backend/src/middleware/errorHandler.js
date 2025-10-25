// TODO: Implement error handling middleware
module.exports = (err, req, res, next) => {
  // minimal error handler
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal Server Error' });
};
