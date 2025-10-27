// tests/integration/auth.integration.test.js
// Real integration tests for authentication flows (register, login, refresh, logout)
const request = require('supertest');
// Ensure test environment and TEST_DATABASE_URL are loaded before app modules that create DB pools
const { testPool, clearTestData } = require('../setup');
const app = require('../../src/app');

describe('Authentication integration (full stack)', () => {
  const testUser = {
    email: 'inttest.user@example.com',
    password: 'TestPass123!',
    firstName: 'Integration',
    lastName: 'Tester',
  };

  beforeAll(async () => {
    // Ensure DB is clean before tests
    await clearTestData();
  });

  afterEach(async () => {
    // Clear data between tests
    await clearTestData();
  });

  // Note: test pool cleanup handled by tests/setup.js afterAll

  test('register -> login -> refresh -> logout', async () => {
    const agent = request.agent(app);

    // Register
    const regRes = await agent
      .post('/api/auth/register')
      .send({
        email: testUser.email,
        password: testUser.password,
        confirmPassword: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      });

    expect(regRes.status).toBe(201);
    expect(regRes.body).toHaveProperty('user');
    expect(regRes.body).toHaveProperty('accessToken');

    const setCookie = regRes.headers['set-cookie'] || [];
    expect(setCookie.join(';')).toMatch(/refreshToken=/i);

    // Extract refresh token from Set-Cookie
    const cookieHeader = setCookie[0] || '';
    const refreshMatch = cookieHeader.match(/refreshToken=([^;]+)/);
    const refreshToken = refreshMatch ? refreshMatch[1] : null;
    expect(refreshToken).toBeTruthy();

    // Login (should also set refresh cookie)
    const loginRes = await agent.post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('user');
    expect(loginRes.body).toHaveProperty('accessToken');

    // Refresh using header (controller reads header as fallback)
    const refreshRes = await agent.post('/api/auth/refresh').set('x-refresh-token', refreshToken).send();
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
    const setCookie2 = refreshRes.headers['set-cookie'] || [];
    // Rotation may be disabled; only assert cookie when present
    if (setCookie2.length > 0) {
      expect(setCookie2.join(';')).toMatch(/refreshToken=/i);
    }

    // Logout (should return 204 and clear cookie)
    const logoutRes = await agent.post('/api/auth/logout').set('x-refresh-token', refreshToken).send();
    expect(logoutRes.status).toBe(204);
    const logoutCookies = logoutRes.headers['set-cookie'] || [];
    expect(logoutCookies.join(';')).toMatch(/refreshToken=/i);
  });

  test('invalid refresh token returns 401', async () => {
    const res = await request(app).post('/api/auth/refresh').set('x-refresh-token', 'this-is-invalid').send();
    expect(res.status).toBe(401);
  });
});
