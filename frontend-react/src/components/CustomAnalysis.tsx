import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function CustomAnalysis() {
  const [formData, setFormData] = useState({
    owner: 'microsoft',
    repo: 'vscode',
    prNumber: '199954'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/analyze-pr`, {
        owner: formData.owner,
        repo: formData.repo,
        prNumber: parseInt(formData.prNumber)
      });

      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 animate-slide-in">
      <h3 className="text-2xl font-bold mb-4 flex items-center">
        <Search className="mr-3 w-7 h-7 text-yellow-400" />
        Analyze Custom GitHub PR
      </h3>
      <p className="text-gray-300 mb-6">
        Enter any public GitHub PR to analyze its code quality with AI
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Owner (e.g., facebook)"
          value={formData.owner}
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          className="bg-gray-700 rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Repo (e.g., react)"
          value={formData.repo}
          onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
          className="bg-gray-700 rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="number"
          placeholder="PR # (e.g., 28000)"
          value={formData.prNumber}
          onChange={(e) => setFormData({ ...formData, prNumber: e.target.value })}
          className="bg-gray-700 rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg px-6 py-3 font-bold disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search />
              <span>Analyze</span>
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="bg-green-600/20 border border-green-500 rounded-lg p-6 animate-slide-in">
          <p className="font-bold text-lg mb-3">✅ Analysis Complete!</p>
          <p className="text-sm mb-4">{result.pr.title}</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded p-3 text-center">
              <p className="text-xs mb-1">Quality</p>
              <p className="text-2xl font-bold">{result.analysis.qualityScore}/100</p>
            </div>
            <div className="bg-white/10 rounded p-3 text-center">
              <p className="text-xs mb-1">Complexity</p>
              <p className="text-2xl font-bold">{result.analysis.complexity}</p>
            </div>
            <div className="bg-white/10 rounded p-3 text-center">
              <p className="text-xs mb-1">Issues</p>
              <p className="text-2xl font-bold">{result.analysis.issues?.length || 0}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-4">
          <p className="font-bold">❌ Error: {error}</p>
        </div>
      )}
    </div>
  );
}
