import 'dotenv/config';
import { handler as fetchPR } from '../fetch-github-pr.api.step';
import { handler as analyzeAI } from '../analyze-code-ai.api.step';
import { saveAnalysis, saveAlert } from '../database';

export async function analyzePRWorkflow(input: { owner: string; repo: string; prNumber: number }) {
  console.log('\n🚀 Starting PR Analysis...\n');

  try {
    // Step 1: Fetch
    const prData = await fetchPR(input);

    // Step 2: Analyze
    const aiAnalysis = await analyzeAI({
      pr: prData.pr,
      files: prData.files
    });

    // Step 3: Save
    const dbResult = saveAnalysis({
      prUrl: prData.pr.url,
      prTitle: prData.pr.title,
      qualityScore: aiAnalysis.qualityScore,
      complexity: aiAnalysis.complexity,
      techDebt: aiAnalysis.techDebtScore,
      analysisData: JSON.stringify(aiAnalysis)
    });

    // Step 4: Alert
    if (aiAnalysis.qualityScore < 60) {
      saveAlert('low_quality', 
        aiAnalysis.qualityScore < 40 ? 'high' : 'medium',
        `Low quality: ${aiAnalysis.qualityScore}/100`
      );
    }

    console.log('\n✅ Workflow completed!\n');

    return {
      success: true,
      pr: prData.pr,
      analysis: aiAnalysis,
      databaseId: dbResult.lastInsertRowid
    };
  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    throw error;
  }
}