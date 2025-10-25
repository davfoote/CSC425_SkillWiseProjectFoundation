// TODO: Implement request logger
module.exports = (req, res, next) => {
  // lightweight logging for scaffolding
  console.log(`${req.method} ${req.url}`);
  next();
};
