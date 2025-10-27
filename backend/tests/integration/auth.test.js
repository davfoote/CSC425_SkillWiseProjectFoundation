// tests/integration/auth.test.js

const request = require('supertest');

// Mock authService used by the controller
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
};
jest.mock('../../src/services/authService', () => mockAuthService);

// Bring up the real app (uses routes/controllers)
const app = require('../../src/app');

describe('Authentication Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('registers a new user and sets refresh cookie', async () => {
      mockAuthService.register.mockResolvedValue({
        user: { id: 1, email: 'new@user.com', firstName: 'New', lastName: 'User', role: 'student' },
        accessToken: 'access-token-abc',
        refreshToken: 'refresh-token-xyz',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'new@user.com',
          password: 'Password1!',
          confirmPassword: 'Password1!',
          firstName: 'New',
          lastName: 'User',
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        user: { id: 1, email: 'new@user.com' },
        accessToken: 'access-token-abc',
      });
      // Cookie should be set by controller
      const setCookie = res.headers['set-cookie'] || [];
      expect(setCookie.join(';')).toMatch(/refreshToken=/i);
      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: 'new@user.com',
        password: 'Password1!',
        firstName: 'New',
        lastName: 'User',
      });
    });

    it('400 if required fields missing', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in a user and sets refresh cookie', async () => {
      mockAuthService.login.mockResolvedValue({
        user: { id: 2, email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'student' },
        accessToken: 'access-token-login',
        refreshToken: 'refresh-token-login',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password1!' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        user: { id: 2, email: 'test@example.com' },
        accessToken: 'access-token-login',
      });
      const setCookie = res.headers['set-cookie'] || [];
      expect(setCookie.join(';')).toMatch(/refreshToken=/i);
      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'Password1!');
    });

    it('400 if email or password missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'x@example.com' });
      expect(res.status).toBe(400);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('rotates refresh token and returns new access token', async () => {
      mockAuthService.refreshToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'rotated-refresh-token',
      });

      const res = await request(app)
        .post('/api/auth/refresh')
        // Controller can read from body, header, or cookie; we use header to avoid cookie parsing
        .set('x-refresh-token', 'old-refresh-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ accessToken: 'new-access-token' });
      const setCookie = res.headers['set-cookie'] || [];
      expect(setCookie.join(';')).toMatch(/refreshToken=rotated-refresh-token/i);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('old-refresh-token');
    });

    it('401 when no refresh token provided', async () => {
      const res = await request(app).post('/api/auth/refresh');
      expect(res.status).toBe(401);
      expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('clears refresh cookie and returns 204', async () => {
      mockAuthService.logout.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/logout')
        .set('x-refresh-token', 'some-refresh-token');

      expect(res.status).toBe(204);
      // should clear cookie (presence of Set-Cookie with expired/empty value)
      const setCookie = res.headers['set-cookie'] || [];
      expect(setCookie.join(';')).toMatch(/refreshToken=/i);
      expect(mockAuthService.logout).toHaveBeenCalledWith('some-refresh-token');
    });
  });
});
