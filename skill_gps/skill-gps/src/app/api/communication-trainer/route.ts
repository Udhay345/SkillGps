import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const SYSTEM_PROMPT = `You are an AI Real-Time Communication Trainer.
Your task is to analyze the student's spoken or written sentence and provide structured feedback while maintaining a conversational flow.

Provide the response ONLY as a valid JSON object with this exact structure:
{
  "correctSentence": "The sentence rewritten in grammatically correct and natural English",
  "grammarMistakes": [
    { "error": "description of mistake", "explanation": "simple explanation" }
  ],
  "vocabularyImprovement": [
    { "original": "word used", "better": "more professional word", "reason": "why it's better" }
  ],
  "fluencyFeedback": "Explanation of how natural it sounds and smoother alternatives",
  "pronunciationTips": [
    { "word": "word", "tip": "how to pronounce it" }
  ],
  "scores": {
    "grammar": 0,
    "fluency": 0,
    "vocabulary": 0,
    "pronunciation": 0,
    "confidence": 0
  },
  "professionalVersion": "More professional or interview-ready version",
  "practiceSuggestion": "One short speaking exercise",
  "conversationalResponse": "A natural, supportive response to what the student said",
  "followUpQuestion": "One question to encourage the student to keep speaking"
}

RULES:
- Keep all explanations simple (suitable for students).
- Be conversational and supportive.
- Return ONLY the JSON object, no markdown, no extra text.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sentence } = body;

        if (!sentence || sentence.trim() === '') {
            return NextResponse.json({ error: 'No sentence provided' }, { status: 400 });
        }

        const userMessage = `Input Sentence: "${sentence}"`;

        // Forward to backend LLM service (same as chat)
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'user', content: userMessage }
                ],
                systemPrompt: SYSTEM_PROMPT,
                model: 'mistralai/Mistral-7B-Instruct-v0.3'
            }),
            signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
        }

        const data = await response.json();
        const rawReply: string = data.reply || '';

        // Parse JSON out of the LLM response
        let parsed;
        try {
            // More robust JSON extraction: find first '{' and last '}'
            const start = rawReply.indexOf('{');
            const end = rawReply.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                const jsonContent = rawReply.substring(start, end + 1);
                parsed = JSON.parse(jsonContent);
            } else {
                throw new Error('No JSON object found');
            }
        } catch {
            // Fallback: return raw text so UI can show it
            return NextResponse.json({ rawReply }, { status: 200 });
        }

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('Communication trainer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
