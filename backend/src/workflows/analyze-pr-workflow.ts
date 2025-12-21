import 'dotenv/config';
import { handler as fetchPR } from '../fetch-github-pr.api.step';
import { handler as analyzeAI } from '../analyze-code-ai.api.step';
import { saveAnalysis, saveAlert } from '../database';

export async function analyzePRWorkflow(input: { owner: string; repo: string; prNumber: number }) {
  console.log('\n🚀 ========================================');
  console.log('    STARTING PR ANALYSIS WORKFLOW');
  console.log('========================================\n');

  try {
    // Step 1: Fetch PR from GitHub
    console.log('📍 STEP 1/4: Fetch PR Data');
    const prData = await fetchPR(input);

    // Step 2: AI Analysis
    console.log('\n📍 STEP 2/4: AI Code Analysis');
    const aiAnalysis = await analyzeAI({
      pr: prData.pr,
      files: prData.files
    });

    // Step 3: Save to Database
    console.log('\n📍 STEP 3/4: Save to Database');
    const dbResult = saveAnalysis({
      prUrl: prData.pr.url,
      prTitle: prData.pr.title,
      qualityScore: aiAnalysis.qualityScore,
      complexity: aiAnalysis.complexity,
      techDebt: aiAnalysis.techDebtScore,
      analysisData: JSON.stringify(aiAnalysis)
    });
    console.log('✅ Saved with ID:', dbResult.lastInsertRowid);

    // Step 4: Check for Alerts
    console.log('\n📍 STEP 4/4: Check Quality Alerts');
    if (aiAnalysis.qualityScore < 60) {
      const severity = aiAnalysis.qualityScore < 40 ? 'high' : 'medium';
      saveAlert(
        'low_quality',
        severity,
        `PR "${prData.pr.title}" has low quality score: ${aiAnalysis.qualityScore}/100`
      );
      console.log(`⚠️  Alert created: ${severity.toUpperCase()}`);
    } else {
      console.log('✅ Quality acceptable, no alerts needed');
    }

    console.log('\n✅ ========================================');
    console.log('    WORKFLOW COMPLETED SUCCESSFULLY!');
    console.log('========================================\n');

    return {
      success: true,
      pr: prData.pr,
      analysis: aiAnalysis,
      databaseId: dbResult.lastInsertRowid
    };

  } catch (error: any) {
    console.error('\n❌ ========================================');
    console.error('    WORKFLOW FAILED');
    console.error('========================================');
    console.error('Error:', error.message);
    console.error('========================================\n');
    throw error;
  }
}