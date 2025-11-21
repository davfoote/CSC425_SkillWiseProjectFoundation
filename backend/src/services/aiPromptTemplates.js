/**
 * Reusable AI Prompt Templates
 * Provides templates and a simple renderer for injecting options/placeholders.
 * Templates should be kept deterministic to improve repeatability of generated challenges.
 */

const templates = {
  generateChallengeSystem: `You are an assistant that generates coding practice challenges for learners. Respond ONLY with valid JSON. Do NOT include any explanatory text.\nReturn a JSON object with the following fields: title, description, difficulty_level (easy|medium|hard), category, examples (array of strings), tags (array), learning_objectives (array). Ensure the JSON is parseable.`,

  generateChallengeUser: `Generate a {{difficulty}} difficulty challenge in the category "{{category}}". Keep the description concise but clear and include at least one example in the examples array. Use objective, learner-focused language.`,
};

/**
 * Simple template renderer that replaces {{key}} placeholders with provided values.
 * It performs safe string replacement; values are coerced to strings.
 */
function render(template, values = {}) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return String(values[key]);
    }
    return match; // leave placeholder if not provided
  });
}

module.exports = {
  templates,
  render,
};
