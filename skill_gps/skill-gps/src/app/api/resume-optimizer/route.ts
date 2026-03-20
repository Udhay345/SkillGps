import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const SYSTEM_PROMPT = `You are an AI Resume Optimizer. Analyze the provided resume text and provide a score (0-100) and specific suggestions for improvement.
Focus on:
- Technical keywords for the target role
- Action verbs
- Quantifiable achievements
- Clear formatting

RESPONSE FORMAT:
Provide the response ONLY as a valid JSON object with this exact structure:
{
  "overall": 85,
  "atsScore": 80,
  "breakdown": [
    { "category": "Technical Skills", "score": 90 },
    { "category": "Experience", "score": 75 },
    { "category": "Education", "score": 95 },
    { "category": "Formatting", "score": 85 }
  ],
  "suggestions": [
    "Add more quantifiable results (e.g., 'Increased efficiency by 20%')",
    "Include keywords like 'PyTorch', 'Next.js', 'System Design'",
    "Use a more modern resume template"
  ],
  "rewrittenSummary": "Highly skilled AI engineer with experience in..."
}

Return ONLY the JSON object.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { resumeText } = body;

        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: `Analyze this resume: ${resumeText}` }],
                systemPrompt: SYSTEM_PROMPT,
                model: 'mistralai/Mistral-7B-Instruct-v0.3'
            }),
            signal: AbortSignal.timeout(45000)
        });

        if (!response.ok) return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });

        const data = await response.json();
        const rawReply = data.reply || '';

        try {
            const start = rawReply.indexOf('{');
            const end = rawReply.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                return NextResponse.json(JSON.parse(rawReply.substring(start, end + 1)));
            }
        } catch {
            return NextResponse.json({ rawReply }, { status: 200 });
        }
        return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });

    } catch (error) {
        console.error('Resume optimizer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
