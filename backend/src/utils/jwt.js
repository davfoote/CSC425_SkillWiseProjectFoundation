// TODO: JWT utilities
module.exports = {
  sign: (payload) => 'signed.' + JSON.stringify(payload),
  verify: (token) => ({}),
};
