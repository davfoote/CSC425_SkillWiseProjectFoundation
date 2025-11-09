// Unit tests for goalService using mocked Goal model
jest.mock('../../../src/models/Goal', () => ({
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
}));

const Goal = require('../../../src/models/Goal');
const goalService = require('../../../src/services/goalService');

describe('goalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getUserGoals maps DB fields to API shape', async () => {
    const dbRows = [
      {
        id: 1,
        title: 'Learn React',
        description: 'Practice components',
        user_id: 42,
        target_completion_date: '2025-12-31',
        difficulty_level: 'medium',
        progress_percentage: 20,
        is_completed: false,
        created_at: '2025-01-01',
        updated_at: '2025-01-02'
      }
    ];
    Goal.findByUserId.mockResolvedValue(dbRows);

    const res = await goalService.getUserGoals(42);
    expect(Goal.findByUserId).toHaveBeenCalledWith(42);
    expect(res).toHaveLength(1);
    expect(res[0]).toMatchObject({
      id: 1,
      title: 'Learn React',
      user_id: 42,
      progress_percentage: 20,
      is_completed: false
    });
  });

  test('createGoal attaches user_id and returns created goal shape', async () => {
    const payload = { title: 'New Goal', description: 'desc', target_completion_date: '2025-11-30' };
    const userId = 7;
    const createdRow = Object.assign({ id: 5, user_id: userId, difficulty_level: 'easy', progress_percentage: 0, is_completed: false, created_at: 'now', updated_at: 'now' }, payload);
    Goal.create.mockResolvedValue(createdRow);

    const created = await goalService.createGoal(payload, userId);
    expect(Goal.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Goal', user_id: 7 }));
    expect(created).toMatchObject({ id: 5, title: 'New Goal', user_id: 7 });
  });

  test('updateProgress marks completed when progress >= 100', async () => {
    const updatedRow = { id: 9, progress_percentage: 100, is_completed: true };
    Goal.update.mockResolvedValue(updatedRow);

    const res = await goalService.updateProgress(9, 100);
    expect(Goal.update).toHaveBeenCalledWith(9, expect.objectContaining({ progress_percentage: 100, is_completed: true }));
    expect(res).toEqual(updatedRow);
  });
});
// TODO: Implement goal service unit tests
const goalService = require('../../src/services/goalService');

describe('GoalService', () => {
  describe('createGoal', () => {
    test('should create goal with valid data', async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });

  describe('calculateCompletion', () => {
    test('should calculate correct completion percentage', () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });

  // TODO: Add more test cases
});

module.exports = {};