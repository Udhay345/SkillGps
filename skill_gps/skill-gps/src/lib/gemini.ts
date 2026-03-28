/**
 * Groq AI Helper — used directly by all Next.js API routes.
 * Groq is free, very fast (~1s responses), and has generous rate limits.
 * Sign up at: https://console.groq.com/keys
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Best free models on Groq
const GROQ_MODEL_FAST = 'llama-3.3-70b-versatile';   // fast + smart, for chat/aptitude
const GROQ_MODEL_JSON = 'llama-3.3-70b-versatile';   // same model, JSON mode

export type GroqMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

/**
 * Call Groq API directly from any Next.js API route.
 * Groq is OpenAI-compatible so the API is straightforward.
 * 
 * @param systemPrompt  - Sets the AI's behaviour/persona
 * @param messages      - Conversation history (role: 'user' | 'assistant')
 * @param jsonMode      - If true, forces the response to be valid JSON
 */
export async function callGroq(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    jsonMode = false
): Promise<string> {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set. Get a free key at https://console.groq.com/keys');
    }

    const groqMessages: GroqMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content || ' ' })),
    ];

    const requestBody: Record<string, unknown> = {
        model: jsonMode ? GROQ_MODEL_JSON : GROQ_MODEL_FAST,
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
        ...(jsonMode && { response_format: { type: 'json_object' } }),
    };

    const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const code = response.status;
        const msg = errBody?.error?.message || 'Unknown Groq error';
        if (code === 429) throw new Error(`RATE_LIMIT: ${msg}`);
        throw new Error(`Groq API error ${code}: ${msg}`);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    return reply;
}
