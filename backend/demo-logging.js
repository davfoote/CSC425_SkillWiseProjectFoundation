// Demo script to show AI logging in action
require('dotenv').config();
const aiService = require('./src/services/aiService');

console.log('\n🎬 DEMO: AI Challenge Generation with Comprehensive Logging\n');
console.log('Watch the terminal for structured logs with emojis!\n');
console.log('=' .repeat(70));

const runDemo = async () => {
  try {
    console.log('\n📋 Generating AI Challenge with preferences:');
    console.log('   - Difficulty: medium');
    console.log('   - Category: algorithms');
    console.log('   - Language: JavaScript');
    console.log('   - Topic: binary search\n');
    console.log('=' .repeat(70));
    
    const result = await aiService.generateChallenge({
      difficulty: 'medium',
      category: 'algorithms',
      language: 'JavaScript',
      topic: 'binary search'
    });
    
    console.log('\n' + '=' .repeat(70));
    console.log('\n✨ RESULT:\n');
    console.log(`Title: ${result.challenge.title}`);
    console.log(`Difficulty: ${result.challenge.difficulty}`);
    console.log(`Points: ${result.challenge.pointValue}`);
    console.log(`\nDescription Preview: ${result.challenge.description.substring(0, 150)}...`);
    console.log('\n' + '=' .repeat(70));
    console.log('\n✅ Demo complete! Check the logs above for all the emoji-prefixed logging.\n');
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    if (error.message.includes('apiKey')) {
      console.log('\n⚠️  Make sure OPENAI_API_KEY is set in .env file');
    }
  }
  
  process.exit(0);
};

runDemo();
