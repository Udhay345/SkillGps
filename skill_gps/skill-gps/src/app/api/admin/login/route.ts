import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// POST /api/admin/login
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(10000)
        });
        const data = await response.json();
        if (!response.ok) return NextResponse.json(data, { status: 401 });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
