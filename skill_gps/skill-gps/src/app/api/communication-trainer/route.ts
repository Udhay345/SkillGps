import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an AI Real-Time Communication Trainer for students preparing for placements.

Return a valid JSON object with EXACTLY this structure (no extra text, no markdown):
{
  "correctSentence": "Grammatically correct version of the input",
  "grammarMistakes": [
    { "error": "Description of the mistake", "explanation": "Simple explanation of the rule" }
  ],
  "vocabularyImprovement": [
    { "original": "word used", "better": "more professional word", "reason": "why it is better" }
  ],
  "fluencyFeedback": "How natural the sentence sounds and smoother alternatives",
  "pronunciationTips": [
    { "word": "word", "tip": "how to pronounce it correctly" }
  ],
  "scores": {
    "grammar": 75,
    "fluency": 70,
    "vocabulary": 65,
    "pronunciation": 80,
    "confidence": 72
  },
  "professionalVersion": "A more interview-ready version of the sentence",
  "practiceSuggestion": "One short speaking exercise to improve",
  "conversationalResponse": "A natural, supportive response to what the student said",
  "followUpQuestion": "One question to encourage the student to keep speaking"
}`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sentence } = body;

        if (!sentence || sentence.trim() === '') {
            return NextResponse.json({ error: 'No sentence provided' }, { status: 400 });
        }

        const reply = await callGroq(
            SYSTEM_PROMPT,
            [{ role: 'user', content: `Analyze this sentence: "${sentence}"` }],
            true
        );
        const parsed = JSON.parse(reply);
        return NextResponse.json(parsed);

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Communication trainer error:', msg);
        if (msg.startsWith('RATE_LIMIT')) {
            return NextResponse.json({ error: '⏳ AI is busy. Please wait a moment and try again.' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Failed to analyze sentence. Please try again.' }, { status: 500 });
    }
}
