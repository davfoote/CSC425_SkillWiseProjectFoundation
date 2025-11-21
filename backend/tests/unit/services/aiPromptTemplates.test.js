const { templates, render } = require('../../../src/services/aiPromptTemplates');

describe('aiPromptTemplates', () => {
  test('renders template with provided values', () => {
    const t = 'Make a {{difficulty}} challenge in {{category}}.';
    const out = render(t, { difficulty: 'easy', category: 'algorithms' });
    expect(out).toBe('Make a easy challenge in algorithms.');
  });

  test('leaves placeholders intact when value missing', () => {
    const t = 'Hello {{name}} - {{missing}}';
    const out = render(t, { name: 'Sam' });
    expect(out).toBe('Hello Sam - {{missing}}');
  });
});
