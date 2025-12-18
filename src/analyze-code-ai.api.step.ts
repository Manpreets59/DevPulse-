import Groq from 'groq-sdk';

export const config = {
  name: 'analyze-code-ai',
  description: 'Analyze code quality using Groq AI',
  type: 'api' as const,
  method: 'POST',
  path: '/ai/analyze-code',
  emits: [],
};

export async function handler(input: any) {
  console.log('\n🤖 Running AI Analysis...');

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const fileSummary = input.files
    .slice(0, 15)
    .map((f: any) => `- ${f.filename}: +${f.additions} -${f.deletions}`)
    .join('\n');

  const prompt = `Analyze this PR:

Title: ${input.pr.title}
Description: ${input.pr.body}
Changes: ${input.pr.additions} additions, ${input.pr.deletions} deletions

Files:
${fileSummary}

Return ONLY valid JSON:
{
  "qualityScore": <0-100>,
  "complexity": "low"|"medium"|"high",
  "techDebtScore": <0-100>,
  "issues": [{"severity": "high|medium|low", "description": "..."}],
  "suggestions": ["..."],
  "summary": "assessment"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Respond ONLY with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const cleaned = content.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleaned);

    console.log(`✅ Quality Score: ${analysis.qualityScore}/100`);

    return {
      success: true,
      qualityScore: analysis.qualityScore,
      complexity: analysis.complexity,
      techDebtScore: analysis.techDebtScore,
      issues: analysis.issues || [],
      suggestions: analysis.suggestions || [],
      summary: analysis.summary || 'No summary'
    };
  } catch (error: any) {
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}