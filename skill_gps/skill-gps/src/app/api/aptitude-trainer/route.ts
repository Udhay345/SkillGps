import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const SYSTEM_PROMPT = `You are an AI Aptitude Trainer for IT placement exams.
Your task is to generate ONE high-quality multiple-choice question based on the provided parameters.

INPUT PARAMETERS:
- Topic (e.g., Percentages, Time & Work, Logical Reasoning, etc.)
- Difficulty (easy, medium, hard, or company-specific like TCS, Infosys, etc.)
- Student Score (to help adjust context if needed)

RESPONSE FORMAT:
Provide the response ONLY as a valid JSON object with this exact structure:
{
  "topic": "Topic Name",
  "difficulty": "Easy/Medium/Hard",
  "question": "The question text",
  "options": {
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text"
  },
  "correctAnswer": "A/B/C/D",
  "explanation": "Step-by-step logical explanation",
  "conceptTip": "A short shortcut or trick for this type of problem",
  "nextTopic": "Recommended topic to practice next"
}

Keep explanations clear and step-by-step. Ensure the question is relevant for IT company aptitude tests.
Return ONLY the JSON object, no markdown, no extra text.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { topic, difficulty, score } = body;

        const userMessage = `Generate a question for:
Topic: ${topic || 'Any'}
Difficulty: ${difficulty || 'Medium'}
Student Previous Score: ${score || 'N/A'}`;

        // Forward to backend LLM service
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'user', content: userMessage }
                ],
                systemPrompt: SYSTEM_PROMPT,
                model: 'microsoft/Phi-3-mini-4k-instruct'
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
            return NextResponse.json({ rawReply }, { status: 200 });
        }

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('Aptitude trainer error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
