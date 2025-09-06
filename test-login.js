// Simple test script to verify login functionality
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🧪 Testing login API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@ledgerfy.com',
        password: 'password123'
      })
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login test successful!');
    } else {
      console.log('❌ Login test failed!');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Test mock data endpoint
async function testMockData() {
  try {
    console.log('🧪 Testing mock data endpoint...');
    
    const response = await fetch('http://localhost:3000/api/test-auth');
    const data = await response.json();
    
    console.log('📊 Mock data test result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Mock data test error:', error.message);
  }
}

// Run tests
async function runTests() {
  await testMockData();
  await testLogin();
}

runTests();
