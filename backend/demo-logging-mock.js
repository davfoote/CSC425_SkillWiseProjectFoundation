// Mock demo to show complete logging flow without OpenAI API
require('dotenv').config();
const pino = require('pino');

const logger = pino({
  name: 'skillwise-ai',
  level: process.env.LOG_LEVEL || 'info',
});

console.log('\n🎬 MOCK DEMO: AI Challenge Generation with Full Logging Flow\n');
console.log('This simulates a real OpenAI call to show all the logs!\n');
console.log('=' .repeat(70));

const mockAIGeneration = async () => {
  const startTime = Date.now();
  
  try {
    const preferences = {
      difficulty: 'medium',
      category: 'algorithms',
      language: 'JavaScript',
      topic: 'binary search'
    };
    
    console.log('\n📋 Simulating AI Challenge Generation with preferences:');
    console.log(`   - Difficulty: ${preferences.difficulty}`);
    console.log(`   - Category: ${preferences.category}`);
    console.log(`   - Language: ${preferences.language}`);
    console.log(`   - Topic: ${preferences.topic}\n`);
    console.log('=' .repeat(70) + '\n');
    
    // 🤖 Log 1: Request received
    logger.info('🤖 AI Challenge Generation Request:', {
      difficulty: preferences.difficulty,
      category: preferences.category,
      language: preferences.language,
      topic: preferences.topic,
      timestamp: new Date().toISOString(),
    });
    
    const prompt = `Generate a ${preferences.difficulty} level coding challenge for ${preferences.language} focusing on ${preferences.topic}.`;
    
    // 📤 Log 2: Sending prompt to OpenAI
    logger.info('📤 Sending prompt to OpenAI:', {
      model: 'gpt-3.5-turbo',
      promptLength: prompt.length,
      temperature: 0.8,
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock OpenAI response
    const mockResponse = {
      title: "Binary Search in Rotated Array",
      description: "Given a sorted array that has been rotated at an unknown pivot point, implement a function to search for a target value using binary search. The array was originally sorted in ascending order but has been rotated. For example, [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]. Your task is to find the index of the target value, or return -1 if it doesn't exist.",
      exampleInput: "[4,5,6,7,0,1,2], target = 0",
      exampleOutput: "4",
      constraints: "1 <= array.length <= 5000, -10^4 <= array[i] <= 10^4, All values are unique",
      hints: [
        "The array is rotated but still maintains sorted order in segments",
        "Use binary search but determine which half is properly sorted",
        "Compare mid element with left and right boundaries"
      ],
      testCases: [
        { input: "[4,5,6,7,0,1,2], 0", expectedOutput: "4" },
        { input: "[4,5,6,7,0,1,2], 3", expectedOutput: "-1" },
        { input: "[1], 0", expectedOutput: "-1" }
      ]
    };
    
    const responseText = JSON.stringify(mockResponse);
    const tokensUsed = Math.floor(responseText.length / 4); // Rough estimate
    
    // 📥 Log 3: Response received
    logger.info('📥 Received response from OpenAI:', {
      responseLength: responseText.length,
      tokensUsed: tokensUsed,
      model: 'gpt-3.5-turbo',
      finishReason: 'stop',
    });
    
    const challengeData = JSON.parse(responseText);
    
    // ✅ Log 4: Success
    logger.info('✅ Challenge generated successfully:', {
      title: challengeData.title,
      difficulty: preferences.difficulty,
      category: preferences.category,
      executionTime: `${Date.now() - startTime}ms`,
    });
    
    console.log('\n' + '=' .repeat(70));
    console.log('\n✨ GENERATED CHALLENGE:\n');
    console.log(`📌 Title: ${challengeData.title}`);
    console.log(`🎯 Difficulty: ${preferences.difficulty}`);
    console.log(`📊 Category: ${preferences.category}`);
    console.log(`💎 Points: ${preferences.difficulty === 'easy' ? 10 : preferences.difficulty === 'medium' ? 25 : 50}`);
    console.log(`\n📝 Description:\n${challengeData.description}\n`);
    console.log(`💡 Hints: ${challengeData.hints.length} hints provided`);
    console.log(`✓ Test Cases: ${challengeData.testCases.length} test cases`);
    console.log(`⏱️  Total Time: ${Date.now() - startTime}ms`);
    console.log(`🎟️  Tokens Used: ${tokensUsed} (~$${(tokensUsed * 0.000002).toFixed(6)})`);
    console.log('\n' + '=' .repeat(70));
    console.log('\n🎉 Mock demo complete! All 4 logging stages demonstrated:\n');
    console.log('   🤖 Request received with parameters');
    console.log('   📤 Prompt sent to OpenAI API');
    console.log('   📥 Response received with metadata');
    console.log('   ✅ Challenge generated successfully\n');
    
  } catch (error) {
    // ❌ Error logging
    logger.error('❌ Error generating challenge:', {
      error: error.message,
      stack: error.stack,
      executionTime: `${Date.now() - startTime}ms`,
    });
    console.error('\n❌ Error:', error.message);
  }
  
  process.exit(0);
};

mockAIGeneration();
