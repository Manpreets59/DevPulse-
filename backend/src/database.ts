import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase() {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'devpulse.db');
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS code_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pr_url TEXT NOT NULL,
      pr_title TEXT,
      quality_score INTEGER,
      complexity TEXT,
      tech_debt INTEGER,
      analysis_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Database initialized:', dbPath);
  return db;
}

export function saveAnalysis(data: {
  prUrl: string;
  prTitle: string;
  qualityScore: number;
  complexity: string;
  techDebt: number;
  analysisData: string;
}) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO code_analysis (pr_url, pr_title, quality_score, complexity, tech_debt, analysis_data)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(data.prUrl, data.prTitle, data.qualityScore, data.complexity, data.techDebt, data.analysisData);
}

export function getRecentAnalysis(limit = 10) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM code_analysis ORDER BY created_at DESC LIMIT ?').all(limit);
}

export function saveAlert(type: string, severity: string, message: string, metadata?: string) {
  const db = getDatabase();
  const stmt = db.prepare('INSERT INTO alerts (type, severity, message, metadata) VALUES (?, ?, ?, ?)');
  return stmt.run(type, severity, message, metadata || '{}');
}