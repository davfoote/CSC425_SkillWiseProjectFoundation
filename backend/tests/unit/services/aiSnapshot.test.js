jest.mock('openai');

const OpenAI = require('openai');

describe('AI response snapshots', () => {
  test('generateChallenge returns deterministic parsed challenge (snapshot)', async () => {
    const fakeContent = JSON.stringify({
      title: 'Sum Two Numbers',
      description: 'Given two integers, return their sum.',
      difficulty_level: 'easy',
      category: 'algorithms',
      examples: ['Input: 1 2 Output: 3'],
      tags: ['math','beginner'],
      learning_objectives: ['addition']
    });

    const mockCreate = jest.fn().mockResolvedValue({ choices: [{ message: { content: fakeContent } }] });
    OpenAI.mockImplementation(() => ({ chat: { completions: { create: mockCreate } } }));

    const aiService = require('../../../src/services/aiService');
    const result = await aiService.generateChallenge({ difficulty: 'easy', category: 'algorithms' });

    expect(JSON.stringify(result.challenge, null, 2)).toMatchSnapshot();
  });

  test('generateFeedback returns deterministic parsed feedback (snapshot)', async () => {
    const feedbackJson = JSON.stringify({
      summary: 'Well-structured solution with minor edge-case issues.',
      strengths: ['Correct algorithm', 'Clear variable names'],
      weaknesses: ['No input validation'],
      suggestions: ['Add edge-case tests', 'Validate inputs'],
      score: 85
    });

    const mockCreate = jest.fn().mockResolvedValue({ choices: [{ message: { content: feedbackJson } }] });
    OpenAI.mockImplementation(() => ({ chat: { completions: { create: mockCreate } } }));

    const aiService = require('../../../src/services/aiService');
    const result = await aiService.generateFeedback({ text: 'some code' });

    expect(JSON.stringify(result.feedback, null, 2)).toMatchSnapshot();
  });
});
