import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'backend', 'students.json');

function readStudents() {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
}

function writeStudents(students: unknown[]) {
    fs.writeFileSync(DB_PATH, JSON.stringify(students, null, 2));
}

// GET /api/students/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const students = readStudents();
        const student = students.find((s: { id: string }) => s.id === id);
        if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        return NextResponse.json(student);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
}

// PUT /api/students/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const students = readStudents();
        const idx = students.findIndex((s: { id: string }) => s.id === id);
        if (idx === -1) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        students[idx] = { ...students[idx], ...body };
        writeStudents(students);
        return NextResponse.json(students[idx]);
    } catch {
        return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }
}

// DELETE /api/students/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const students = readStudents();
        const idx = students.findIndex((s: { id: string }) => s.id === id);
        if (idx === -1) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        students.splice(idx, 1);
        writeStudents(students);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
    }
}
