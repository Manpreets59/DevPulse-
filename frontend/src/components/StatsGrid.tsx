import { useEffect, useState } from 'react';
import { TrendingUp, Star, AlertTriangle, Heart } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function StatsGrid() {
  const [stats, setStats] = useState({
    totalAnalysis: 0,
    averageQuality: 0,
    activeAlerts: 0,
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/dashboard`);
      if (response.data.success) {
        setStats(response.data.metrics);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={TrendingUp}
        label="Total Analysis"
        value={stats.totalAnalysis}
        subtext="PRs Analyzed"
        gradient="from-blue-600 to-blue-800"
      />
      <StatCard
        icon={Star}
        label="Quality Score"
        value={stats.averageQuality}
        subtext="Average /100"
        gradient="from-green-600 to-green-800"
      />
      <StatCard
        icon={AlertTriangle}
        label="Active Alerts"
        value={stats.activeAlerts}
        subtext="Need Attention"
        gradient="from-yellow-600 to-orange-600"
      />
      <StatCard
        icon={Heart}
        label="Team Health"
        value={stats.averageQuality}
        subtext={getHealthStatus(stats.averageQuality)}
        gradient="from-purple-600 to-pink-600"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, gradient }: any) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const increment = value / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all animate-slide-in`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-80 mb-1">{label}</p>
          <h3 className="text-5xl font-bold">{displayValue}</h3>
          <p className="text-xs opacity-80 mt-2">{subtext}</p>
        </div>
        <Icon className="w-12 h-12 opacity-30" />
      </div>
    </div>
  );
}

function getHealthStatus(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Work';
}