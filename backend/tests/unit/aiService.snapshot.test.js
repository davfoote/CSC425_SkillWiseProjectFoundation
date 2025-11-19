/**
 * Snapshot tests for AI service responses
 * Ensures AI-generated content remains consistent across changes
 */

const promptTemplates = require('../../src/services/promptTemplates');

describe('AI Service Snapshot Tests', () => {
  describe('Prompt Template Snapshots', () => {
    test('should match snapshot for challenge generation prompt with all parameters', () => {
      const config = promptTemplates.getPromptConfig('challengeGeneration', {
        difficulty: 'medium',
        category: 'algorithms',
        language: 'JavaScript',
        topic: 'binary search',
      });

      expect(config).toMatchSnapshot();
    });

    test('should match snapshot for challenge generation prompt with minimal parameters', () => {
      const config = promptTemplates.getPromptConfig('challengeGeneration', {
        difficulty: 'easy',
        category: 'web development',
        language: 'Python',
      });

      expect(config).toMatchSnapshot();
    });

    test('should match snapshot for feedback generation prompt', () => {
      const config = promptTemplates.getPromptConfig('feedbackGeneration', {
        challengeTitle: 'Array Sum Calculator',
        challengeDescription: 'Write a function to sum an array of numbers',
        codeSubmission: 'function sum(arr) { return arr.reduce((a, b) => a + b, 0); }',
        expectedBehavior: 'Should return the sum of all numbers in the array',
        language: 'JavaScript',
      });

      expect(config).toMatchSnapshot();
    });

    test('should match snapshot for hint generation prompt', () => {
      const config = promptTemplates.getPromptConfig('hintGeneration', {
        challengeTitle: 'Binary Search',
        challengeDescription: 'Implement binary search algorithm',
        difficulty: 'medium',
        userAttempts: '3',
      });

      expect(config).toMatchSnapshot();
    });
  });

  describe('Mock AI Response Snapshots', () => {
    test('should match snapshot for mock challenge response - easy difficulty', () => {
      const mockChallenge = {
        success: true,
        challenge: {
          title: 'Easy Algorithms Challenge: Array Operations',
          description: 'Practice your JavaScript skills with this easy difficulty challenge focusing on array operations.',
          difficulty: 'easy',
          category: 'algorithms',
          language: 'JavaScript',
          estimatedTime: 15,
          points: 10,
          testCases: [
            { input: '[1, 2, 3]', expected: 'Depends on implementation' },
            { input: '[4, 5, 6]', expected: 'Depends on implementation' },
          ],
          hints: [
            'Think about the time complexity of your solution',
            'Consider edge cases like empty arrays',
            'Can you optimize the space complexity?',
          ],
          starterCode: 'function solveProblem(input) {\n  // Your code here\n  return input;\n}',
        },
      };

      expect(mockChallenge).toMatchSnapshot();
    });

    test('should match snapshot for mock challenge response - hard difficulty', () => {
      const mockChallenge = {
        success: true,
        challenge: {
          title: 'Hard Data Structures Challenge: Tree Traversal',
          description: 'Practice your Python skills with this hard difficulty challenge focusing on tree traversal.',
          difficulty: 'hard',
          category: 'data structures',
          language: 'Python',
          estimatedTime: 60,
          points: 50,
          testCases: [
            { input: '[1, 2, 3]', expected: 'Depends on implementation' },
            { input: '[4, 5, 6]', expected: 'Depends on implementation' },
          ],
          hints: [
            'Think about the time complexity of your solution',
            'Consider edge cases like empty arrays',
            'Can you optimize the space complexity?',
          ],
          starterCode: 'function solveProblem(input) {\n  // Your code here\n  return input;\n}',
        },
      };

      expect(mockChallenge).toMatchSnapshot();
    });

    test('should match snapshot for mock feedback response', () => {
      const mockFeedback = {
        success: true,
        submissionId: 1,
        attemptNumber: 1,
        feedback: {
          overallScore: 85,
          correctness: {
            score: 90,
            feedback: 'Your solution appears to be functionally correct and handles the main test cases well.',
          },
          codeQuality: {
            score: 80,
            feedback: 'Your JavaScript solution for "Array Sum" shows good understanding. The code is well-structured and handles the main test cases correctly.',
          },
          suggestions: [
            'Consider using more descriptive variable names',
            'Add error handling for edge cases',
            'The time complexity could be improved',
          ],
          strengths: [
            'Clean and readable code structure',
            'Handles main test cases correctly',
            'Good use of built-in functions',
          ],
          improvements: [
            'Add input validation',
            'Consider edge cases like empty inputs',
            'Add comments for complex logic',
          ],
          encouragement: 'Great work! You\'re on the right track. Keep practicing and refining your approach.',
        },
        timestamp: '2025-11-19T00:00:00.000Z',
        processingTimeMs: 250,
        isMock: true,
      };

      expect(mockFeedback).toMatchSnapshot();
    });
  });

  describe('Prompt Rendering Consistency', () => {
    test('should consistently render challenge generation prompts', () => {
      const params1 = {
        difficulty: 'medium',
        category: 'algorithms',
        language: 'JavaScript',
        topic: 'sorting',
      };

      const params2 = {
        difficulty: 'medium',
        category: 'algorithms',
        language: 'JavaScript',
        topic: 'sorting',
      };

      const config1 = promptTemplates.getPromptConfig('challengeGeneration', params1);
      const config2 = promptTemplates.getPromptConfig('challengeGeneration', params2);

      expect(config1.prompt).toEqual(config2.prompt);
      expect(config1).toMatchSnapshot();
    });

    test('should handle missing optional parameters consistently', () => {
      const paramsWithoutTopic = {
        difficulty: 'easy',
        category: 'web development',
        language: 'Python',
      };

      const config = promptTemplates.getPromptConfig('challengeGeneration', paramsWithoutTopic);
      
      expect(config).toMatchSnapshot();
      if (config.prompt) {
        expect(config.prompt).not.toContain('undefined');
        expect(config.prompt).not.toContain('null');
      }
    });
  });

  describe('Template Metadata Snapshots', () => {
    test('should match snapshot for template list', () => {
      const templateNames = ['challengeGeneration', 'feedbackGeneration', 'hintGeneration'];
      
      const metadata = templateNames.map(name => {
        const config = promptTemplates.getPromptConfig(name, {
          difficulty: 'medium',
          category: 'algorithms',
          language: 'JavaScript',
          topic: 'test',
          challengeTitle: 'Test Challenge',
          challengeDescription: 'Test description',
          codeSubmission: 'test code',
          expectedBehavior: 'should work correctly',
          userAttempts: '1',
        });
        
        return {
          name,
          hasSystemMessage: !!config.systemMessage,
          hasPrompt: !!config.prompt,
        };
      });

      expect(metadata).toMatchSnapshot();
    });
  });
});
