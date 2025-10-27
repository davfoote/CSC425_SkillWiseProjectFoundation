// tests/unit/controllers/authController.test.js

jest.mock('../../../src/services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
}));

const authService = require('../../../src/services/authService');
const authController = require('../../../src/controllers/authController');

// Minimal mock for Express res/next
const createRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.cookie = jest.fn(() => res);
  res.clearCookie = jest.fn(() => res);
  return res;
};

describe('AuthController - unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('logs in with valid credentials, sets refresh cookie, returns user and access token', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'Password1!' },
      };
      const res = createRes();
      const next = jest.fn();

      authService.login.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'student' },
        accessToken: 'access-abc',
        refreshToken: 'refresh-xyz',
      });

      await authController.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'Password1!');
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-xyz',
        expect.objectContaining({
          httpOnly: true,
          sameSite: expect.any(String),
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'student' },
        accessToken: 'access-abc',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes error to next() when credentials are invalid', async () => {
      const req = { body: { email: 'bad@example.com', password: 'nope' } };
      const res = createRes();
      const next = jest.fn();
      const err = Object.assign(new Error('Invalid credentials'), { statusCode: 401, code: 'INVALID_CREDENTIALS' });

      authService.login.mockRejectedValue(err);

      await authController.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith('bad@example.com', 'nope');
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('registers a new user, sets refresh cookie, returns user and access token', async () => {
      const req = {
        body: {
          email: 'new@user.com',
          password: 'Password1!',
          firstName: 'New',
          lastName: 'User',
        },
      };
      const res = createRes();
      const next = jest.fn();

      authService.register.mockResolvedValue({
        user: { id: 2, email: 'new@user.com', firstName: 'New', lastName: 'User', role: 'student' },
        accessToken: 'access-new',
        refreshToken: 'refresh-new',
      });

      await authController.register(req, res, next);

      expect(authService.register).toHaveBeenCalledWith({
        email: 'new@user.com',
        password: 'Password1!',
        firstName: 'New',
        lastName: 'User',
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-new',
        expect.objectContaining({
          httpOnly: true,
          sameSite: expect.any(String),
        }),
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: { id: 2, email: 'new@user.com', firstName: 'New', lastName: 'User', role: 'student' },
        accessToken: 'access-new',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes duplicate email error to next()', async () => {
      const req = {
        body: {
          email: 'dupe@user.com',
          password: 'Password1!',
          firstName: 'Dupe',
          lastName: 'User',
        },
      };
      const res = createRes();
      const next = jest.fn();
      const err = Object.assign(new Error('Email already in use'), { statusCode: 409, code: 'DUPLICATE_EMAIL' });

      authService.register.mockRejectedValue(err);

      await authController.register(req, res, next);

      expect(authService.register).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
