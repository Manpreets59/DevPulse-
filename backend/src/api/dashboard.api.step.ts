import { getDatabase, getRecentAnalysis } from '../database';

export const config = {
  name: 'dashboard-api',
  description: 'Get dashboard metrics',
  type: 'api' as const,
  method: 'GET',
  path: '/api/dashboard',
  emits: [],
};

export async function handler() {
  try {
    const db = getDatabase();
    
    const recentAnalysis = getRecentAnalysis(10);
    
    const total = db.prepare('SELECT COUNT(*) as count FROM code_analysis').get() as { count: number };
    const avgQual = db.prepare('SELECT AVG(quality_score) as avg FROM code_analysis').get() as { avg: number };
    const alerts = db.prepare('SELECT COUNT(*) as count FROM alerts').get() as { count: number };
    
    return {
      status: 200,
      body: {
        success: true,
        metrics: {
          totalAnalysis: total.count,
          averageQuality: Math.round(avgQual.avg || 0),
          activeAlerts: alerts.count
        },
        recentAnalysis: recentAnalysis.map((a: any) => ({
          id: a.id,
          prTitle: a.pr_title,
          qualityScore: a.quality_score,
          createdAt: a.created_at
        }))
      }
    };
  } catch (error: any) {
    return {
      status: 500,
      body: { success: false, error: error.message }
    };
  }
}