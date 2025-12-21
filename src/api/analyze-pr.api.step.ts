import { handler as fetchPR } from '../fetch-github-pr.api.step';
import { handler as analyzeAI } from '../analyze-code-ai.api.step';
import { saveAnalysis, saveAlert } from '../database';

export const config = {
  name: 'analyze-pr-api',
  description: 'API to trigger PR analysis',
  type: 'api' as const,
  method: 'POST',
  path: '/api/analyze-pr',
  emits: [],
};

export async function handler(req: any) {
  console.log('📝 Analyze PR API called');
  
  const input = req.body || req;
  const { owner, repo, prNumber } = input;

  if (!owner || !repo || !prNumber) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Missing required fields: owner, repo, prNumber'
      }
    };
  }

  try {
    console.log(`🚀 Starting inline analysis for ${owner}/${repo}#${prNumber}`);

    // Step 1: Fetch PR
    console.log('📍 STEP 1: Fetch PR Data');
    const prData = await fetchPR({ owner, repo, prNumber });

    // Step 2: AI Analysis
    console.log('📍 STEP 2: AI Code Analysis');
    const aiAnalysis = await analyzeAI({
      pr: prData.pr,
      files: prData.files
    });

    // Step 3: Save to Database
    console.log('📍 STEP 3: Save to Database');
    const dbResult = saveAnalysis({
      prUrl: prData.pr.url,
      prTitle: prData.pr.title,
      qualityScore: aiAnalysis.qualityScore,
      complexity: aiAnalysis.complexity,
      techDebt: aiAnalysis.techDebtScore,
      analysisData: JSON.stringify(aiAnalysis)
    });

    // Step 4: Alerts
    if (aiAnalysis.qualityScore < 60) {
      saveAlert('low_quality', 'medium', 
        `Low quality PR: ${aiAnalysis.qualityScore}/100`);
    }

    console.log('✅ Analysis complete!');

    return {
      status: 200,
      body: {
        success: true,
        data: {
          pr: prData.pr,
          analysis: aiAnalysis,
          databaseId: dbResult.lastInsertRowid
        }
      }
    };

  } catch (error: any) {
    console.error('❌ Analysis failed:', error);
    return {
      status: 500,
      body: {
        success: false,
        error: error.message
      }
    };
  }
}