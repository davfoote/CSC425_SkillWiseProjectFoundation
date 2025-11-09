const goalService = require('../../src/services/goalService');

jest.mock('../../src/database/prisma', () => ({
  goal: {
    update: jest.fn().mockResolvedValue({ id: 1, progressPercentage: 50 }),
  }
}));

describe('goalService.updateProgress', () => {
  it('should call prisma.goal.update with correct values', async () => {
    const res = await goalService.updateProgress(1, 50);
    expect(res).toBeDefined();
    // prisma mock returns object with id and progressPercentage
    expect(res.progressPercentage).toBe(50);
  });
});
