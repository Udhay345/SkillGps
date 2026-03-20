import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// GET /api/students/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const response = await fetch(`${BACKEND_URL}/api/students/${id}`, {
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
}

// PUT /api/students/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const response = await fetch(`${BACKEND_URL}/api/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }
}

// DELETE /api/students/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await fetch(`${BACKEND_URL}/api/students/${id}`, {
            method: 'DELETE',
            signal: AbortSignal.timeout(10000)
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
