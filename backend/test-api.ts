import 'dotenv/config';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  // Test analyze PR endpoint
  console.log('1️⃣ Testing POST /api/analyze-pr');
  try {
    const response = await fetch('http://localhost:3000/api/analyze-pr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner: 'microsoft',
        repo: 'vscode',
        prNumber: 283599
      })
    });

    const result = await response.json();
    console.log('✅ Analysis API:', result.success ? 'SUCCESS' : 'FAILED');
  } catch (error: any) {
    console.log('❌ Analysis API failed:', error.message);
  }

  // Test dashboard endpoint
  console.log('\n2️⃣ Testing GET /api/dashboard');
  try {
    const response = await fetch('http://localhost:3000/api/dashboard');
    const result = await response.json();
    console.log('✅ Dashboard API:', result.success ? 'SUCCESS' : 'FAILED');
    console.log('   Metrics:', result.metrics);
  } catch (error: any) {
    console.log('❌ Dashboard API failed:', error.message);
  }
}

testAPI();