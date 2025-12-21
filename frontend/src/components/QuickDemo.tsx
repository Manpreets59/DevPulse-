import { useState } from 'react';
import { Rocket, Loader2, CheckCircle, XCircle, AlertTriangle, Shield, Zap, Target } from 'lucide-react';
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
        prNumber: 283599
      }, {
        timeout: 60000
      });

      if (response.data.success) {
        setResult(response.data.data);
      } else {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Try again.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Server error');
      } else if (err.request) {
        setError('Cannot connect to backend. Make sure it\'s running on port 3000');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Demo Button Card */}
      <div className="card p-8 animate-slide-in">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Rocket className="mr-3 w-8 h-8 text-green-400" />
              Try Live Demo
            </h2>
            <p className="text-gray-300">
              Watch AI perform deep code analysis on Microsoft VS Code PR
            </p>
            <p className="text-sm text-gray-400 mt-2">
              ⏱️ Takes 10-15 seconds • Uses real Groq AI • Detailed insights
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
                <p className="font-bold text-lg">AI is performing deep analysis...</p>
                <p className="text-sm text-blue-200">
                  Checking code quality, security, performance, and best practices...
                </p>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full animate-pulse" style={{ width: '70%' }}></div>
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
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-slide-in">
          <AnalysisResults analysis={result.analysis} pr={result.pr} />
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