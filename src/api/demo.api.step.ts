export const config = {
  name: 'demo-mode',
  description: 'Run demo analysis on popular repos',
  type: 'api' as const,
  method: 'GET',
  path: '/api/demo',
  emits: [],
};

const demoRepos = [
  { owner: 'microsoft', repo: 'vscode', prNumber: 200000, title: 'VS Code PR' },
  { owner: 'facebook', repo: 'react', prNumber: 28000, title: 'React PR' },
  { owner: 'vercel', repo: 'next.js', prNumber: 60000, title: 'Next.js PR' },
];

export async function handler() {
  const repo = demoRepos[Math.floor(Math.random() * demoRepos.length)];
  
  return {
    status: 200,
    body: {
      success: true,
      message: 'Demo mode activated',
      repo,
      instructions: `POST to /api/analyze-pr with: ${JSON.stringify(repo)}`
    }
  };
}