// AI integration controller for feedback and hints
const aiService = require('../services/aiService');
const pino = require('pino');

const logger = pino({
  name: 'skillwise-ai-controller',
  level: process.env.LOG_LEVEL || 'info',
});

const aiController = {
  // Generate a new challenge using AI
  generateChallenge: async (req, res, next) => {
    try {
      const { difficulty, category, language, topic } = req.body;
      
      logger.info('Received AI challenge generation request:', {
        userId: req.user?.id,
        preferences: { difficulty, category, language, topic },
      });

      // Validate inputs
      const validDifficulties = ['easy', 'medium', 'hard'];
      if (difficulty && !validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid difficulty level. Must be easy, medium, or hard.',
        });
      }

      // Check if we have a real OpenAI API key
      const hasRealApiKey = process.env.OPENAI_API_KEY && 
                            !process.env.OPENAI_API_KEY.includes('dummy') &&
                            process.env.OPENAI_API_KEY.length > 20;

      let result;
      
      if (hasRealApiKey) {
        // Generate challenge using AI
        result = await aiService.generateChallenge({
          difficulty,
          category,
          language,
          topic,
        });
      } else {
        // Return mock challenge when no real API key
        logger.info('🎭 Using mock challenge (no OpenAI API key configured)');
        result = {
          success: true,
          challenge: {
            title: `${difficulty || 'Medium'} ${category || 'Algorithms'} Challenge: ${topic || 'Array Manipulation'}`,
            description: `Practice your ${language || 'JavaScript'} skills with this ${difficulty || 'medium'} difficulty challenge focusing on ${topic || 'array operations'}.`,
            difficulty: difficulty || 'medium',
            category: category || 'algorithms',
            language: language || 'JavaScript',
            estimatedTime: difficulty === 'easy' ? 15 : difficulty === 'hard' ? 60 : 30,
            points: difficulty === 'easy' ? 10 : difficulty === 'hard' ? 50 : 25,
            testCases: [
              { input: '[1, 2, 3]', expected: 'Depends on implementation' },
              { input: '[4, 5, 6]', expected: 'Depends on implementation' },
            ],
            hints: [
              'Think about the time complexity of your solution',
              'Consider edge cases like empty arrays',
              'Can you optimize the space complexity?',
            ],
            starterCode: `function solve${category || 'Problem'}(input) {\n  // Your code here\n  return input;\n}`,
          },
        };
      }
      
      logger.info('Successfully generated challenge via controller:', {
        userId: req.user?.id,
        challengeTitle: result.challenge?.title,
        isMock: !hasRealApiKey,
      });

      res.status(200).json(result);
    } catch (error) {
      logger.error('Error in generateChallenge controller:', {
        error: error.message,
        userId: req.user?.id,
        stack: error.stack,
      });
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate challenge',
      });
    }
  },

  // Generate AI feedback for submission
  submitForFeedback: async (req, res, next) => {
    try {
      const {
        challengeId,
        challengeTitle,
        challengeDescription,
        codeSubmission,
        language = 'JavaScript',
      } = req.body;

      // Validation
      if (!codeSubmission || !codeSubmission.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Code submission is required',
        });
      }

      if (!challengeTitle) {
        return res.status(400).json({
          success: false,
          message: 'Challenge title is required',
        });
      }

      logger.info('Received code submission for feedback:', {
        userId: req.user?.id,
        challengeId,
        challengeTitle,
        language,
        codeLength: codeSubmission.length,
      });

      // For now, return a mock feedback response
      // TODO: Integrate with aiService.generateFeedback() when implemented
      const feedback = {
        success: true,
        submissionId: `sub_${Date.now()}`,
        feedback: {
          overallScore: 85,
          correctness: {
            score: 90,
            feedback: 'Your solution appears to be functionally correct and handles the main test cases well.',
          },
          codeQuality: {
            score: 80,
            feedback: 'Code is generally well-structured. Consider adding more comments and breaking down complex functions.',
          },
          suggestions: [
            'Consider using more descriptive variable names',
            'Add error handling for edge cases',
            'The time complexity could be improved',
          ],
          encouragement: 'Great work! You\'re on the right track. Keep practicing and refining your approach.',
        },
        timestamp: new Date().toISOString(),
      };

      logger.info('Generated feedback for submission:', {
        userId: req.user?.id,
        submissionId: feedback.submissionId,
        overallScore: feedback.feedback.overallScore,
      });

      res.status(200).json(feedback);
    } catch (error) {
      logger.error('Error in submitForFeedback controller:', {
        error: error.message,
        userId: req.user?.id,
        stack: error.stack,
      });
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate feedback',
      });
    }
  },

  // Generate AI feedback for submission (deprecated alias)
  generateFeedback: async (req, res, next) => {
    // Redirect to submitForFeedback
    return aiController.submitForFeedback(req, res, next);
  },

  // Get AI hints for challenge
  getHints: async (req, res, next) => {
    // Implementation needed
    res.status(501).json({ message: 'Not implemented yet' });
  },

  // Generate challenge suggestions
  suggestChallenges: async (req, res, next) => {
    // Implementation needed
    res.status(501).json({ message: 'Not implemented yet' });
  },

  // Analyze learning progress
  analyzeProgress: async (req, res, next) => {
    // Implementation needed
    res.status(501).json({ message: 'Not implemented yet' });
  },
};

module.exports = aiController;
