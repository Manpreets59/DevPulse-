import Groq from 'groq-sdk';

export const config = {
  name: 'analyze-code-ai',
  description: 'Analyze code quality using Groq AI with detailed insights',
  type: 'api' as const,
  method: 'POST',
  path: '/ai/analyze-code',
  emits: [],
};

export async function handler(input: any) {
  console.log('\n🤖 Running Enhanced AI Analysis with Groq...');

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const fileSummary = input.files
    .slice(0, 15)
    .map((f: any) => `  - ${f.filename}: +${f.additions} -${f.deletions} lines`)
    .join('\n');

  const prompt = `You are a senior software engineer performing a detailed code review. Analyze this pull request thoroughly.

**Pull Request Information:**
Title: ${input.pr.title}
Description: ${input.pr.body}
Author: ${input.pr.author}
Changes: ${input.pr.additions} additions, ${input.pr.deletions} deletions in ${input.pr.changedFiles} files

**Files Changed:**
${fileSummary}

Provide a comprehensive code review in this EXACT JSON format (no markdown, no extra text):

{
  "qualityScore": <number 0-100>,
  "complexity": "low" | "medium" | "high",
  "techDebtScore": <number 0-100>,
  "overallAssessment": "A 2-3 sentence summary of the PR quality and main concerns",
  "strengths": [
    "First positive aspect in detail",
    "Second positive aspect in detail",
    "Third positive aspect in detail"
  ],
  "issues": [
    {
      "severity": "high" | "medium" | "low",
      "category": "bug|security|performance|style|maintainability|testing",
      "title": "Short issue title",
      "description": "Detailed explanation of the issue",
      "location": "Affected file or component",
      "recommendation": "How to fix this issue"
    }
  ],
  "codeSmells": [
    "First code smell with explanation",
    "Second code smell with explanation"
  ],
  "securityConcerns": [
    "First security concern if any",
    "Second security concern if any"
  ],
  "performanceImpact": "Brief assessment of performance implications",
  "testCoverage": "Assessment of testing in this PR",
  "suggestions": [
    "Specific actionable improvement #1",
    "Specific actionable improvement #2",
    "Specific actionable improvement #3"
  ],
  "reviewerNotes": "Additional notes for reviewers"
}

Be thorough, specific, and constructive. If there are no issues in a category, provide an empty array or "No concerns" text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert code reviewer. Provide detailed, actionable feedback. Respond ONLY with valid JSON, no markdown formatting.' 
        },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 3000
    });

    const content = completion.choices[0]?.message?.content || '{}';
    let cleaned = content.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const analysis = JSON.parse(cleaned);

    console.log(`✅ Detailed Analysis Complete!`);
    console.log(`   📊 Quality Score: ${analysis.qualityScore}/100`);
    console.log(`   🔧 Complexity: ${analysis.complexity}`);
    console.log(`   ⚠️  Issues Found: ${analysis.issues?.length || 0}`);
    console.log(`   💡 Suggestions: ${analysis.suggestions?.length || 0}`);

    return {
      success: true,
      qualityScore: analysis.qualityScore,
      complexity: analysis.complexity,
      techDebtScore: analysis.techDebtScore,
      overallAssessment: analysis.overallAssessment,
      strengths: analysis.strengths || [],
      issues: analysis.issues || [],
      codeSmells: analysis.codeSmells || [],
      securityConcerns: analysis.securityConcerns || [],
      performanceImpact: analysis.performanceImpact || 'Not assessed',
      testCoverage: analysis.testCoverage || 'Not assessed',
      suggestions: analysis.suggestions || [],
      reviewerNotes: analysis.reviewerNotes || '',
      rawAnalysis: analysis
    };
  } catch (error: any) {
    console.error('❌ AI Analysis Error:', error.message);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}