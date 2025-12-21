# 🚀 DevPulse - AI-Powered Development Team Health Monitor

[![Motia](https://img.shields.io/badge/Built%20with-Motia-blue)](https://motia.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> Real-time code quality analysis and team health monitoring powered by AI and automated workflows

## 🎯 What is DevPulse?

DevPulse automatically analyzes pull requests using AI, provides actionable insights, and monitors your development team's health in real-time. Built with Motia's powerful workflow orchestration framework.

## ✨ Features

- 🤖 **AI Code Analysis** - Groq-powered code quality assessment
- 📊 **Real-time Dashboard** - Live metrics and visualizations
- 🔔 **Smart Alerts** - Automated notifications for quality issues
- 📈 **Trend Analysis** - Track team health over time
- ⏰ **Scheduled Reports** - Daily automated team reports
- 🎯 **GitHub Integration** - Direct PR analysis from GitHub

## 🏗️ Architecture

DevPulse leverages Motia's core features:
```
GitHub PR → Motia Workflow → AI Analysis → Database → Notifications
```

**Technologies:**
- **Backend**: Motia Framework (TypeScript)
- **AI**: Groq (Llama 3.3 70B)
- **Database**: SQLite
- **Frontend**: HTML/CSS/JavaScript + Chart.js
- **Integrations**: GitHub API, Discord Webhooks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token
- Groq API Key (free)
- Discord Webhook URL (optional)

### Installation
```bash
# Clone and install
git clone <your-repo>
cd DevPulse
npm install

# Setup environment
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev
```

### Configuration

Edit `.env`:
```env
GITHUB_TOKEN=your_github_token
GROQ_API_KEY=your_groq_key
DISCORD_WEBHOOK_URL=your_discord_webhook
```

## 📱 Usage

### 1. Motia Workbench
Access at `http://localhost:3000`

View all registered:
- API endpoints
- Workflows
- Scheduled tasks
- Real-time logs

### 2. Dashboard
Open `frontend/index.html` in browser

Features:
- Live metrics
- Quality trends
- Recent analysis
- Quick demo mode

### 3. API Endpoints

**Analyze PR:**
```bash
curl -X POST http://localhost:3000/api/analyze-pr \
  -H "Content-Type: application/json" \
  -d '{"owner":"microsoft","repo":"vscode","prNumber":200000}'
```

**Get Dashboard Metrics:**
```bash
curl http://localhost:3000/api/dashboard
```

**Get Analytics:**
```bash
curl http://localhost:3000/api/analytics
```

### 4. Scheduled Tasks

Daily report runs automatically at 9 AM:
- Team health summary
- Quality metrics
- Trends analysis
- Discord notification

## 🎯 Demo for Judges

### Quick Demo Mode

1. Start server: `npm run dev`
2. Open dashboard: `frontend/index.html`
3. Click "Run Demo" button
4. Watch real-time analysis!

### Manual Analysis

1. Enter any public GitHub PR:
   - Owner: `microsoft`
   - Repo: `vscode`
   - PR #: `200000`
2. Click "Analyze"
3. See AI-powered insights in 10-15 seconds

## 🏆 Why DevPulse Wins

### 1. **Deep Motia Integration**
Uses ALL Motia features:
- ✅ Workflows (Step orchestration)
- ✅ API Steps (REST endpoints)
- ✅ Event Steps (GitHub webhooks)
- ✅ Scheduled Tasks (Daily reports)
- ✅ Background Jobs (Async processing)

### 2. **Real AI Integration**
Not fake AI - actual Groq LLM analysis:
- Code quality scoring
- Issue detection
- Actionable suggestions

### 3. **Production-Ready**
- Error handling
- Database persistence
- Real-time updates
- Scalable architecture

### 4. **Solves Real Problems**
- Catches bugs early
- Reduces technical debt
- Improves team productivity
- Prevents developer burnout

## 📊 Project Structure
```
DevPulse/
├── src/
│   ├── api/                    # API endpoints
│   │   ├── analyze-pr.api.step.ts
│   │   ├── dashboard.api.step.ts
│   │   └── analytics.api.step.ts
│   ├── workflows/              # Workflow logic
│   │   └── analyze-pr-workflow.ts
│   ├── schedules/              # Scheduled tasks
│   │   └── daily-report.schedule.ts
│   ├── fetch-github-pr.api.step.ts
│   ├── analyze-code-ai.api.step.ts
│   └── database.ts
├── frontend/
│   └── index.html              # Dashboard UI
├── test-complete.ts            # E2E test
└── README.md
```

## 🧪 Testing
```bash
# Test complete workflow
npx tsx test-complete.ts

# Test database
npx tsx test-database.ts

# Test API endpoints
npm run test:api
```

## 🎬 Video Demo Script

1. **Introduction** (30s)
   - Show problem: Manual code reviews miss issues
   - Show solution: DevPulse automates it with AI

2. **Live Demo** (2min)
   - Open Motia Workbench
   - Trigger PR analysis
   - Show logs in real-time
   - Display dashboard results

3. **Features Tour** (1.5min)
   - Quality trends
   - AI insights
   - Scheduled reports
   - Alert system

4. **Technical Deep Dive** (1min)
   - Show Motia workflow code
   - Explain AI integration
   - Highlight scalability

## 🚢 Deployment
```bash
# Build for production
npm run build

# Deploy to Motia Cloud
motia cloud deploy --api-key YOUR_KEY
```

## 🤝 Contributing

Built for Motia Hackathon 2025

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- Motia Framework team
- Groq for AI inference
- GitHub API
- Open source community

---

**Built with ❤️❤️ using Motia**
