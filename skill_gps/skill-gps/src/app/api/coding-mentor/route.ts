import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const SYSTEM_PROMPT = `You are an AI Coding Mentor. Provide code reviews, explain concepts, and suggest optimizations.

RESPONSE FORMAT:
Provide the response ONLY as a valid JSON object with this exact structure:
{
  "feedback": "Your code is solid but...",
  "optimization": "Consider using a Map instead of an object for better performance...",
  "suggestedExercise": "Try implementing a Binary Search Tree."
}

Return ONLY the JSON object.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, language } = body;

        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: `Language: ${language}. Code: ${code}` }],
                systemPrompt: SYSTEM_PROMPT,
                model: 'codellama/CodeLlama-34b-Instruct-hf'
            }),
            signal: AbortSignal.timeout(60000)
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
        console.error('Coding mentor error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
