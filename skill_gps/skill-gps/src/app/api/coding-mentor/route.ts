import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an expert AI Coding Mentor. Analyze the provided code or answer the coding question.

Return a valid JSON object with EXACTLY this structure (no extra text, no markdown):
{
  "feedback": "Detailed feedback about the code quality, logic, and correctness",
  "optimization": "A specific optimization suggestion with a brief code example if helpful",
  "timeComplexity": "e.g. O(n log n)",
  "spaceComplexity": "e.g. O(n)",
  "suggestedExercise": "Name of a related problem to practice next",
  "correctedCode": "The improved or corrected version of the code (if applicable, else empty string)"
}`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, language, question } = body;

        const userMessage = question
            ? `Coding question: ${question}`
            : `Please review this ${language || 'code'}:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``;

        const reply = await callGroq(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }], true);
        const parsed = JSON.parse(reply);
        return NextResponse.json(parsed);

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Coding mentor error:', msg);
        if (msg.startsWith('RATE_LIMIT')) {
            return NextResponse.json({ error: '⏳ AI is busy. Please wait a moment and try again.' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Failed to analyze code. Please try again.' }, { status: 500 });
    }
}
