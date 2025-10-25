// TODO: add unit tests for authController
const authController = require('../../../src/controllers/authController');

test('authController has register and login', async () => {
  expect(typeof authController.register).toBe('function');
  expect(typeof authController.login).toBe('function');
});
