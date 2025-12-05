// Test harness for AI prompt templates
// Verifies template rendering and response validation

const {
  renderPrompt,
  getPromptConfig,
  listTemplates,
  getTemplateMetadata,
} = require('../src/services/promptTemplates');

const pino = require('pino');

const logger = pino({
  name: 'prompt-template-test',
  level: 'info',
});

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let testsPassed = 0;
let testsFailed = 0;

const assert = (condition, testName) => {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    testsPassed++;
    return true;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    testsFailed++;
    return false;
  }
};

const runTests = () => {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  AI Prompt Template Test Harness${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  // Test 1: List all templates
  console.log(`${colors.blue}Test Suite 1: Template Discovery${colors.reset}`);
  const templates = listTemplates();
  assert(templates.length > 0, 'Should have at least one template');
  assert(templates.includes('challengeGeneration'), 'Should include challengeGeneration template');
  console.log(`  Found ${templates.length} templates: ${templates.join(', ')}\n`);

  // Test 2: Template metadata
  console.log(`${colors.blue}Test Suite 2: Template Metadata${colors.reset}`);
  const metadata = getTemplateMetadata('challengeGeneration');
  assert(metadata.hasSystem, 'challengeGeneration should have system prompt');
  assert(metadata.hasUser, 'challengeGeneration should have user prompt');
  assert(Object.keys(metadata.placeholders).length > 0, 'Should have placeholders defined');
  console.log(`  Placeholders: ${Object.keys(metadata.placeholders).join(', ')}\n`);

  // Test 3: Basic template rendering
  console.log(`${colors.blue}Test Suite 3: Basic Template Rendering${colors.reset}`);
  try {
    const systemPrompt = renderPrompt('challengeGeneration', 'system', {
      difficulty: 'medium',
      category: 'algorithms',
      language: 'JavaScript',
    });
    assert(systemPrompt.length > 0, 'System prompt should render');
    assert(systemPrompt.includes('programming instructor'), 'System prompt should contain expected content');

    const userPrompt = renderPrompt('challengeGeneration', 'user', {
      difficulty: 'medium',
      category: 'algorithms',
      language: 'JavaScript',
      topic: 'binary search',
    });
    assert(userPrompt.length > 0, 'User prompt should render');
    assert(userPrompt.includes('medium'), 'User prompt should include difficulty');
    assert(userPrompt.includes('JavaScript'), 'User prompt should include language');
    assert(userPrompt.includes('binary search'), 'User prompt should include topic');
    assert(!userPrompt.includes('{{'), 'User prompt should not have unreplaced placeholders');
    console.log(`  System prompt length: ${systemPrompt.length} chars`);
    console.log(`  User prompt length: ${userPrompt.length} chars\n`);
  } catch (error) {
    assert(false, `Template rendering should not throw: ${error.message}`);
  }

  // Test 4: Placeholder substitution
  console.log(`${colors.blue}Test Suite 4: Placeholder Substitution${colors.reset}`);
  const params = {
    difficulty: 'hard',
    category: 'data structures',
    language: 'Python',
    topic: 'binary trees',
  };
  const config = getPromptConfig('challengeGeneration', params);
  assert(config.system.length > 0, 'Should have system prompt');
  assert(config.user.length > 0, 'Should have user prompt');
  assert(config.user.includes('hard'), 'Should substitute difficulty');
  assert(config.user.includes('Python'), 'Should substitute language');
  assert(config.user.includes('data structures'), 'Should substitute category');
  assert(config.user.includes('binary trees'), 'Should substitute topic');
  console.log();

  // Test 5: Computed placeholders
  console.log(`${colors.blue}Test Suite 5: Computed Placeholders${colors.reset}`);
  const withTopic = getPromptConfig('challengeGeneration', {
    difficulty: 'medium',
    category: 'algorithms',
    language: 'JavaScript',
    topic: 'recursion',
  });
  assert(withTopic.user.includes('focusing on recursion'), 'Should compute topic clause when topic provided');

  const withoutTopic = getPromptConfig('challengeGeneration', {
    difficulty: 'medium',
    category: 'algorithms',
    language: 'JavaScript',
  });
  assert(!withoutTopic.user.includes('focusing on'), 'Should not include topic clause when topic omitted');
  console.log();

  // Test 6: Validation
  console.log(`${colors.blue}Test Suite 6: Parameter Validation${colors.reset}`);
  try {
    renderPrompt('challengeGeneration', 'user', {
      difficulty: 'invalid',
      category: 'algorithms',
      language: 'JavaScript',
    });
    assert(false, 'Should reject invalid difficulty');
  } catch (error) {
    assert(error.message.includes('Invalid value'), 'Should throw validation error for invalid difficulty');
  }

  try {
    renderPrompt('feedbackGeneration', 'user', {
      // feedbackGeneration has no defaults, should fail
    });
    assert(false, 'Should reject missing required params');
  } catch (error) {
    assert(error.message.includes('Required parameter'), 'Should throw error for missing required params');
  }
  console.log();

  // Test 7: Default values
  console.log(`${colors.blue}Test Suite 7: Default Values${colors.reset}`);
  const withDefaults = getPromptConfig('challengeGeneration', {
    // Only providing required params, others should use defaults
    category: 'algorithms',
    language: 'JavaScript',
  });
  assert(withDefaults.user.includes('medium'), 'Should use default difficulty');
  console.log();

  // Test 8: Response structure verification
  console.log(`${colors.blue}Test Suite 8: Response Structure Verification${colors.reset}`);
  const responseStructure = getPromptConfig('challengeGeneration', {
    difficulty: 'medium',
    category: 'algorithms',
    language: 'JavaScript',
  });
  assert(responseStructure.user.includes('JSON Schema'), 'Should specify JSON schema');
  assert(responseStructure.user.includes('"title"'), 'Should define title field');
  assert(responseStructure.user.includes('"description"'), 'Should define description field');
  assert(responseStructure.user.includes('"hints"'), 'Should define hints field');
  assert(responseStructure.user.includes('"testCases"'), 'Should define testCases field');
  console.log();

  // Test 9: Multiple templates
  console.log(`${colors.blue}Test Suite 9: Multiple Template Support${colors.reset}`);
  const allTemplates = listTemplates();
  assert(allTemplates.includes('challengeGeneration'), 'Should have challengeGeneration');
  assert(allTemplates.includes('feedbackGeneration'), 'Should have feedbackGeneration');
  assert(allTemplates.includes('hintGeneration'), 'Should have hintGeneration');
  console.log(`  Total templates available: ${allTemplates.length}\n`);

  // Test 10: Error handling
  console.log(`${colors.blue}Test Suite 10: Error Handling${colors.reset}`);
  try {
    renderPrompt('nonexistent', 'user', {});
    assert(false, 'Should reject nonexistent template');
  } catch (error) {
    assert(error.message.includes('not found'), 'Should throw error for nonexistent template');
  }

  try {
    renderPrompt('challengeGeneration', 'nonexistent', {});
    assert(false, 'Should reject nonexistent section');
  } catch (error) {
    assert(error.message.includes('Section'), 'Should throw error for nonexistent section');
  }
  console.log();

  // Summary
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  Test Results${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
  console.log(`  ${colors.green}✓ Passed:${colors.reset} ${testsPassed}`);
  console.log(`  ${colors.red}✗ Failed:${colors.reset} ${testsFailed}`);
  console.log(`  ${colors.yellow}Total:${colors.reset} ${testsPassed + testsFailed}\n`);

  if (testsFailed === 0) {
    console.log(`${colors.green}🎉 All tests passed!${colors.reset}\n`);
    logger.info('✅ Test harness completed successfully', {
      passed: testsPassed,
      failed: testsFailed,
    });
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some tests failed${colors.reset}\n`);
    logger.error('❌ Test harness completed with failures', {
      passed: testsPassed,
      failed: testsFailed,
    });
    process.exit(1);
  }
};

// Run the test harness
runTests();
