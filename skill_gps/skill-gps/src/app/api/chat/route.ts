import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, studentId, requestingStudentId } = body;

        // Forward the request to our Node.js backend
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, studentId, requestingStudentId }),
            signal: AbortSignal.timeout(65000)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { reply: errData.reply || 'AI service is temporarily unavailable. Please try again.' },
                { status: 200 }
            );
        }

        const data = await response.json();
        return NextResponse.json({ reply: data.reply });

    } catch (error) {
        console.error('Chat proxy error:', error);
        return NextResponse.json(
            { reply: 'Sorry, I am having trouble connecting to the AI service. Please ensure the backend server is running.' },
            { status: 200 }
        );
    }
}
