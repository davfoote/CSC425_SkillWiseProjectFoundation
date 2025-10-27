// tests/integration/peerReviews.test.js

const request = require('supertest');

// Mock auth middleware to inject a fake logged-in user
jest.mock('../../src/middleware/auth', () => (req, _res, next) => {
  // Reviewer or reviewee role simulation
  const isReviewer = req.headers['x-reviewer'] === 'true';
  req.user = { id: isReviewer ? 201 : 202, role: 'student' };
  next();
});

// Mock peer review service
const mockPeerReviewService = {
  getReviewAssignments: jest.fn(),
  submitReview: jest.fn(),
  getReceivedReviews: jest.fn(),
  getReviewHistory: jest.fn(),
};
jest.mock('../../src/services/peerReviewService', () => mockPeerReviewService);

const app = require('../../src/app');

describe('Peer Review Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reviews/assignments', () => {
    it('returns assigned peer reviews for reviewer', async () => {
      mockPeerReviewService.getReviewAssignments.mockResolvedValue([
        { id: 1, submissionId: 10, title: 'Intro to Loops', revieweeId: 202 },
        { id: 2, submissionId: 12, title: 'Database Basics', revieweeId: 203 },
      ]);

      const res = await request(app)
        .get('/api/reviews/assignments')
        .set('x-reviewer', 'true'); // triggers reviewer id=201

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        assignments: expect.arrayContaining([
          expect.objectContaining({ id: 1, submissionId: 10 }),
        ]),
      });
      expect(mockPeerReviewService.getReviewAssignments).toHaveBeenCalledWith(201);
    });

    it('returns empty array when user has no assignments', async () => {
      mockPeerReviewService.getReviewAssignments.mockResolvedValue([]);

      const res = await request(app).get('/api/reviews/assignments').set('x-reviewer', 'true');

      expect(res.status).toBe(200);
      expect(res.body.assignments).toHaveLength(0);
    });
  });

  describe('POST /api/reviews', () => {
    const reviewData = {
      submissionId: 15,
      rating: 4,
      reviewText: 'Great structure and logic!',
      criteriaScores: { clarity: 5, creativity: 4, correctness: 4 },
    };

    it('submits a peer review successfully', async () => {
      mockPeerReviewService.submitReview.mockResolvedValue({
        id: 100,
        reviewerId: 201,
        submissionId: 15,
        rating: 4,
        reviewText: 'Great structure and logic!',
      });

      const res = await request(app)
        .post('/api/reviews')
        .set('x-reviewer', 'true')
        .send(reviewData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        review: expect.objectContaining({
          submissionId: 15,
          rating: 4,
          reviewerId: 201,
        }),
      });
      expect(mockPeerReviewService.submitReview).toHaveBeenCalledWith(201, reviewData);
    });

    it('400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('x-reviewer', 'true')
        .send({ rating: 5 }); // missing submissionId and reviewText

      expect(res.status).toBe(400);
      expect(mockPeerReviewService.submitReview).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/reviews/received', () => {
    it('returns all reviews received by a user', async () => {
      mockPeerReviewService.getReceivedReviews.mockResolvedValue([
        { id: 5, reviewerId: 201, rating: 4, reviewText: 'Good job overall!' },
        { id: 6, reviewerId: 203, rating: 3, reviewText: 'Needs better formatting' },
      ]);

      const res = await request(app).get('/api/reviews/received');

      expect(res.status).toBe(200);
      expect(res.body.reviews).toHaveLength(2);
      expect(mockPeerReviewService.getReceivedReviews).toHaveBeenCalledWith(202);
    });
  });

  describe('GET /api/reviews/history', () => {
    it('returns review history for reviewer', async () => {
      mockPeerReviewService.getReviewHistory.mockResolvedValue([
        { id: 7, submissionId: 20, rating: 5, completedAt: '2025-10-10' },
        { id: 8, submissionId: 21, rating: 4, completedAt: '2025-10-11' },
      ]);

      const res = await request(app).get('/api/reviews/history').set('x-reviewer', 'true');

      expect(res.status).toBe(200);
      expect(res.body.history).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 7, rating: 5 })]),
      );
      expect(mockPeerReviewService.getReviewHistory).toHaveBeenCalledWith(201);
    });
  });
});
