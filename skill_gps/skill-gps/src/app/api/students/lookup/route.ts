import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// GET /api/students/lookup?email=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        const response = await fetch(`${BACKEND_URL}/api/students/lookup/email?email=${encodeURIComponent(email)}`, {
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to lookup student' }, { status: 500 });
    }
}
