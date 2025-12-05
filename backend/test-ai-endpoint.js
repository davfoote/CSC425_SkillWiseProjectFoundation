// Quick test script for AI challenge generation endpoint
const axios = require('axios');

const testAIGeneration = async () => {
  console.log('🧪 Testing AI Challenge Generation Endpoint\n');

  // You'll need a valid auth token - get one by logging in first
  const token = process.argv[2] || 'YOUR_TOKEN_HERE';

  try {
    console.log('📤 Sending request to generate challenge...\n');
    
    const response = await axios.post(
      'http://localhost:3001/api/ai/generateChallenge',
      {
        difficulty: 'medium',
        category: 'algorithms',
        language: 'JavaScript',
        topic: 'arrays'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Success! Challenge Generated:\n');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n⚠️  You need to provide a valid auth token!');
      console.log('Usage: node test-ai-endpoint.js YOUR_TOKEN_HERE');
      console.log('\nTo get a token:');
      console.log('1. Start the backend server: npm run dev');
      console.log('2. Log in via the API or frontend');
      console.log('3. Copy the token from localStorage or the API response');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n⚠️  Backend server is not running!');
      console.log('Start it with: cd backend && npm run dev');
    }
  }
};

testAIGeneration();
