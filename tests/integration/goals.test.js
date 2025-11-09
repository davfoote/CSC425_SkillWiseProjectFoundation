// Integration-style tests for Goals API using mocked model methods so tests
// can run without a live database. This provides a lightweight smoke test
// for the main goal flows: list, create, update.
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

// Mock the Goal model so we don't depend on a real DB in CI for these smoke tests
jest.mock('../../src/models/Goal', () => ({
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

const Goal = require('../../src/models/Goal');

describe('Goals API Integration (mocked DB)', () => {
  let authToken;

  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing-only';
    // Create a signed token representing user id 123
    authToken = jwt.sign({ id: 123, email: 'tester@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/goals returns user goals', async () => {
    const mockGoals = [{ id: 1, title: 'Test Goal', description: 'desc', user_id: 123, progress_percentage: 10 }];
    Goal.findByUserId.mockResolvedValue(mockGoals);

    const res = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].title).toBe('Test Goal');
    expect(Goal.findByUserId).toHaveBeenCalledWith(123);
  });

  test('POST /api/goals creates a new goal', async () => {
    const payload = { title: 'New Goal', description: 'Do stuff', target_completion_date: '2026-01-01', difficulty_level: 'easy' };
    const created = { id: 99, ...payload, user_id: 123, progress_percentage: 0 };
    Goal.create.mockResolvedValue(created);

    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data.id).toBe(99);
    expect(Goal.create).toHaveBeenCalled();
  });

  test('PUT /api/goals/:id updates an existing goal', async () => {
    const updatePayload = { progress_percentage: 100 };
    const updated = { id: 5, title: 'Finish', progress_percentage: 100 };
    Goal.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/goals/5')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatePayload)
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data.progress_percentage).toBe(100);
    expect(Goal.update).toHaveBeenCalledWith('5', updatePayload);
  });
});
