import { useState } from 'react';
import { Rocket, Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function QuickDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDemo = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/analyze-pr`, {
        owner: 'microsoft',
        repo: 'vscode',
        prNumber: 200000
      });

      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 mb-8 animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold mb-2 flex items-center">
            <Rocket className="mr-3 w-8 h-8 text-green-400" />
            Try Live Demo
          </h2>
          <p className="text-gray-300">
            Analyze a real GitHub PR from Microsoft VS Code
          </p>
          <p className="text-sm text-gray-400 mt-2">
            ⏱️ Takes 10-15 seconds • Uses real AI • Stores in database
          </p>
        </div>
        <button
          onClick={runDemo}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Rocket />
              <span>Run Live Demo</span>
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-600/20 border border-blue-500 rounded-xl p-6 animate-pulse">
          <div className="flex items-center mb-4">
            <Loader2 className="animate-spin w-8 h-8 mr-4" />
            <div>
              <p className="font-bold text-lg">Analyzing Microsoft VS Code PR...</p>
              <p className="text-sm text-blue-200">
                Fetching from GitHub → AI Analysis → Storing Results
              </p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      )}

      {/* Success State */}
      {result && (
        <div className="bg-green-600/20 border border-green-500 rounded-xl p-6 animate-slide-in">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="font-bold text-xl">Analysis Complete!</p>
              <p className="text-sm text-green-200">{result.pr.title}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <MetricBox
              label="Quality Score"
              value={`${result.analysis.qualityScore}/100`}
              color="green"
            />
            <MetricBox
              label="Complexity"
              value={result.analysis.complexity}
              color="yellow"
            />
            <MetricBox
              label="Tech Debt"
              value={`${result.analysis.techDebtScore}/100`}
              color="orange"
            />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-600/20 border border-red-500 rounded-xl p-6 animate-slide-in">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-400 mr-3" />
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2 text-red-200">
                Make sure backend is running: <code className="bg-black/30 px-2 py-1 rounded">npm run dev</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses = {
    green: 'bg-green-600/50',
    yellow: 'bg-yellow-600/50',
    orange: 'bg-orange-600/50',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-4 text-center`}>
      <p className="text-sm opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}