import 'dotenv/config';
import { handler as fetchPR } from './src/fetch-github-pr.api.step';
import { handler as analyzeAI } from './src/analyze-code-ai.api.step';
import { saveAnalysis } from './src/database';

async function test() {
  console.log('🧪 Testing workflow directly...\n');

  try {
    // Step 1
    const prData = await fetchPR({
      owner: 'microsoft',
      repo: 'vscode',
      prNumber: 199954
    });
    console.log('✅ Step 1 done');

    // Step 2
    const aiAnalysis = await analyzeAI({
      pr: prData.pr,
      files: prData.files
    });
    console.log('✅ Step 2 done');

    // Step 3
    const dbResult = saveAnalysis({
      prUrl: prData.pr.url,
      prTitle: prData.pr.title,
      qualityScore: aiAnalysis.qualityScore,
      complexity: aiAnalysis.complexity,
      techDebt: aiAnalysis.techDebtScore,
      analysisData: JSON.stringify(aiAnalysis)
    });
    console.log('✅ Step 3 done');

    console.log('\n🎉 SUCCESS! Everything works!');
    console.log('Quality Score:', aiAnalysis.qualityScore);

  } catch (error: any) {
    console.error('❌ Failed:', error.message);
  }
}

test();