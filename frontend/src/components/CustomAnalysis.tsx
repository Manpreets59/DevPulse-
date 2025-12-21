import { useState } from 'react';
import { Search, Loader2, CheckCircle, XCircle, AlertTriangle, Shield, Zap, Target } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

interface Issue {
  severity: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  location?: string;
  recommendation: string;
}

interface Analysis {
  qualityScore: number;
  complexity: string;
  techDebtScore: number;
  overallAssessment?: string;
  strengths?: string[];
  issues?: Issue[];
  codeSmells?: string[];
  securityConcerns?: string[];
  performanceImpact?: string;
  testCoverage?: string;
  suggestions?: string[];
  reviewerNotes?: string;
}

export default function CustomAnalysis() {
  const [formData, setFormData] = useState({
    owner: 'microsoft',
    repo: 'vscode',
    prNumber: '283599'
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
        <div className="space-y-6 animate-slide-in">
          <AnalysisResults analysis={result.analysis} pr={result.pr} />
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

function AnalysisResults({ analysis, pr }: { analysis: Analysis; pr: any }) {
  return (
    <>
      {/* Success Banner */}
      <div className="bg-green-600/20 border border-green-500 rounded-xl p-6">
        <div className="flex items-center mb-2">
          <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
          <div>
            <p className="font-bold text-2xl">✅ Deep Analysis Complete!</p>
            <p className="text-sm text-green-200">{pr.title}</p>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-3 gap-4">
        <ScoreCard
          label="Quality Score"
          value={analysis.qualityScore}
          suffix="/100"
          color="green"
        />
        <ScoreCard
          label="Complexity"
          value={analysis.complexity.toUpperCase()}
          color="yellow"
        />
        <ScoreCard
          label="Tech Debt"
          value={analysis.techDebtScore}
          suffix="/100"
          color="orange"
        />
      </div>

      {/* Overall Assessment */}
      {analysis.overallAssessment && (
        <div className="card p-6 bg-blue-600/20 border-blue-500">
          <h3 className="text-xl font-bold mb-3 flex items-center">
            <Target className="mr-2 w-6 h-6 text-blue-400" />
            Overall Assessment
          </h3>
          <p className="text-lg leading-relaxed">{analysis.overallAssessment}</p>
        </div>
      )}

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <div className="card p-6 bg-green-600/10 border-green-500">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <CheckCircle className="mr-2 w-6 h-6 text-green-400" />
            Strengths ({analysis.strengths.length})
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span className="text-gray-200">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues Found */}
      {analysis.issues && analysis.issues.length > 0 ? (
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <AlertTriangle className="mr-2 w-6 h-6 text-yellow-400" />
            Issues Found ({analysis.issues.length})
          </h3>
          <div className="space-y-4">
            {analysis.issues.map((issue, idx) => (
              <IssueCard key={idx} issue={issue} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-6 bg-green-600/10 border-green-500">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <CheckCircle className="mr-2 w-6 h-6 text-green-400" />
            No Critical Issues Found
          </h3>
          <p className="text-gray-300">The code appears to follow best practices with no major concerns.</p>
        </div>
      )}

      {/* Security Concerns */}
      {analysis.securityConcerns && analysis.securityConcerns.length > 0 && 
       analysis.securityConcerns[0] !== 'No concerns' && (
        <div className="card p-6 bg-red-600/10 border-red-500">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Shield className="mr-2 w-6 h-6 text-red-400" />
            Security Concerns
          </h3>
          <ul className="space-y-2">
            {analysis.securityConcerns.map((concern, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-red-400 mr-3">⚠️</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Smells */}
      {analysis.codeSmells && analysis.codeSmells.length > 0 && (
        <div className="card p-6 bg-yellow-600/10 border-yellow-500">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Zap className="mr-2 w-6 h-6 text-yellow-400" />
            Code Smells
          </h3>
          <ul className="space-y-2">
            {analysis.codeSmells.map((smell, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-3">⚡</span>
                <span>{smell}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Performance & Testing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-6 bg-purple-600/10 border-purple-500">
          <h4 className="font-bold mb-2 flex items-center">
            <Zap className="mr-2 w-5 h-5 text-purple-400" />
            Performance Impact
          </h4>
          <p className="text-sm text-gray-300">{analysis.performanceImpact || 'Not assessed'}</p>
        </div>
        <div className="card p-6 bg-teal-600/10 border-teal-500">
          <h4 className="font-bold mb-2 flex items-center">
            <Target className="mr-2 w-5 h-5 text-teal-400" />
            Test Coverage
          </h4>
          <p className="text-sm text-gray-300">{analysis.testCoverage || 'Not assessed'}</p>
        </div>
      </div>

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="card p-6 bg-blue-600/10 border-blue-500">
          <h3 className="text-xl font-bold mb-4">💡 Actionable Suggestions</h3>
          <ol className="space-y-3 list-decimal list-inside">
            {analysis.suggestions.map((suggestion, idx) => (
              <li key={idx} className="pl-2 text-gray-200">{suggestion}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Reviewer Notes */}
      {analysis.reviewerNotes && (
        <div className="card p-6 bg-gray-700">
          <h3 className="text-xl font-bold mb-3">📝 Reviewer Notes</h3>
          <p className="text-gray-200">{analysis.reviewerNotes}</p>
        </div>
      )}
    </>
  );
}

function ScoreCard({ label, value, suffix = '', color }: any) {
  const colorClasses = {
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-6 text-center transform hover:scale-105 transition-all`}>
      <p className="text-sm opacity-80 mb-2">{label}</p>
      <p className="text-4xl font-bold">{value}{suffix}</p>
    </div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const severityColors = {
    high: 'border-red-500 bg-red-600/10',
    medium: 'border-yellow-500 bg-yellow-600/10',
    low: 'border-blue-500 bg-blue-600/10',
  };

  const badgeColors = {
    high: 'bg-red-600',
    medium: 'bg-yellow-600',
    low: 'bg-blue-600',
  };

  return (
    <div className={`rounded-lg p-4 border-l-4 ${severityColors[issue.severity]}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg">{issue.title}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColors[issue.severity]}`}>
          {issue.severity.toUpperCase()}
        </span>
      </div>
      <div className="text-sm text-gray-400 mb-2">
        <strong>Category:</strong> {issue.category}
        {issue.location && <> | <strong>Location:</strong> {issue.location}</>}
      </div>
      <p className="text-gray-300 mb-3">{issue.description}</p>
      <div className="bg-blue-900/50 rounded p-3">
        <strong className="text-blue-300">💡 Recommendation:</strong>
        <p className="text-sm mt-1 text-gray-200">{issue.recommendation}</p>
      </div>
    </div>
  );
}
