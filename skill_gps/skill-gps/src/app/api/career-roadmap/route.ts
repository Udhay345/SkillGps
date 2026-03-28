import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an AI Career Roadmap Generator. Create a personalized step-by-step learning roadmap.

Return a valid JSON object with EXACTLY this structure (no extra text, no markdown):
{
  "targetRole": "Full Stack Engineer",
  "nodes": [
    { "id": 1, "title": "Foundation", "description": "HTML, CSS, JS basics", "status": "completed", "xp": 100, "resources": ["freeCodeCamp", "MDN Docs"] },
    { "id": 2, "title": "React Mastery", "description": "Hooks, Context, Next.js", "status": "active", "xp": 300, "resources": ["React Docs", "Next.js Docs"] },
    { "id": 3, "title": "Backend Essentials", "description": "Node, Express, Databases", "status": "locked", "xp": 400, "resources": ["Node.js Docs"] }
  ],
  "estimatedTime": "6 Months",
  "marketDemand": "High",
  "avgSalary": "₹8-15 LPA"
}`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentSkills, targetRole } = body;

        const userMessage = `Generate a career roadmap for someone with skills: "${currentSkills || 'beginner'}" targeting the role: "${targetRole || 'Software Engineer'}".`;

        const reply = await callGroq(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }], true);
        const parsed = JSON.parse(reply);
        return NextResponse.json(parsed);

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Career roadmap error:', msg);
        if (msg.startsWith('RATE_LIMIT')) {
            return NextResponse.json({ error: '⏳ AI is busy. Please wait a moment and try again.' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Failed to generate roadmap. Please try again.' }, { status: 500 });
    }
}
