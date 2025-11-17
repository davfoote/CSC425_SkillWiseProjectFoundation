// AI integration with OpenAI API
const OpenAI = require('openai');
const pino = require('pino');

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

      const prompt = `Generate a ${difficulty} level coding challenge for ${language}${topic ? ` focusing on ${topic}` : ''}.
      
Requirements:
- Title: A clear, engaging title
- Description: Detailed problem description (2-3 paragraphs)
- Difficulty: ${difficulty}
- Category: ${category}
- Example Input/Output: At least 2 examples
- Constraints: Technical constraints and limits
- Hints: 2-3 helpful hints
- Test Cases: 3-5 test cases with inputs and expected outputs

Format the response as JSON with these exact fields: title, description, difficulty, category, exampleInput, exampleOutput, constraints, hints (array), testCases (array with input and expectedOutput).`;

      logger.info('📤 Sending prompt to OpenAI:', {
        model: 'gpt-3.5-turbo',
        promptLength: prompt.length,
        temperature: 0.8,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert programming instructor who creates engaging, educational coding challenges. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
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
    // Implementation needed
    throw new Error('Not implemented');
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
