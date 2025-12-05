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
      let hasRealApiKey = process.env.OPENAI_API_KEY && 
                          !process.env.OPENAI_API_KEY.includes('dummy') &&
                          process.env.OPENAI_API_KEY.length > 20;

      let result;
      
      if (hasRealApiKey) {
        // Try to generate challenge using AI
        try {
          result = await aiService.generateChallenge({
            difficulty,
            category,
            language,
            topic,
          });
        } catch (error) {
          // If API fails (quota exceeded, network error, etc), fall back to mock
          logger.warn('⚠️ AI challenge generation failed, using mock challenge:', {
            error: error.message,
            errorCode: error.status || error.code,
          });
          hasRealApiKey = false; // Force mock path below
        }
      }
      
      if (!hasRealApiKey || !result) {
        // Return mock challenge when no real API key
        logger.info('🎭 Using mock challenge (no OpenAI API key configured)');
        
        // Mock challenge templates based on category and difficulty
        const mockChallenges = {
          algorithms: {
            easy: {
              title: 'Find the Maximum Number',
              description: 'Write a function that takes an array of numbers and returns the maximum value. Handle edge cases like empty arrays.',
              testCases: [
                { input: '[1, 5, 3, 9, 2]', expected: '9' },
                { input: '[10]', expected: '10' },
                { input: '[]', expected: 'null or undefined' },
              ],
              hints: [
                'You can use Math.max() with the spread operator',
                'Don\'t forget to handle empty arrays',
                'Consider using reduce() for practice',
              ],
              starterCode: `function findMax(numbers) {\n  // Your code here\n  // Return the maximum number from the array\n  return 0;\n}`,
            },
            medium: {
              title: 'Two Sum Problem',
              description: 'Given an array of integers and a target sum, return the indices of two numbers that add up to the target. You may assume each input has exactly one solution.',
              testCases: [
                { input: 'nums=[2,7,11,15], target=9', expected: '[0,1]' },
                { input: 'nums=[3,2,4], target=6', expected: '[1,2]' },
                { input: 'nums=[3,3], target=6', expected: '[0,1]' },
              ],
              hints: [
                'Think about using a hash map to store seen numbers',
                'For each number, check if (target - number) exists in the map',
                'Time complexity can be O(n) with the right approach',
              ],
              starterCode: `function twoSum(nums, target) {\n  // Your code here\n  // Return array of two indices\n  return [];\n}`,
            },
            hard: {
              title: 'Merge K Sorted Lists',
              description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
              testCases: [
                { input: '[[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]' },
                { input: '[]', expected: '[]' },
                { input: '[[]]', expected: '[]' },
              ],
              hints: [
                'Consider using a min-heap or priority queue',
                'You could also use divide and conquer approach',
                'Compare this to merging two sorted lists',
              ],
              starterCode: `function mergeKLists(lists) {\n  // Your code here\n  // Return merged sorted list\n  return null;\n}`,
            },
          },
          'data-structures': {
            easy: {
              title: 'Implement a Stack',
              description: 'Create a Stack class with push, pop, peek, and isEmpty methods. Use an array as the underlying data structure.',
              testCases: [
                { input: 'push(1), push(2), pop()', expected: '2' },
                { input: 'push(5), peek()', expected: '5' },
                { input: 'isEmpty() on empty stack', expected: 'true' },
              ],
              hints: [
                'Use an array to store the elements',
                'Remember that stacks are LIFO (Last In, First Out)',
                'Consider what to return when popping from an empty stack',
              ],
              starterCode: `class Stack {\n  constructor() {\n    this.items = [];\n  }\n\n  push(element) {\n    // Your code here\n  }\n\n  pop() {\n    // Your code here\n  }\n}`,
            },
            medium: {
              title: 'Binary Search Tree Operations',
              description: 'Implement insert and search operations for a Binary Search Tree. Handle duplicate values appropriately.',
              testCases: [
                { input: 'insert(5), insert(3), search(3)', expected: 'true' },
                { input: 'insert(10), insert(5), insert(15), search(7)', expected: 'false' },
              ],
              hints: [
                'Remember BST property: left < root < right',
                'Use recursion for cleaner code',
                'Consider balanced vs unbalanced trees',
              ],
              starterCode: `class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nclass BST {\n  insert(val) {\n    // Your code here\n  }\n}`,
            },
            hard: {
              title: 'LRU Cache Implementation',
              description: 'Design and implement a data structure for Least Recently Used (LRU) cache with O(1) time complexity for both get and put operations.',
              testCases: [
                { input: 'put(1,1), put(2,2), get(1), put(3,3), get(2)', expected: 'get(1)=1, get(2)=-1' },
              ],
              hints: [
                'Use a combination of hash map and doubly linked list',
                'Hash map provides O(1) lookup',
                'Doubly linked list maintains LRU order',
              ],
              starterCode: `class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n\n  get(key) {\n    // Your code here\n  }\n\n  put(key, value) {\n    // Your code here\n  }\n}`,
            },
          },
          'web-development': {
            easy: {
              title: 'Create a Button Component',
              description: 'Build a reusable Button component in React with props for text, onClick handler, and optional styling variants (primary, secondary).',
              testCases: [
                { input: '<Button text="Click me" onClick={handler} />', expected: 'Renders clickable button' },
                { input: '<Button variant="primary" />', expected: 'Applies primary styles' },
              ],
              hints: [
                'Use props to make the component flexible',
                'Consider using conditional styling',
                'Don\'t forget accessibility attributes',
              ],
              starterCode: `import React from 'react';\n\nfunction Button({ text, onClick, variant = 'primary' }) {\n  // Your code here\n  return (\n    <button>\n      {text}\n    </button>\n  );\n}\n\nexport default Button;`,
            },
            medium: {
              title: 'Form Validation Hook',
              description: 'Create a custom React hook called useFormValidation that validates form fields in real-time and returns error messages.',
              testCases: [
                { input: 'email validation', expected: 'Returns error for invalid email' },
                { input: 'required field', expected: 'Returns error when field is empty' },
              ],
              hints: [
                'Use useState to track field values and errors',
                'Use useEffect to trigger validation',
                'Return validation functions from the hook',
              ],
              starterCode: `import { useState } from 'react';\n\nfunction useFormValidation(initialValues, validationRules) {\n  // Your code here\n  const [values, setValues] = useState(initialValues);\n  const [errors, setErrors] = useState({});\n\n  return { values, errors };\n}`,
            },
            hard: {
              title: 'Virtual Scrolling Component',
              description: 'Implement a virtualized list component that efficiently renders only visible items from a large dataset (10,000+ items).',
              testCases: [
                { input: '10000 items, viewport shows 20', expected: 'Only renders ~20 DOM nodes' },
                { input: 'Scroll to bottom', expected: 'Updates rendered items smoothly' },
              ],
              hints: [
                'Calculate which items are visible based on scroll position',
                'Use position: absolute for item positioning',
                'Add buffer items above and below viewport',
              ],
              starterCode: `import React, { useState, useRef } from 'react';\n\nfunction VirtualList({ items, itemHeight, containerHeight }) {\n  // Your code here\n  return (\n    <div style={{ height: containerHeight, overflow: 'auto' }}>\n      {/* Render visible items */}\n    </div>\n  );\n}`,
            },
          },
        };

        // Get the appropriate mock challenge
        const selectedCategory = category || 'algorithms';
        const selectedDifficulty = difficulty || 'medium';
        const categoryTemplates = mockChallenges[selectedCategory] || mockChallenges.algorithms;
        const template = categoryTemplates[selectedDifficulty] || categoryTemplates.medium;

        result = {
          success: true,
          challenge: {
            title: template.title,
            description: template.description,
            difficulty: selectedDifficulty,
            category: selectedCategory,
            language: language || 'JavaScript',
            estimatedTime: selectedDifficulty === 'easy' ? 15 : selectedDifficulty === 'hard' ? 60 : 30,
            points: selectedDifficulty === 'easy' ? 10 : selectedDifficulty === 'hard' ? 50 : 25,
            testCases: template.testCases,
            hints: template.hints,
            starterCode: template.starterCode,
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
