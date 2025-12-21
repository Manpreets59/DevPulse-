import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function Charts() {
  const [trendData, setTrendData] = useState([]);
  const [complexityData, setComplexityData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE}/analytics`);
      if (response.data.success) {
        setTrendData(response.data.weeklyTrend.map((d: any) => ({
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          quality: Math.round(d.avg_quality)
        })));
        
        setComplexityData(response.data.complexityDistribution.map((d: any) => ({
          name: d.complexity.toUpperCase(),
          value: d.count
        })));
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Trend Chart */}
      <div className="card p-6 animate-slide-in">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Quality Trend (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis domain={[0, 100]} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
            />
            <Line
              type="monotone"
              dataKey="quality"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Shows average code quality scores over time
        </p>
      </div>

      {/* Complexity Chart */}
      <div className="card p-6 animate-slide-in">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Complexity Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={complexityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {complexityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Breakdown of PR complexity levels
        </p>
      </div>
    </div>
  );
}