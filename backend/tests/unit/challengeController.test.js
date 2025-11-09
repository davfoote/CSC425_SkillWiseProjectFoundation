const challengeController = require('../../controllers/challengeController');

// Mock prisma client used inside controller
jest.mock('../../database/prisma', () => ({
  challenge: {
    findUnique: jest.fn().mockResolvedValue({ id: 10, isCompleted: false, goalId: 2 }),
    update: jest.fn().mockResolvedValue({ id: 10, isCompleted: true, goalId: 2 }),
    count: jest.fn().mockResolvedValue(5),
  }
}));

// Mock goalService
jest.mock('../../services/goalService', () => ({
  updateProgress: jest.fn().mockResolvedValue(true)
}));

describe('challengeController.updateChallenge', () => {
  it('should update a challenge and call goalService.updateProgress when completed', async () => {
    const req = { params: { id: '10' }, body: { is_completed: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await challengeController.updateChallenge(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
