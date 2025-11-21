// AI integration with OpenAI API
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { templates, render } = require('./aiPromptTemplates');

/**
 * AI Service
 * - generateChallenge: builds a prompt, calls OpenAI, and returns structured challenge data
 */
const aiService = {
  generateChallenge: async (options = {}) => {
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '800', 10);

    // Build instruction asking the model to return JSON with specific fields
    const difficulty = options.difficulty || 'medium';
    const category = options.category || 'general programming';

    const systemPrompt = templates.generateChallengeSystem;
    const userPrompt = render(templates.generateChallengeUser, { difficulty, category });

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const resp = await client.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    // Extract text from response
    const rawText = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content
      ? resp.choices[0].message.content.trim()
      : '';

    // Try to parse JSON safely
    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      // If parsing fails, attempt to extract JSON block
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (e) { /* ignore */ }
      }
    }

    // If parsing failed, return raw text in description
    if (!parsed) {
      parsed = {
        title: `AI Generated Challenge (${difficulty})`,
        description: rawText || 'No content returned by AI.',
        difficulty_level: difficulty,
        category,
        examples: [],
        tags: [],
        learning_objectives: [],
      };
    }

    return {
      raw: rawText,
      challenge: parsed,
      modelResponse: resp,
    };
  },

  // Generate feedback for a submission using AI
  generateFeedback: async ({ text, language } = {}) => {
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '800', 10);

    const systemPrompt = `You are an experienced educator providing concise, constructive feedback on user submissions. Respond ONLY with valid JSON. Do NOT include any explanatory text. Return a JSON object with fields: summary (short), strengths (array), weaknesses (array), suggestions (array), score (0-100 numeric).`;

    const userPrompt = `Please review the following submission${language ? ` (language: ${language})` : ''} and provide feedback in the requested JSON format.\n\nSubmission:\n${text}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const resp = await client.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.2,
    });

    const rawText = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content
      ? resp.choices[0].message.content.trim()
      : '';

    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (e) { /* ignore */ }
      }
    }

    if (!parsed) {
      parsed = {
        summary: rawText || 'No feedback generated',
        strengths: [],
        weaknesses: [],
        suggestions: [],
        score: null,
      };
    }

    return {
      raw: rawText,
      feedback: parsed,
      modelResponse: resp,
    };
  },
};

module.exports = aiService;
