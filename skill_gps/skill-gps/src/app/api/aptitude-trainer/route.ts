import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an AI Aptitude Trainer for IT placement exams. Generate ONE high-quality multiple-choice question.

Return a valid JSON object with EXACTLY this structure (no extra text, no markdown):
{
  "topic": "Topic Name",
  "difficulty": "Easy",
  "question": "The question text here",
  "options": { "A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D" },
  "correctAnswer": "A",
  "explanation": "Step-by-step explanation of why A is correct",
  "conceptTip": "A short trick or shortcut for this type of problem",
  "nextTopic": "Recommended next topic to practice"
}`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { topic, difficulty, score } = body;

        const userMessage = `Generate a ${difficulty || 'Medium'} difficulty aptitude question on the topic: "${topic || 'Percentages'}". Student's previous score: ${score || 'N/A'}.`;

        const reply = await callGroq(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }], true);
        const parsed = JSON.parse(reply);
        return NextResponse.json(parsed);

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Aptitude trainer error:', msg);
        if (msg.startsWith('RATE_LIMIT')) {
            return NextResponse.json({ error: '⏳ AI is busy. Please wait a moment and try again.' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Failed to generate question. Please try again.' }, { status: 500 });
    }
}
