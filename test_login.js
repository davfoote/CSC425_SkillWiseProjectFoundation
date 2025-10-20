// Test the login functionality
const testLogin = async () => {
  const testData = {
    email: "test@example.com",
    password: "password123"
  };

  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (result.token) {
      console.log('✅ JWT Token received:', result.token.substring(0, 20) + '...');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testLogin();