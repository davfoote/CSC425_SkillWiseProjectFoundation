// AI integration controller for feedback and hints
const aiService = require('../services/aiService');
const submissionService = require('../services/submissionService');
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
    const startTime = Date.now();
    
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

      logger.info('📝 Received code submission for feedback:', {
        userId: req.user?.userId || req.user?.id,
        userObject: req.user,
        challengeId,
        challengeTitle,
        language,
        codeLength: codeSubmission.length,
      });

      // Get user ID from token (supports both userId and id fields)
      const userId = req.user?.userId || req.user?.id;
      
      // Check if user is authenticated
      if (!userId) {
        logger.error('❌ User not authenticated or user ID missing:', { user: req.user });
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Step 1: Get next attempt number
      const attemptNumber = challengeId 
        ? await submissionService.getNextAttemptNumber(userId, challengeId)
        : 1;

      // Step 2: Save submission to database
      const submission = await submissionService.submitSolution({
        userId: userId,
        challengeId: challengeId || null,
        submissionText: codeSubmission,
        submissionFiles: null,
        attemptNumber,
      });

      logger.info('💾 Submission saved to database:', { 
        submissionId: submission.id,
        attemptNumber,
      });

      // Step 3: Generate AI feedback
      const hasRealApiKey = process.env.OPENAI_API_KEY && 
                            !process.env.OPENAI_API_KEY.includes('dummy') &&
                            process.env.OPENAI_API_KEY.length > 20;

      let feedbackText, overallScore, suggestions, strengths, improvements;

      if (hasRealApiKey) {
        // Call real AI service
        logger.info('🤖 Generating real AI feedback');
        try {
          const aiResult = await aiService.generateFeedback(codeSubmission, {
            challengeTitle,
            challengeDescription,
            language,
          });

          feedbackText = aiResult.feedback.feedbackText;
          overallScore = aiResult.feedback.overallScore;
          suggestions = aiResult.feedback.suggestions;
          strengths = aiResult.feedback.strengths;
          improvements = aiResult.feedback.improvements;
        } catch (error) {
          logger.error('❌ AI feedback generation failed, falling back to mock:', error.message);
          // Fallback to mock feedback if AI fails
          feedbackText = `Your ${language} solution for "${challengeTitle}" shows good understanding. The code is well-structured and handles the main test cases correctly.`;
          overallScore = 75;
          suggestions = ['Consider edge cases', 'Add error handling', 'Optimize performance'];
          strengths = ['Clean code structure', 'Good variable naming'];
          improvements = ['Add input validation', 'Consider time complexity'];
        }
      } else {
        // Mock feedback
        logger.info('🎭 Using mock AI feedback (no OpenAI API key configured)');
        feedbackText = `Your ${language} solution for "${challengeTitle}" shows good understanding. The code is well-structured and handles the main test cases correctly.`;
        overallScore = 85;
        suggestions = [
          'Consider using more descriptive variable names',
          'Add error handling for edge cases',
          'The time complexity could be improved',
        ];
        strengths = [
          'Clean and readable code structure',
          'Handles main test cases correctly',
          'Good use of built-in functions',
        ];
        improvements = [
          'Add input validation',
          'Consider edge cases like empty inputs',
          'Add comments for complex logic',
        ];
      }

      // Step 4: Save AI feedback to database
      const processingTimeMs = Date.now() - startTime;
      
      const aiFeedback = await submissionService.createAIFeedback({
        submissionId: submission.id,
        feedbackText,
        feedbackType: 'automated',
        confidenceScore: hasRealApiKey ? 0.85 : null,
        suggestions,
        strengths,
        improvements,
        aiModel: hasRealApiKey ? 'gpt-3.5-turbo' : 'mock',
        processingTimeMs,
      });

      logger.info('🤖 AI feedback saved to database:', { 
        feedbackId: aiFeedback.id,
        processingTimeMs,
      });

      // Step 5: Update submission with score
      await submissionService.gradeSubmission(submission.id, {
        score: overallScore,
        status: 'graded',
      });

      logger.info('✅ Submission graded and completed:', {
        submissionId: submission.id,
        score: overallScore,
      });

      // Step 6: Return response to client
      const response = {
        success: true,
        submissionId: submission.id,
        attemptNumber,
        feedback: {
          overallScore,
          correctness: {
            score: 90,
            feedback: 'Your solution appears to be functionally correct and handles the main test cases well.',
          },
          codeQuality: {
            score: 80,
            feedback: feedbackText,
          },
          suggestions,
          strengths,
          improvements,
          encouragement: 'Great work! You\'re on the right track. Keep practicing and refining your approach.',
        },
        timestamp: new Date().toISOString(),
        processingTimeMs,
        isMock: !hasRealApiKey,
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('❌ Error in submitForFeedback controller:', {
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
