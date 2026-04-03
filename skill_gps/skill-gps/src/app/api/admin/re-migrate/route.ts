import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        const DB_PATH = path.join(process.cwd(), '..', 'backend', 'students.json');
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const students = JSON.parse(raw);

        // 1. Clear existing students to ensure a clean state
        const querySnapshot = await getDocs(collection(db, 'students'));
        const deletePromises = querySnapshot.docs.map(stDoc => deleteDoc(doc(db, 'students', stDoc.id)));
        await Promise.all(deletePromises);

        console.log(`Migrating ${students.length} students...`);

        // 2. Migrate students
        for (const student of students) {
            const cleanedStudent = {
                ...student,
                name: student.name?.trim(),
                email: student.email?.trim(),
                college: student.college?.trim(),
                department: student.department?.trim()
            };
            const studentRef = doc(collection(db, 'students'), student.id);
            await setDoc(studentRef, cleanedStudent);
        }

        return NextResponse.json({ 
            success: true, 
            message: `Cleared old data and migrated ${students.length} students to Firestore.`,
            count: students.length
        });
    } catch (err: any) {
        return NextResponse.json({ error: 'Migration failed', details: err.message }, { status: 500 });
    }
}
