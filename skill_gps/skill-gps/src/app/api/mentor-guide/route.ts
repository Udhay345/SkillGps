import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const SYSTEM_PROMPT = `You are an AI Mentor Guide. Provide personalized counseling feedback and actionable tasks for a student.

RESPONSE FORMAT:
Provide the response ONLY as a valid JSON object with this exact structure:
{
  "mentorName": "AI Academic Mentor",
  "feedback": "You are doing great but need to focus on X.",
  "assignedTasks": [
    { "task": "Solve 5 problems on LeetCode", "status": "pending" },
    { "task": "Complete React Project", "status": "completed" }
  ],
  "nextMeeting": "Dec 1st, 2026"
}

Return ONLY the JSON object.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { studentId } = body;

        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: `Provide feedback for student ${studentId}` }],
                systemPrompt: SYSTEM_PROMPT,
                model: 'meta-llama/Meta-Llama-3-8B-Instruct',
                requestingStudentId: studentId
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
        console.error('Mentor guide error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
