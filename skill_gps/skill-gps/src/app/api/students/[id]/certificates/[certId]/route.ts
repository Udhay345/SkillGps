import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; certId: string } }
) {
  try {
    const { status } = await request.json();
    const studentId = params.id;
    const certId = params.certId;

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const studentRef = doc(db, "students", studentId);
    const snap = await getDoc(studentRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentData = snap.data();
    const certificates = studentData.certificates || [];
    
    const updatedCerts = certificates.map((cert: any) => {
      if (cert.id === certId) {
        return { 
            ...cert, 
            status,
            verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
            verifiedBy: status === 'verified' ? 'Admin' : undefined
        };
      }
      return cert;
    });

    await updateDoc(studentRef, { certificates: updatedCerts });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
