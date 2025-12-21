import { Octokit } from '@octokit/rest';

// Motia step configuration (match hello example format)
export const config = {
  name: 'fetch-github-pr',
  description: 'Fetch pull request data from GitHub API',
  type: 'api' as const,
  method: 'POST',
  path: '/github/fetch-pr',
  emits: [], // Required by Motia
};

export async function handler(input: any) {
  console.log(`\n📥 Fetching PR #${input.prNumber} from ${input.owner}/${input.repo}`);

  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const { data: pr } = await octokit.pulls.get({
      owner: input.owner,
      repo: input.repo,
      pull_number: input.prNumber
    });

    const { data: files } = await octokit.pulls.listFiles({
      owner: input.owner,
      repo: input.repo,
      pull_number: input.prNumber
    });

    console.log(`✅ Fetched: "${pr.title}"`);

    return {
      success: true,
      pr: {
        number: pr.number,
        title: pr.title,
        body: pr.body || '',
        url: pr.html_url,
        state: pr.state,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        author: pr.user?.login || 'unknown'
      },
      files: files.map(f => ({
        filename: f.filename,
        additions: f.additions,
        deletions: f.deletions
      }))
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    const errorStatus = error.status || error.response?.status || 'Unknown';
    const docUrl = error.response?.data?.documentation_url || 'https://docs.github.com/rest';
    
    console.error(`❌ GitHub API Error [${errorStatus}]: ${errorMessage}`);
    console.error(`📖 Docs: ${docUrl}`);
    
    throw new Error(`Failed to fetch PR: ${errorStatus} - ${errorMessage}`);
  }
}