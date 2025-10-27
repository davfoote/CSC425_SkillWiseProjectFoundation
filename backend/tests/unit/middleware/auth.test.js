// tests/unit/middleware/auth.test.js

const jwt = require('jsonwebtoken');
const auth = require('../../../src/middleware/auth');

jest.mock('jsonwebtoken');

describe('Auth Middleware - Unit', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('authenticates valid JWT token', async () => {
    const mockUser = { id: 1, email: 'user@example.com', role: 'student' };
    const token = 'valid.jwt.token';
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockReturnValue(mockUser);

    await auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('rejects invalid JWT token', async () => {
    const token = 'invalid.jwt.token';
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('Invalid token');
    });

    await auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects expired JWT token', async () => {
    const token = 'expired.jwt.token';
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockImplementation(() => {
      throw new jwt.TokenExpiredError('Token expired', new Date());
    });

    await auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token expired' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects missing Authorization header', async () => {
    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authorization header missing' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects malformed Bearer header', async () => {
    req.headers.authorization = 'TokenWithoutBearerPrefix';

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Authorization format' });
    expect(next).not.toHaveBeenCalled();
  });
});
