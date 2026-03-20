"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { STUDENTS, type Student } from "@/lib/students";

type StudentContextType = {
    student: Student;
    setStudentById: (id: string) => void;
    allStudents: Student[];
    isLoading: boolean;
};

const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
    const [students, setStudents] = useState<Student[]>(STUDENTS); // fallback to local
    const [student, setStudent] = useState<Student>(STUDENTS[0]);
    const [isLoading, setIsLoading] = useState(true);

    // On mount — load students from backend, then set the logged-in one
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch("/api/students");
                if (res.ok) {
                    const data: Student[] = await res.json();
                    if (data && data.length > 0) {
                        setStudents(data);

                        // Check if we have a logged-in student from onboarding
                        const savedId = localStorage.getItem("skillgps_student_id");
                        if (savedId) {
                            const found = data.find(s => s.id === savedId);
                            if (found) {
                                setStudent(found);
                                setIsLoading(false);
                                return;
                            }
                        }
                        // Default to first student
                        setStudent(data[0]);
                    }
                }
            } catch {
                // Backend not available — fall back to local mock data
                console.warn("Backend not reachable, using local mock data.");
                const savedId = localStorage.getItem("skillgps_student_id");
                if (savedId) {
                    const found = STUDENTS.find(s => s.id === savedId);
                    if (found) setStudent(found);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const setStudentById = (id: string) => {
        const found = students.find(s => s.id === id);
        if (found) {
            setStudent(found);
            localStorage.setItem("skillgps_student_id", id);
        }
    };

    return (
        <StudentContext.Provider value={{ student, setStudentById, allStudents: students, isLoading }}>
            {children}
        </StudentContext.Provider>
    );
}

export function useStudent() {
    const ctx = useContext(StudentContext);
    if (!ctx) throw new Error("useStudent must be used within StudentProvider");
    return ctx;
}
