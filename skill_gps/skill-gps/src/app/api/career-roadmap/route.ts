import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const SYSTEM_PROMPT = `You are an AI Career Roadmap Generator. Based on the student's current skills and target role, generate a step-by-step learning roadmap.

RESPONSE FORMAT:
Provide the response ONLY as a valid JSON object with this exact structure:
{
  "targetRole": "Full Stack Engineer",
  "nodes": [
    { "id": 1, "title": "Foundation", "description": "HTML, CSS, JS", "status": "completed", "xp": 100 },
    { "id": 2, "title": "React Mastery", "description": "Hooks, Context, Next.js", "status": "active", "xp": 300 },
    { "id": 3, "title": "Backend Essentials", "description": "Node, Express, DBs", "status": "locked", "xp": 400 }
  ],
  "estimatedTime": "6 Months",
  "marketDemand": "High"
}

Return ONLY the JSON object.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentSkills, targetRole } = body;

        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: `Current Skills: ${currentSkills}. Target Role: ${targetRole}.` }],
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
        console.error('Roadmap generator error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
