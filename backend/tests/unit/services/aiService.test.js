// Unit tests for AI service generateChallenge using a mocked OpenAI client
jest.mock('openai');

const OpenAI = require('openai');

describe('aiService.generateChallenge', () => {
  beforeEach(() => {
    OpenAI.mockClear();
  });

  test('parses JSON response from OpenAI and returns challenge object', async () => {
    // Arrange: mock OpenAI client to return a JSON content
    const fakeContent = JSON.stringify({
      title: 'Sum Two Numbers',
      description: 'Given two integers, return their sum.',
      difficulty_level: 'easy',
      category: 'algorithms',
      examples: ['Input: 1 2 Output: 3'],
      tags: ['math','beginner'],
      learning_objectives: ['addition']
    });

    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        { message: { content: fakeContent } }
      ]
    });

    OpenAI.mockImplementation(() => ({ chat: { completions: { create: mockCreate } } }));

    // Now require the service after mocking
    const aiService = require('../../../src/services/aiService');

    // Act
    const result = await aiService.generateChallenge({ difficulty: 'easy', category: 'algorithms' });

    // Assert
    expect(result).toBeDefined();
    expect(result.challenge).toBeDefined();
    expect(result.challenge.title).toBe('Sum Two Numbers');
    expect(result.raw).toContain('Sum Two Numbers');
  });

  test('falls back to raw text when JSON parsing fails', async () => {
    const nonJson = 'Here is a challenge description without JSON formatting.';
    const mockCreate = jest.fn().mockResolvedValue({ choices: [{ message: { content: nonJson } }] });
    OpenAI.mockImplementation(() => ({ chat: { completions: { create: mockCreate } } }));

    const aiService = require('../../../src/services/aiService');

    const result = await aiService.generateChallenge({ difficulty: 'medium', category: 'general' });

    expect(result).toBeDefined();
    expect(result.challenge).toBeDefined();
    expect(result.challenge.description).toContain(nonJson);
  });
});

module.exports = {};
