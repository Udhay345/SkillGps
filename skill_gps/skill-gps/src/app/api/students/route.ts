import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// GET /api/students - get all students (can filter by college)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const college = searchParams.get('college');
        const urlObj = new URL(`${BACKEND_URL}/api/students`);
        if (college) {
            urlObj.searchParams.set('college', college);
        }

        const response = await fetch(urlObj.toString(), {
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) throw new Error('Backend error');
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

// POST /api/students - add new student (admin)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await fetch(`${BACKEND_URL}/api/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) throw new Error('Backend error');
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
    }
}
