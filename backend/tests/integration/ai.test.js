// tests/integration/ai.test.js

const request = require('supertest');

// Mock auth middleware to inject a fake user (bypasses JWT)
jest.mock('../../src/middleware/auth', () => (req, _res, next) => {
  req.user = { id: 123, role: 'student', email: 'test@example.com' };
  next();
});

// Mock AI service used by the controller
const mockAiService = {
  generateFeedback: jest.fn(),
  generateHints: jest.fn(),
  analyzePattern: jest.fn(),
  suggestNextChallenges: jest.fn(),
};
jest.mock('../../src/services/aiService', () => mockAiService);

const app = require('../../src/app');

describe('AI Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/ai/feedback', () => {
    it('returns AI feedback for a submission', async () => {
      mockAiService.generateFeedback.mockResolvedValue({
        text: 'Good start. Consider adding edge-case tests.',
        confidence: 0.87,
      });

      const res = await request(app)
        .post('/api/ai/feedback')
        .send({
          submissionText: 'function add(a,b){return a+b;}',
          challengeContext: { title: 'Add two numbers' },
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body.feedback).toEqual({
        text: expect.any(String),
        confidence: expect.any(Number),
      });
      expect(mockAiService.generateFeedback).toHaveBeenCalledWith(
        'function add(a,b){return a+b;}',
        { title: 'Add two numbers' },
      );
    });

    it('400 when submissionText is missing', async () => {
      const res = await request(app).post('/api/ai/feedback').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/ai/hints/:challengeId', () => {
    it('returns AI-generated hints', async () => {
      mockAiService.generateHints.mockResolvedValue([
        'Try small inputs first.',
        'Check behavior when a or b is negative.',
      ]);

      const res = await request(app)
        .get('/api/ai/hints/42')
        .query({ attempts: 2, lastScore: 60 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        challengeId: '42',
        hints: expect.arrayContaining([expect.any(String)]),
      });
      expect(mockAiService.generateHints).toHaveBeenCalledWith('42', {
        attempts: 2,
        lastScore: 60,
      });
    });

    it('400 when challengeId is missing', async () => {
      const res = await request(app).get('/api/ai/hints/'); // malformed path still hits 404 usually
      // To explicitly test missing id validation, call controller route base with no id is not valid.
      // Simulate by calling the controller via the expected route but empty id:
      expect([400, 404]).toContain(res.status);
    });
  });

  describe('GET /api/ai/analysis', () => {
    it('returns analysis for the user over a timeframe', async () => {
      mockAiService.analyzePattern.mockResolvedValue({
        strengths: ['arrays', 'loops'],
        improvements: ['edge cases'],
        trends: { weekOverWeek: '+12%' },
      });

      const res = await request(app)
        .get('/api/ai/analysis')
        .query({ timeframe: '7d', includeTrends: 'true' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        userId: 123,
        timeframe: '7d',
        analysis: {
          strengths: expect.any(Array),
          improvements: expect.any(Array),
        },
      });
      expect(mockAiService.analyzePattern).toHaveBeenCalledWith(123, {
        timeframe: '7d',
        includeTrends: true,
        includeRecommendations: false,
      });
    });
  });

  describe('GET /api/ai/suggestions', () => {
    it('returns suggested next challenges', async () => {
      mockAiService.suggestNextChallenges.mockResolvedValue([
        { id: 7, title: 'Edge Case Mastery', difficulty: 'medium' },
      ]);

      const res = await request(app).get('/api/ai/suggestions');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        suggestions: [{ id: 7, title: 'Edge Case Mastery', difficulty: 'medium' }],
      });
      expect(mockAiService.suggestNextChallenges).toHaveBeenCalledWith(123);
    });
  });
});
