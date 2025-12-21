import { Activity } from 'lucide-react';

export default function Hero() {
  return (
    <div className="gradient-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-6xl font-bold mb-3 flex items-center animate-slide-in">
              <Activity className="mr-4 w-16 h-16" />
              DevPulse
            </h1>
            <p className="text-2xl text-purple-100">
              AI-Powered Code Quality & Team Health Monitor
            </p>
          </div>
          <div className="flex items-center space-x-3 glass px-6 py-3 rounded-full">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold text-lg">System Active</span>
          </div>
        </div>

        {/* What It Does */}
        <div className="glass rounded-3xl p-8 animate-slide-in">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-3">💡</span>
            What DevPulse Does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="AI Code Analysis"
              description="Automatically analyzes GitHub PRs using Groq AI - provides quality scores, detects bugs, and suggests improvements in real-time"
            />
            <FeatureCard
              icon="📊"
              title="Team Health Monitoring"
              description="Tracks code quality trends, generates daily reports, and identifies patterns that affect team productivity"
            />
            <FeatureCard
              icon="⚡"
              title="Automated Workflows"
              description="Built on Motia - orchestrates GitHub API, AI analysis, database storage, and instant notifications seamlessly"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-all transform hover:scale-105">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-purple-100 text-sm leading-relaxed">{description}</p>
    </div>
  );
}