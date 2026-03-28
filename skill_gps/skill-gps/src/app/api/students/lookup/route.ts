import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'backend', 'students.json');

// GET /api/students/lookup?email=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const students = JSON.parse(raw);
        const student = students.find((s: { email: string }) =>
            s.email.toLowerCase() === email.toLowerCase()
        );
        if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

        // Return only safe fields for onboarding verification
        return NextResponse.json({
            id: student.id,
            name: student.name,
            regNo: student.regNo,
            year: student.year,
            section: student.section,
            department: student.department,
            college: student.college,
        });
    } catch {
        return NextResponse.json({ error: 'Failed to lookup student' }, { status: 500 });
    }
}
