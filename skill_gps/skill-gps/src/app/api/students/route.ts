import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// GET /api/students?college=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const collegeParam = searchParams.get('college');

        const studentsRef = collection(db, 'students');
        const querySnapshot = await getDocs(studentsRef);
        let students = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as any[];
        
        if (collegeParam && collegeParam.toLowerCase() !== 'admin') {
            const searchCol = collegeParam.trim().toLowerCase();
            students = students.filter(s => 
                s.college && s.college.trim().toLowerCase() === searchCol
            );
        }

        return NextResponse.json(students);
    } catch (err: any) {
        console.error("Fetch students error:", err);
        return NextResponse.json({ error: 'Failed to fetch students', details: err.message }, { status: 500 });
    }
}

// POST /api/students — add new student (admin)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const baseStudent = {
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
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'students'), baseStudent);
        
        return NextResponse.json({ id: docRef.id, ...baseStudent }, { status: 201 });
    } catch (err: any) {
        console.error("Add student error:", err);
        return NextResponse.json({ error: 'Failed to add student', details: err.message }, { status: 500 });
    }
}
