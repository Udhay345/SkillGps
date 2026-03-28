import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an expert AI Resume Optimizer and ATS specialist for fresh engineering graduates.

Return a valid JSON object with EXACTLY this structure (no extra text, no markdown):
{
  "overall": 85,
  "atsScore": 80,
  "breakdown": [
    { "category": "Technical Skills", "score": 90 },
    { "category": "Experience & Projects", "score": 75 },
    { "category": "Education", "score": 95 },
    { "category": "Formatting & Clarity", "score": 85 },
    { "category": "Keywords & ATS", "score": 80 }
  ],
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3"
  ],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "rewrittenSummary": "A stronger, ATS-optimized professional summary paragraph"
}`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { resumeText, targetRole } = body;

        if (!resumeText || resumeText.trim().length < 50) {
            return NextResponse.json({ error: 'Please provide a resume with at least 50 characters.' }, { status: 400 });
        }

        const userMessage = `Analyze this resume for the role of "${targetRole || 'Software Engineer'}":\n\n${resumeText}`;

        const reply = await callGroq(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }], true);
        const parsed = JSON.parse(reply);
        return NextResponse.json(parsed);

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Resume optimizer error:', msg);
        if (msg.startsWith('RATE_LIMIT')) {
            return NextResponse.json({ error: '⏳ AI is busy. Please wait a moment and try again.' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Failed to analyze resume. Please try again.' }, { status: 500 });
    }
}
