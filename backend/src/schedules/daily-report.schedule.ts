import { getDatabase } from '../database';

export const config = {
  name: 'daily-report',
  description: 'Generate daily team health report',
  schedule: '0 9 * * *', // 9 AM daily
  emits: ['daily-report-generated'],
};

export async function handler() {
  console.log('\n📊 Generating Daily Report...');

  const db = getDatabase();
  
  // Get last 24 hours data
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayAnalysis = db.prepare(`
    SELECT * FROM code_analysis 
    WHERE created_at >= datetime('now', '-1 day')
    ORDER BY created_at DESC
  `).all() as any[];

  if (todayAnalysis.length === 0) {
    console.log('No analysis performed in last 24 hours');
    return { 
      success: true, 
      report: { message: 'No data for today' } 
    };
  }

  // Calculate stats
  const avgQuality = todayAnalysis.reduce((sum, a) => sum + a.quality_score, 0) / todayAnalysis.length;
  const highQuality = todayAnalysis.filter(a => a.quality_score >= 80).length;
  const mediumQuality = todayAnalysis.filter(a => a.quality_score >= 60 && a.quality_score < 80).length;
  const lowQuality = todayAnalysis.filter(a => a.quality_score < 60).length;

  const report = {
    date: new Date().toISOString().split('T')[0],
    totalPRs: todayAnalysis.length,
    averageQuality: Math.round(avgQuality),
    highQuality,
    mediumQuality,
    lowQuality,
    summary: `Analyzed ${todayAnalysis.length} PRs with avg quality ${Math.round(avgQuality)}/100`
  };

  console.log('📋 Daily Report:', report);

  // Send to Discord if configured
  if (process.env.DISCORD_WEBHOOK_URL) {
    await sendDiscordReport(report);
  }

  return { success: true, report };
}

async function sendDiscordReport(report: any) {
  const color = report.averageQuality >= 80 ? 3066993 : 
                report.averageQuality >= 60 ? 15844367 : 15158332;

  try {
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '📊 Daily Team Report',
          description: `Report for ${report.date}`,
          color,
          fields: [
            { name: 'PRs Analyzed', value: `${report.totalPRs}`, inline: true },
            { name: 'Avg Quality', value: `${report.averageQuality}/100`, inline: true },
            { name: 'High Quality (80+)', value: `${report.highQuality}`, inline: true },
            { name: 'Low Quality (<60)', value: `${report.lowQuality}`, inline: true }
          ],
          footer: { text: 'DevPulse - AI Team Health Monitor' },
          timestamp: new Date().toISOString()
        }]
      })
    });
    console.log('✅ Report sent to Discord');
  } catch (error) {
    console.log('⚠️  Failed to send Discord report');
  }
}