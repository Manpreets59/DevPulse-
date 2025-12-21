import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function RecentAnalysis() {
  const [analysis, setAnalysis] = useState<any[]>([]);

  useEffect(() => {
    loadAnalysis();
    const interval = setInterval(loadAnalysis, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalysis = async () => {
    try {
      const response = await axios.get(`${API_BASE}/dashboard`);
      if (response.data.success) {
        setAnalysis(response.data.recentAnalysis);
      }
    } catch (error) {
      console.error('Failed to load analysis:', error);
    }
  };

  return (
    <div className="card p-6 mb-8 animate-slide-in">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <Clock className="mr-3 w-7 h-7 text-green-400" />
        Recent Analysis Results
      </h3>
      
      {analysis.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-400 text-lg">No analysis data yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Click "Run Live Demo" above to see it in action!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">PR Title</th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">Quality</th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {analysis.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="py-4 px-4 font-medium">{item.prTitle}</td>
                  <td className="py-4 px-4">
                    <span className={`px-4 py-2 rounded-full font-bold ${
                      item.qualityScore >= 80 ? 'bg-green-600' :
                      item.qualityScore >= 60 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}>
                      {item.qualityScore}/100
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}