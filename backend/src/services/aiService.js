// AI integration with OpenAI API
const OpenAI = require('openai');
const pino = require('pino');
const { getPromptConfig } = require('./promptTemplates');

const logger = pino({
  name: 'skillwise-ai',
  level: process.env.LOG_LEVEL || 'info',
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiService = {
  // Generate a coding challenge using AI
  generateChallenge: async (preferences = {}) => {
    const startTime = Date.now();
    
    try {
      const { 
        difficulty = 'medium', 
        category = 'general', 
        language = 'JavaScript',
        topic = ''
      } = preferences;

      logger.info('🤖 AI Challenge Generation Request:', {
        difficulty,
        category,
        language,
        topic,
        timestamp: new Date().toISOString(),
      });

      // Use reusable prompt template
      const promptConfig = getPromptConfig('challengeGeneration', {
        difficulty,
        category,
        language,
        topic,
      });

      logger.info('📤 Sending prompt to OpenAI:', {
        model: 'gpt-3.5-turbo',
        promptLength: promptConfig.user.length,
        temperature: 0.8,
        usingTemplate: 'challengeGeneration',
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: promptConfig.system,
          },
          {
            role: 'user',
            content: promptConfig.user,
          },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      });

      const responseText = completion.choices[0].message.content;
      
      logger.info('📥 Received response from OpenAI:', {
        responseLength: responseText.length,
        tokensUsed: completion.usage?.total_tokens || 0,
        model: completion.model,
        finishReason: completion.choices[0].finish_reason,
      });
      
      // Parse JSON response
      const challengeData = JSON.parse(responseText);
      
      logger.info('✅ Challenge generated successfully:', {
        title: challengeData.title,
        difficulty: difficulty,
        category: category,
        executionTime: `${Date.now() - startTime}ms`,
      });

      return {
        success: true,
        challenge: {
          title: challengeData.title,
          description: challengeData.description,
          difficulty: difficulty,
          category: category,
          exampleInput: challengeData.exampleInput,
          exampleOutput: challengeData.exampleOutput,
          constraints: challengeData.constraints,
          hints: challengeData.hints || [],
          testCases: challengeData.testCases || [],
          isActive: true,
          pointValue: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50,
        },
      };
    } catch (error) {
      logger.error('❌ Error generating challenge:', {
        error: error.message,
        stack: error.stack,
        executionTime: `${Date.now() - startTime}ms`,
      });
      throw new Error('Failed to generate challenge from AI: ' + error.message);
    }
  },

  // Generate feedback using AI
  generateFeedback: async (submissionText, challengeContext) => {
    const startTime = Date.now();
    
    try {
      const { 
        challengeTitle = 'Coding Challenge',
        challengeDescription = '',
        language = 'JavaScript'
      } = challengeContext;

      logger.info('🤖 AI Feedback Generation Request:', {
        challengeTitle,
        language,
        codeLength: submissionText.length,
        timestamp: new Date().toISOString(),
      });

      const promptConfig = getPromptConfig('codeFeedback', {
        challengeTitle,
        challengeDescription,
        language,
        submissionText,
      });

      logger.info('📤 Sending code for feedback to OpenAI:', {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        promptLength: promptConfig.user.length,
      });

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: promptConfig.system,
          },
          {
            role: 'user',
            content: promptConfig.user,
          },
        ],
        temperature: 0.7,
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      });

      const responseText = completion.choices[0].message.content;
      
      logger.info('📥 Received feedback from OpenAI:', {
        responseLength: responseText.length,
        tokensUsed: completion.usage?.total_tokens || 0,
      });
      
      // Parse JSON response
      const feedbackData = JSON.parse(responseText);
      
      logger.info('✅ Feedback generated successfully:', {
        score: feedbackData.overallScore,
        executionTime: `${Date.now() - startTime}ms`,
      });

      return {
        success: true,
        feedback: {
          feedbackText: feedbackData.summary || feedbackData.feedbackText,
          overallScore: feedbackData.overallScore || 75,
          suggestions: feedbackData.suggestions || [],
          strengths: feedbackData.strengths || [],
          improvements: feedbackData.improvements || [],
        },
      };
    } catch (error) {
      logger.error('❌ Error generating feedback:', {
        error: error.message,
        stack: error.stack,
      });
      throw new Error('Failed to generate feedback from AI: ' + error.message);
    }
  },

  // Generate hints for challenges
  generateHints: async (challengeId, userProgress) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // Analyze learning patterns
  analyzePattern: async (userId, learningData) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // Suggest next challenges
  suggestNextChallenges: async (userId) => {
    // Implementation needed
    throw new Error('Not implemented');
  },
};

module.exports = aiService;
