import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET /api/students/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const studentRef = doc(db, 'students', id);
        const studentDoc = await getDoc(studentRef);

        if (!studentDoc.exists()) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        
        return NextResponse.json({ id: studentDoc.id, ...studentDoc.data() });
    } catch (err: any) {
        console.error("Fetch student error:", err);
        return NextResponse.json({ error: 'Failed to fetch student', details: err.message }, { status: 500 });
    }
}

// PUT /api/students/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const studentRef = doc(db, 'students', id);
        await updateDoc(studentRef, {
            ...body,
            updatedAt: new Date().toISOString()
        });
        
        const updatedDoc = await getDoc(studentRef);
        return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err: any) {
        console.error("Update student error:", err);
        return NextResponse.json({ error: 'Failed to update student', details: err.message }, { status: 500 });
    }
}

// DELETE /api/students/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const studentRef = doc(db, 'students', id);
        
        await deleteDoc(studentRef);
        
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Delete student error:", err);
        return NextResponse.json({ error: 'Failed to delete student', details: err.message }, { status: 500 });
    }
}
