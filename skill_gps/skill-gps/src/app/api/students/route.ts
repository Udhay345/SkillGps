import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the students database (in the backend folder alongside this project)
const DB_PATH = path.join(process.cwd(), '..', 'backend', 'students.json');

function readStudents() {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
}

function writeStudents(students: unknown[]) {
    fs.writeFileSync(DB_PATH, JSON.stringify(students, null, 2));
}

// GET /api/students?college=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const college = searchParams.get('college');
        let students = readStudents();
        if (college && college !== 'admin') {
            students = students.filter((s: { college: string }) =>
                s.college.toLowerCase().includes(college.toLowerCase())
            );
        }
        return NextResponse.json(students);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

// POST /api/students — add new student (admin)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const students = readStudents();
        const newStudent = {
            id: `STU${String(students.length + 1).padStart(3, '0')}`,
            ...body,
            careerProbability: body.careerProbability || 50,
            joinedDate: new Date().toISOString().split('T')[0],
            attendance: body.attendance || 80,
            leetcodeRank: body.leetcodeRank || 5000,
            leetcodeStreak: 0,
            skillrackStreak: 0,
            githubStreak: 0,
            totalXP: 100,
            level: 1,
            badges: [],
            skillGaps: body.skillGaps || [],
            semesterGoals: body.semesterGoals || [],
            recentActivity: [],
        };
        students.push(newStudent);
        writeStudents(students);
        return NextResponse.json(newStudent, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
    }
}
