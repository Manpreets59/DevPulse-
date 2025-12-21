import 'dotenv/config';

console.log('🔍 Testing environment variables...\n');
console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Set' : '❌ Missing');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');
console.log('DISCORD_WEBHOOK_URL:', process.env.DISCORD_WEBHOOK_URL ? '✅ Set' : '⚠️  Optional (empty)');