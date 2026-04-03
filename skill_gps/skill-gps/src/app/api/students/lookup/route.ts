import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

// GET /api/students/lookup?email=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('email', '==', email.toLowerCase()), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const studentData = querySnapshot.docs[0].data();
        const studentId = querySnapshot.docs[0].id;

        // Return only safe fields for onboarding verification
        return NextResponse.json({
            id: studentId,
            name: studentData.name,
            regNo: studentData.regNo,
            year: studentData.year,
            section: studentData.section,
            department: studentData.department,
            college: studentData.college,
        });
    } catch (err: any) {
        console.error("Lookup student error:", err);
        return NextResponse.json({ error: 'Failed to lookup student', details: err.message }, { status: 500 });
    }
}
