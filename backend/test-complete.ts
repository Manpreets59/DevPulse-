import 'dotenv/config';
import { analyzePRWorkflow } from './src/workflows/analyze-pr-workflow';

async function test() {
  console.log('🧪 Testing Complete Workflow...\n');

  try {
    const result = await analyzePRWorkflow({
      owner: 'microsoft',
      repo: 'vscode',
      prNumber: 283599
    });

    console.log('📋 Final Result:');
    console.log('   PR:', result.pr.title);
    console.log('   Quality:', result.analysis.qualityScore);
    console.log('   Database ID:', result.databaseId);

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  }
}

test();