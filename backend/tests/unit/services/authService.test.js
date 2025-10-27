// tests/unit/services/authService.test.js

jest.mock('../../../src/database/connection', () => ({
  query: jest.fn(),
}));
jest.mock('../../../src/utils/jwt', () => ({
  generateToken: jest.fn(() => 'access-token-123'),
  generateRefreshToken: jest.fn(() => 'refresh-token-456'),
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const db = require('../../../src/database/connection');
const jwtUtils = require('../../../src/utils/jwt');
const bcrypt = require('bcryptjs');
const authService = require('../../../src/services/authService');

describe('AuthService - unit', () => {
  const email = 'user@example.com';
  const password = 'Password1!';
  const hashed = '$2b$12$abcdefghijklmnopqrstuv'; // dummy hash

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BCRYPT_ROUNDS = '12';
  });

  describe('login', () => {
    it('authenticates valid user and returns user + tokens', async () => {
      db.query
        // first query: select user by email
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            email,
            first_name: 'Test',
            last_name: 'User',
            role: 'student',
            password_hash: hashed,
          }],
          rowCount: 1,
        })
        // optional: insert refresh token (if service does that)
        .mockResolvedValueOnce({ rows: [], rowCount: 1 });

      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.login(email, password);

      expect(db.query).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashed);
      expect(jwtUtils.generateToken).toHaveBeenCalledWith({
        id: 1,
        email,
        role: 'student',
      });
      expect(jwtUtils.generateRefreshToken).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({
        user: { id: 1, email, firstName: 'Test', lastName: 'User', role: 'student' },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      });
    });

    it('rejects when user not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

      await expect(authService.login(email, password)).rejects.toMatchObject({
        statusCode: 401,
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtUtils.generateToken).not.toHaveBeenCalled();
    });

    it('rejects when password mismatch', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          email,
          first_name: 'Test',
          last_name: 'User',
          role: 'student',
          password_hash: hashed,
        }],
        rowCount: 1,
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(email, 'WrongPass1!')).rejects.toMatchObject({
        statusCode: 401,
      });
      expect(jwtUtils.generateToken).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const newUser = {
      email: 'new@user.com',
      password: 'NewPass1!',
      firstName: 'New',
      lastName: 'User',
    };

    it('creates new user, hashes password, returns user + tokens', async () => {
      // 1) ensure not existing
      db.query
        .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // select by email
        .mockResolvedValueOnce({ // insert user
          rows: [{
            id: 2,
            email: newUser.email,
            first_name: 'New',
            last_name: 'User',
            role: 'student',
          }],
          rowCount: 1,
        })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 }); // optional: insert refresh token

      bcrypt.hash.mockResolvedValue('hashed-password-value');

      const res = await authService.register(newUser);

      expect(db.query).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 12);
      expect(jwtUtils.generateToken).toHaveBeenCalledWith({
        id: 2,
        email: newUser.email,
        role: 'student',
      });
      expect(jwtUtils.generateRefreshToken).toHaveBeenCalledWith({ id: 2 });
      expect(res).toEqual({
        user: { id: 2, email: newUser.email, firstName: 'New', lastName: 'User', role: 'student' },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      });
    });

    it('rejects when email already exists', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 9 }],
        rowCount: 1,
      });

      await expect(authService.register(newUser)).rejects.toMatchObject({
        statusCode: 409,
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(jwtUtils.generateToken).not.toHaveBeenCalled();
    });

    it('uses BCRYPT_ROUNDS env or defaults', async () => {
      process.env.BCRYPT_ROUNDS = '10';
      db.query
        .mockResolvedValueOnce({ rows: [], rowCount: 0 })
        .mockResolvedValueOnce({
          rows: [{
            id: 3,
            email: newUser.email,
            first_name: 'New',
            last_name: 'User',
            role: 'student',
          }],
          rowCount: 1,
        })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 });

      bcrypt.hash.mockResolvedValue('hash10');

      await authService.register(newUser);

      expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10);
    });
  });

  describe('refreshToken', () => {
    it('returns new access token (and possibly rotates refresh)', async () => {
      // Mock db if your implementation looks up refresh token storage
      db.query.mockResolvedValueOnce({
        rows: [{ user_id: 1, is_revoked: false }],
        rowCount: 1,
      });

      const res = await authService.refreshToken('refresh-token-456');

      // Depending on your implementation, assert appropriately:
      // Here we only assert new access token shape via jwt util usage.
      expect(jwtUtils.generateToken).toHaveBeenCalled();
      expect(res).toHaveProperty('accessToken', 'access-token-123');
    });
  });
});
