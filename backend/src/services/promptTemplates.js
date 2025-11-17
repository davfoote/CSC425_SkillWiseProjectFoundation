// AI Prompt Templates for consistent challenge generation
// Reusable templates with placeholder substitution

const promptTemplates = {
  // Main challenge generation template
  challengeGeneration: {
    system: `You are an expert programming instructor who creates engaging, educational coding challenges. 
Your challenges should be:
- Clear and well-structured
- Appropriately difficult for the specified level
- Educational and teach important concepts
- Include comprehensive test cases
- Always respond with valid JSON

Follow the exact JSON schema provided in the user prompt.`,

    user: `Generate a {{difficulty}} level coding challenge for {{language}}{{topicClause}}.

Challenge Requirements:
- Title: A clear, engaging title that describes the problem
- Description: Detailed problem description (2-3 paragraphs) explaining the task
- Difficulty: {{difficulty}}
- Category: {{category}}
- Example Input/Output: At least 2 concrete examples showing input and expected output
- Constraints: Technical constraints and limits (e.g., array size, value ranges)
- Hints: 2-3 helpful hints that guide without giving away the solution
- Test Cases: 3-5 test cases with inputs and expected outputs for validation

JSON Schema (respond with ONLY valid JSON matching this structure):
{
  "title": "string",
  "description": "string (2-3 paragraphs)",
  "difficulty": "{{difficulty}}",
  "category": "{{category}}",
  "exampleInput": "string",
  "exampleOutput": "string",
  "constraints": "string (bullet points or paragraph)",
  "hints": ["string", "string", "string"],
  "testCases": [
    {
      "input": "string",
      "expectedOutput": "string"
    }
  ]
}

Additional Context:
{{contextClause}}

Generate the challenge now following the JSON schema exactly.`,

    // Placeholder definitions
    placeholders: {
      difficulty: {
        type: 'string',
        required: true,
        default: 'medium',
        validator: (val) => ['easy', 'medium', 'hard'].includes(val),
        description: 'Challenge difficulty level',
      },
      language: {
        type: 'string',
        required: true,
        default: 'JavaScript',
        description: 'Programming language for the challenge',
      },
      category: {
        type: 'string',
        required: true,
        default: 'general',
        description: 'Challenge category (e.g., algorithms, data structures)',
      },
      topic: {
        type: 'string',
        required: false,
        default: '',
        description: 'Specific topic to focus on (optional)',
      },
      topicClause: {
        type: 'computed',
        compute: (params) => params.topic ? ` focusing on ${params.topic}` : '',
        description: 'Conditional clause for topic',
      },
      contextClause: {
        type: 'computed',
        compute: (params) => {
          const context = [];
          if (params.topic) {
            context.push(`Focus specifically on ${params.topic} concepts.`);
          }
          if (params.difficulty === 'easy') {
            context.push('Keep the problem straightforward and beginner-friendly.');
          } else if (params.difficulty === 'hard') {
            context.push('Include edge cases and require optimization.');
          }
          return context.length > 0 ? context.join(' ') : 'Create a well-balanced challenge.';
        },
        description: 'Additional context based on parameters',
      },
    },
  },

  // Feedback generation template (for future use)
  feedbackGeneration: {
    system: `You are a constructive code reviewer who provides helpful, encouraging feedback.
Focus on:
- Correctness and bugs
- Code quality and readability
- Best practices
- Performance optimization opportunities
- Security considerations`,

    user: `Review this {{language}} code submission for the challenge "{{challengeTitle}}".

Code:
{{codeSubmission}}

Expected Behavior:
{{expectedBehavior}}

Provide feedback in JSON format:
{
  "overallScore": number (0-100),
  "correctness": { "score": number, "feedback": "string" },
  "codeQuality": { "score": number, "feedback": "string" },
  "suggestions": ["string"],
  "encouragement": "string"
}`,

    placeholders: {
      language: { type: 'string', required: true },
      challengeTitle: { type: 'string', required: true },
      codeSubmission: { type: 'string', required: true },
      expectedBehavior: { type: 'string', required: true },
    },
  },

  // Hint generation template (for future use)
  hintGeneration: {
    system: `You are a helpful mentor who provides progressive hints without giving away solutions.
Your hints should:
- Guide thinking without revealing the answer
- Build on each other progressively
- Reference relevant concepts or patterns`,

    user: `Generate 3 progressive hints for this coding challenge:

Challenge: {{challengeTitle}}
Description: {{challengeDescription}}
Difficulty: {{difficulty}}

Respond with JSON:
{
  "hints": [
    { "level": 1, "hint": "string (gentle nudge)" },
    { "level": 2, "hint": "string (more specific)" },
    { "level": 3, "hint": "string (almost giving it away)" }
  ]
}`,

    placeholders: {
      challengeTitle: { type: 'string', required: true },
      challengeDescription: { type: 'string', required: true },
      difficulty: { type: 'string', required: true },
    },
  },
};

/**
 * Renders a prompt template by substituting placeholders with actual values
 * @param {string} templateName - Name of the template to use
 * @param {string} section - 'system' or 'user'
 * @param {Object} params - Parameters to substitute
 * @returns {string} Rendered prompt
 */
const renderPrompt = (templateName, section, params = {}) => {
  const template = promptTemplates[templateName];
  
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  if (!template[section]) {
    throw new Error(`Section '${section}' not found in template '${templateName}'`);
  }

  // Validate required parameters
  const placeholders = template.placeholders || {};
  
  // First, add defaults for missing params
  const allParams = { ...params };
  for (const [key, config] of Object.entries(placeholders)) {
    if (!(key in allParams) && 'default' in config && config.type !== 'computed') {
      allParams[key] = config.default;
    }
  }
  
  // Then validate required params
  for (const [key, config] of Object.entries(placeholders)) {
    if (config.required && !(key in allParams) && config.type !== 'computed') {
      throw new Error(`Required parameter '${key}' missing for template '${templateName}'`);
    }
  }

  // Compute derived placeholders
  for (const [key, config] of Object.entries(placeholders)) {
    if (config.type === 'computed') {
      allParams[key] = config.compute(allParams);
    }
  }

  // Validate values if validator exists
  for (const [key, config] of Object.entries(placeholders)) {
    if (config.validator && key in allParams) {
      if (!config.validator(allParams[key])) {
        throw new Error(`Invalid value for parameter '${key}': ${allParams[key]}`);
      }
    }
  }

  // Replace placeholders
  let rendered = template[section];
  for (const [key, value] of Object.entries(allParams)) {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
  }

  return rendered;
};

/**
 * Gets the complete prompt configuration for a template
 * @param {string} templateName - Name of the template
 * @param {Object} params - Parameters to substitute
 * @returns {Object} { system: string, user: string }
 */
const getPromptConfig = (templateName, params = {}) => {
  return {
    system: renderPrompt(templateName, 'system', params),
    user: renderPrompt(templateName, 'user', params),
  };
};

/**
 * Lists all available templates
 * @returns {Array<string>} Array of template names
 */
const listTemplates = () => {
  return Object.keys(promptTemplates);
};

/**
 * Gets metadata about a template
 * @param {string} templateName - Name of the template
 * @returns {Object} Template metadata
 */
const getTemplateMetadata = (templateName) => {
  const template = promptTemplates[templateName];
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  return {
    name: templateName,
    hasSystem: !!template.system,
    hasUser: !!template.user,
    placeholders: template.placeholders || {},
  };
};

module.exports = {
  promptTemplates,
  renderPrompt,
  getPromptConfig,
  listTemplates,
  getTemplateMetadata,
};
