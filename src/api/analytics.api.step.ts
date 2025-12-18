import { getDatabase } from '../database';

export const config = {
  name: 'analytics-api',
  description: 'Get analytics and trends',
  type: 'api' as const,
  method: 'GET',
  path: '/api/analytics',
  emits: [],
};

export async function handler() {
  try {
    const db = getDatabase();
    
    // Last 7 days trend
    const weeklyTrend = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        AVG(quality_score) as avg_quality,
        AVG(tech_debt) as avg_debt
      FROM code_analysis
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all();

    // Complexity distribution
    const complexityDist = db.prepare(`
      SELECT 
        complexity,
        COUNT(*) as count
      FROM code_analysis
      GROUP BY complexity
    `).all();

    // Top issues
    const recentAlerts = db.prepare(`
      SELECT * FROM alerts
      ORDER BY created_at DESC
      LIMIT 20
    `).all();

    return {
      status: 200,
      body: {
        success: true,
        weeklyTrend,
        complexityDistribution: complexityDist,
        recentAlerts: recentAlerts.map((a: any) => ({
          id: a.id,
          type: a.type,
          severity: a.severity,
          message: a.message,
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