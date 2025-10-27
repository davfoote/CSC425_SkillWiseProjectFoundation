// tests/integration/challenges.test.js

const request = require('supertest');

// Mock auth middleware to inject a logged-in user by default
jest.mock('../../src/middleware/auth', () => (req, _res, next) => {
  // change role to 'admin' in specific tests via header flag for convenience
  const asAdmin = req.headers['x-test-admin'] === 'true';
  req.user = { id: 101, role: asAdmin ? 'admin' : 'student' };
  next();
});

// Mock challenge service used by the controller
const mockChallengeService = {
  getChallenges: jest.fn(),
  getChallengeById: jest.fn(),
  createChallenge: jest.fn(),
  updateChallenge: jest.fn(),
  deleteChallenge: jest.fn(),
};
jest.mock('../../src/services/challengeService', () => mockChallengeService);

const app = require('../../src/app');

describe('Challenges API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/challenges', () => {
    it('returns list of challenges with optional filters', async () => {
      mockChallengeService.getChallenges.mockResolvedValue([
        { id: 1, title: 'Variables 101', category: 'Programming', difficulty: 'easy' },
        { id: 2, title: 'SQL Joins', category: 'Database', difficulty: 'medium' },
      ]);

      const res = await request(app)
        .get('/api/challenges')
        .query({ category: 'Programming', difficulty: 'easy', active: 'true', q: 'var' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        items: expect.arrayContaining([
          expect.objectContaining({ id: 1, title: 'Variables 101' }),
        ]),
      });
      expect(mockChallengeService.getChallenges).toHaveBeenCalledWith({
        category: 'Programming',
        difficulty: 'easy',
        subject: undefined,
        active: true,
        q: 'var',
      });
    });
  });

  describe('GET /api/challenges/:id', () => {
    it('returns a specific challenge', async () => {
      mockChallengeService.getChallengeById.mockResolvedValue({
        id: 42,
        title: 'Recursion Basics',
        difficulty: 'medium',
      });

      const res = await request(app).get('/api/challenges/42');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        challenge: expect.objectContaining({ id: 42, title: 'Recursion Basics' }),
      });
      expect(mockChallengeService.getChallengeById).toHaveBeenCalledWith('42');
    });

    it('404 when challenge not found', async () => {
      mockChallengeService.getChallengeById.mockResolvedValue(null);

      const res = await request(app).get('/api/challenges/99999');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/challenges (admin)', () => {
    const body = {
      title: 'Graph Traversal',
      description: 'Practice BFS/DFS',
      instructions: 'Implement BFS for a graph',
      category: 'Programming',
      difficulty: 'hard',
      pointsReward: 50,
    };

    it('creates a challenge when admin', async () => {
      mockChallengeService.createChallenge.mockResolvedValue({ id: 10, ...body });

      const res = await request(app)
        .post('/api/challenges')
        .set('x-test-admin', 'true') // elevate role in mocked auth
        .send(body);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        challenge: expect.objectContaining({ id: 10, title: 'Graph Traversal' }),
      });
      expect(mockChallengeService.createChallenge).toHaveBeenCalled();
    });

    it('403 when non-admin tries to create', async () => {
      const res = await request(app).post('/api/challenges').send(body);
      expect(res.status).toBe(403);
      expect(mockChallengeService.createChallenge).not.toHaveBeenCalled();
    });

    it('400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('x-test-admin', 'true')
        .send({ title: 'Incomplete' }); // missing description, instructions, category

      expect(res.status).toBe(400);
      expect(mockChallengeService.createChallenge).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/challenges/:id (admin)', () => {
    it('updates a challenge when admin', async () => {
      mockChallengeService.updateChallenge.mockResolvedValue({
        id: 7,
        title: 'Updated Title',
      });

      const res = await request(app)
        .put('/api/challenges/7')
        .set('x-test-admin', 'true')
        .send({ title: 'Updated Title', pointsReward: 25 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        challenge: expect.objectContaining({ id: 7, title: 'Updated Title' }),
      });
      expect(mockChallengeService.updateChallenge).toHaveBeenCalledWith('7', expect.any(Object));
    });

    it('403 when non-admin tries to update', async () => {
      const res = await request(app).put('/api/challenges/7').send({ title: 'x' });
      expect(res.status).toBe(403);
      expect(mockChallengeService.updateChallenge).not.toHaveBeenCalled();
    });

    it('404 when challenge not found on update', async () => {
      mockChallengeService.updateChallenge.mockResolvedValue(null);
      const res = await request(app)
        .put('/api/challenges/999')
        .set('x-test-admin', 'true')
        .send({ title: 'Nope' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/challenges/:id (admin)', () => {
    it('deletes a challenge when admin', async () => {
      mockChallengeService.deleteChallenge.mockResolvedValue({ id: 5 });

      const res = await request(app)
        .delete('/api/challenges/5')
        .set('x-test-admin', 'true');

      expect(res.status).toBe(204);
      expect(mockChallengeService.deleteChallenge).toHaveBeenCalledWith('5');
    });

    it('403 when non-admin tries to delete', async () => {
      const res = await request(app).delete('/api/challenges/5');
      expect(res.status).toBe(403);
      expect(mockChallengeService.deleteChallenge).not.toHaveBeenCalled();
    });

    it('404 when challenge not found on delete', async () => {
      mockChallengeService.deleteChallenge.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/challenges/404')
        .set('x-test-admin', 'true');

      expect(res.status).toBe(404);
    });
  });
});
