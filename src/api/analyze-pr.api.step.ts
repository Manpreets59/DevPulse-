import { analyzePRWorkflow } from '../workflows/analyze-pr-workflow';

export const config = {
  name: 'analyze-pr-api',
  description: 'API to trigger PR analysis',
  type: 'api' as const,
  method: 'POST',
  path: '/api/analyze-pr',
  emits: [],
};

export async function handler(input: any) {
  const { owner, repo, prNumber } = input;

  if (!owner || !repo || !prNumber) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Missing: owner, repo, prNumber'
      }
    };
  }

  try {
    const result = await analyzePRWorkflow({ owner, repo, prNumber });
    return {
      status: 200,
      body: { success: true, data: result }
    };
  } catch (error: any) {
    return {
      status: 500,
      body: { success: false, error: error.message }
    };
  }
}