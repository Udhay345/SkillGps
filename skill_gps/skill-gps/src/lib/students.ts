// =============================================
// SKILL GPS — Central Dynamic Data Store
// Replace this with real DB/Auth calls later
// =============================================

export type Certificate = {
    id: string;
    title: string;
    description?: string;
    issuer: string;
    date: string;
    fileUrl: string;
    status: 'pending' | 'verified' | 'rejected';
    verifiedBy?: string;
    verifiedAt?: string;
};

export type Student = {
    id: string;
    name: string;
    email: string;
    regNo: string;
    college: string;
    department: string;
    year: number;
    semester: number;
    section: string;
    cgpa: number;
    careerTarget: string;
    careerProbability: number;
    joinedDate: string;
    attendance: number;
    projectsCompleted: number;
    internships: number;
    githubUsername: string;
    leetcodeUsername: string;
    skillrackUsername: string;
    leetcodeRank: number;
    leetcodeStreak: number;
    skillrackStreak: number;
    githubStreak: number;
    totalXP: number;
    level: number;
    badges: { title: string; color: string; date: string; desc: string }[];
    skillGaps: { skill: string; score: number; color: string }[];
    semesterGoals: { id: number; text: string; done: boolean }[];
    recentActivity: { type: string; title: string; date: string; icon: string }[];
    certificates: Certificate[];
};

export const STUDENTS: Student[] = [];

// Currently logged-in student (index 0, can be changed via admin)
export const CURRENT_STUDENT_ID = "STU001";

export function getStudent(id: string): Student | undefined {
    return STUDENTS.find(s => s.id === id);
}

export function getCurrentStudent(): Student {
    return STUDENTS.find(s => s.id === CURRENT_STUDENT_ID)!;
}
