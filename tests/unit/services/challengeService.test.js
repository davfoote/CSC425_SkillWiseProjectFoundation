// Unit tests for challengeService using mocked Challenge model
jest.mock('../../../src/models/Challenge', () => ({
  findAll: jest.fn(),
  findByDifficulty: jest.fn(),
  findBySubject: jest.fn(),
  findById: jest.fn()
}));

const Challenge = require('../../../src/models/Challenge');
const challengeService = require('../../../src/services/challengeService');

describe('challengeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getChallenges returns all when no filters provided', async () => {
    const rows = [{ id: 1, title: 'C1' }, { id: 2, title: 'C2' }];
    Challenge.findAll.mockResolvedValue(rows);
    const res = await challengeService.getChallenges();
    expect(Challenge.findAll).toHaveBeenCalled();
    expect(res).toEqual(rows);
  });

  test('getChallenges filters by difficulty', async () => {
    const rows = [{ id: 10, title: 'Easy Task', difficulty_level: 'easy' }];
    Challenge.findByDifficulty.mockResolvedValue(rows);
    const res = await challengeService.getChallenges({ difficulty_level: 'easy' });
    expect(Challenge.findByDifficulty).toHaveBeenCalledWith('easy');
    expect(res).toEqual(rows);
  });

  test('validateCompletion returns points for existing challenge', async () => {
    const row = { id: 3, title: 'T', points_reward: 20 };
    Challenge.findById.mockResolvedValue(row);
    const result = await challengeService.validateCompletion(3, { answer: 'x' });
    expect(Challenge.findById).toHaveBeenCalledWith(3);
    expect(result).toEqual({ valid: true, points: 20 });
  });
});
