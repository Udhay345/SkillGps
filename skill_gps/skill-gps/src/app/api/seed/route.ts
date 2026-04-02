import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { STUDENTS } from '@/lib/students';

export async function GET() {
    try {
        const studentsCol = collection(db, 'students');
        
        // Seed each student as a separate document
        for (const student of STUDENTS) {
            const studentRef = doc(studentsCol, student.id);
            await setDoc(studentRef, student);
            
            // Nested collections (tree structure) can be created here later if needed
            // e.g. const badgesCol = collection(studentRef, 'badges');
        }

        return NextResponse.json({ success: true, message: 'Students seeded to Firestore successfully.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
