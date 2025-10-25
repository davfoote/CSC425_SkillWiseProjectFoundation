// TODO: validation helpers
module.exports = {
  validateEmail: (s) => typeof s === 'string' && s.includes('@'),
};
