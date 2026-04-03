"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Student } from "@/lib/students";

// Blank student shape used as a safe initial value while Firebase loads
const BLANK_STUDENT: Student = {
    id: "", name: "Loading...", email: "", regNo: "", college: "", department: "",
    year: 1, semester: 1, section: "A", cgpa: 0,
    careerTarget: "", careerProbability: 50, joinedDate: "", attendance: 0,
    projectsCompleted: 0, internships: 0, githubUsername: "", 
    leetcodeUsername: "", skillrackUsername: "",
    leetcodeRank: 0,
    leetcodeStreak: 0, skillrackStreak: 0, githubStreak: 0, totalXP: 0, level: 1,
    badges: [], skillGaps: [], semesterGoals: [], recentActivity: [], certificates: [],
};

type StudentContextType = {
    student: Student;
    setStudent: (student: Student) => void;
    setStudentById: (id: string) => void;
    allStudents: Student[];
    isLoading: boolean;
};

const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
    const [students, setStudents] = useState<Student[]>([]);
    const [student, setStudent] = useState<Student>(BLANK_STUDENT);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribeAuth: () => void = () => {};
        let unsubscribeDB: () => void = () => {};

        const init = async () => {
            const { collection, doc, onSnapshot } = await import("firebase/firestore");
            const { onAuthStateChanged } = await import("firebase/auth");
            const { db, auth } = await import("@/lib/firebase");

            // Listen for auth state — get the currently signed-in user
            unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                if (!user) {
                    // No authenticated user — check localStorage fallback
                    const savedId = localStorage.getItem("skillgps_student_id");
                    if (savedId) {
                        // Fetch just that one document
                        const studentRef = doc(db, "students", savedId);
                        unsubscribeDB = onSnapshot(studentRef, (snap) => {
                            if (snap.exists()) {
                                const data = { ...(snap.data() as Student), id: snap.id };
                                setStudent(data);
                                setStudents([data]);
                            }
                            setIsLoading(false);
                        }, () => setIsLoading(false));
                    } else {
                        setIsLoading(false);
                    }
                    return;
                }

                // User is authenticated — fetch their document with their UID
                const studentRef = doc(db, "students", user.uid);
                unsubscribeDB = onSnapshot(studentRef, (snap) => {
                    if (snap.exists()) {
                        const data = { ...(snap.data() as Student), id: snap.id };
                        setStudent(data);
                        setStudents(prev => {
                            const exists = prev.find(s => s.id === data.id);
                            if (exists) return prev.map(s => s.id === data.id ? data : s);
                            return [...prev, data];
                        });
                        localStorage.setItem("skillgps_student_id", user.uid);
                    } else {
                        // UID doc not found — try email-based match in collection
                        const studentsCol = collection(db, "students");
                        onSnapshot(studentsCol, (colSnap) => {
                            const all = colSnap.docs.map(d => ({ ...(d.data() as Student), id: d.id }));
                            setStudents(all);
                            const found = all.find(s => s.email?.toLowerCase() === user.email?.toLowerCase());
                            if (found) {
                                setStudent(found);
                                localStorage.setItem("skillgps_student_id", found.id);
                            }
                            setIsLoading(false);
                        });
                        return;
                    }
                    setIsLoading(false);
                }, () => setIsLoading(false));
            });
        };

        init().catch(() => setIsLoading(false));

        return () => {
            unsubscribeAuth();
            unsubscribeDB();
        };
    }, []);

    const setStudentById = (id: string) => {
        const found = students.find(s => s.id === id);
        if (found) {
            setStudent(found);
            localStorage.setItem("skillgps_student_id", id);
        }
    };

    return (
        <StudentContext.Provider value={{ student, setStudent, setStudentById, allStudents: students, isLoading }}>
            {children}
        </StudentContext.Provider>
    );
}

export function useStudent() {
    const ctx = useContext(StudentContext);
    if (!ctx) throw new Error("useStudent must be used within StudentProvider");
    return ctx;
}
