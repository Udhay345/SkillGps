// =============================================
// SKILL GPS — Central Dynamic Data Store
// Replace this with real DB/Auth calls later
// =============================================

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
};

export const STUDENTS: Student[] = [
    {
        id: "STU001",
        name: "Arjun Sharma",
        email: "arjun.sharma@srmist.edu.in",
        regNo: "RA2111003010001",
        college: "SRM Institute of Science and Technology",
        department: "Computer Science & Engineering",
        year: 3,
        semester: 5,
        section: "A",
        cgpa: 8.4,
        careerTarget: "AI Engineer",
        careerProbability: 48,
        joinedDate: "2022-08-01",
        attendance: 88,
        projectsCompleted: 3,
        internships: 1,
        githubUsername: "arjun-codes",
        leetcodeRank: 2450,
        leetcodeStreak: 14,
        skillrackStreak: 8,
        githubStreak: 30,
        totalXP: 2450,
        level: 12,
        badges: [
            { title: "Top 1% Solver", color: "#FFD700", date: "Jan 2025", desc: "Ranked in the top 1% of LeetCode solvers globally." },
            { title: "Master Builder", color: "#3B82F6", date: "Dec 2024", desc: "Completed 5+ full-stack projects on GitHub." },
            { title: "Open Source Contributor", color: "#39d353", date: "Nov 2024", desc: "Merged a PR into a public repository." },
            { title: "AI Enthusiast", color: "#A855F7", date: "Oct 2024", desc: "Completed an advanced AI certification." },
            { title: "Hackathon Finalist", color: "#FF8C00", date: "Sep 2024", desc: "Reached final round in SRM Hack 2024." },
        ],
        skillGaps: [
            { skill: "System Design (Microservices)", score: 42, color: "#A8C0FF" },
            { skill: "AWS Cloud Deployment", score: 55, color: "#A855F7" },
            { skill: "Advanced Dynamic Programming", score: 61, color: "#3B82F6" },
        ],
        semesterGoals: [
            { id: 1, text: "Finish AWS Cloud Practitioner Certification", done: false },
            { id: 2, text: "Solve 50 Medium LeetCode Questions", done: false },
            { id: 3, text: "Deploy Capstone Project to Vercel", done: true },
        ],
        recentActivity: [
            { type: "leetcode", title: "Solved 'Longest Substring Without Repeating Characters'", date: "2h ago", icon: "🔶" },
            { type: "github", title: "Pushed 3 commits to skill-gps repo", date: "5h ago", icon: "" },
            { type: "skillrack", title: "Completed 2 SkillRack challenges", date: "Yesterday", icon: "🟢" },
        ],
    },
    {
        id: "STU002",
        name: "Priya Nair",
        email: "priya.nair@vit.ac.in",
        regNo: "21BCE1234",
        college: "VIT University, Vellore",
        department: "Information Technology",
        year: 3,
        semester: 5,
        section: "B",
        cgpa: 9.1,
        careerTarget: "Full Stack Developer",
        careerProbability: 72,
        joinedDate: "2022-08-15",
        attendance: 93,
        projectsCompleted: 5,
        internships: 2,
        githubUsername: "priya-dev",
        leetcodeRank: 1200,
        leetcodeStreak: 22,
        skillrackStreak: 15,
        githubStreak: 45,
        totalXP: 4100,
        level: 18,
        badges: [
            { title: "Consistency Queen", color: "#FFD700", date: "Feb 2025", desc: "30-day streak on LeetCode." },
            { title: "Internship Ace", color: "#39d353", date: "Jan 2025", desc: "Secured 2 tech internships in Year 3." },
            { title: "Full Stack Pro", color: "#3B82F6", date: "Dec 2024", desc: "Deployed 5 full-stack applications to production." },
        ],
        skillGaps: [
            { skill: "Docker & Kubernetes", score: 38, color: "#A8C0FF" },
            { skill: "Redis & Caching", score: 51, color: "#A855F7" },
        ],
        semesterGoals: [
            { id: 1, text: "Complete React Native Course", done: true },
            { id: 2, text: "Deploy personal portfolio", done: true },
            { id: 3, text: "Contribute to open source project", done: false },
        ],
        recentActivity: [
            { type: "github", title: "Opened PR in react-query", date: "1h ago", icon: "" },
            { type: "leetcode", title: "Solved 'Two Sum' and 'Valid Parentheses'", date: "3h ago", icon: "🔶" },
        ],
    },
    {
        id: "STU003",
        name: "Karthik Rajan",
        email: "karthik.rajan@nittrichy.ac.in",
        regNo: "NIT21CS050",
        college: "NIT Trichy",
        department: "Computer Science & Engineering",
        year: 4,
        semester: 7,
        section: "A",
        cgpa: 7.8,
        careerTarget: "DevOps Engineer",
        careerProbability: 61,
        joinedDate: "2021-08-01",
        attendance: 82,
        projectsCompleted: 4,
        internships: 1,
        githubUsername: "karthik-ops",
        leetcodeRank: 3800,
        leetcodeStreak: 5,
        skillrackStreak: 3,
        githubStreak: 12,
        totalXP: 1800,
        level: 9,
        badges: [
            { title: "Docker Captain", color: "#00D4FF", date: "Mar 2025", desc: "Containerized 3 production applications." },
            { title: "CI/CD Builder", color: "#FF8C00", date: "Jan 2025", desc: "Set up GitHub Actions for 2 projects." },
        ],
        skillGaps: [
            { skill: "Kubernetes Advanced", score: 32, color: "#A8C0FF" },
            { skill: "Terraform & IaC", score: 27, color: "#A855F7" },
            { skill: "Monitoring (Grafana)", score: 44, color: "#3B82F6" },
        ],
        semesterGoals: [
            { id: 1, text: "Pass CKA Certification", done: false },
            { id: 2, text: "Internship at a Cloud company", done: true },
            { id: 3, text: "Setup home lab with Raspberry Pi", done: false },
        ],
        recentActivity: [
            { type: "github", title: "Updated Dockerfile for Node app", date: "3h ago", icon: "" },
            { type: "skillrack", title: "Completed Linux Admin challenge", date: "Yesterday", icon: "🟢" },
        ],
    },
    {
        id: "STU004",
        name: "Sneha Patel",
        email: "sneha.patel@bits-pilani.ac.in",
        regNo: "2021A7PS1234G",
        college: "BITS Pilani",
        department: "Electronics & Communication",
        year: 3,
        semester: 5,
        section: "C",
        cgpa: 8.9,
        careerTarget: "Data Scientist",
        careerProbability: 65,
        joinedDate: "2022-07-20",
        attendance: 91,
        projectsCompleted: 4,
        internships: 1,
        githubUsername: "sneha-data",
        leetcodeRank: 1850,
        leetcodeStreak: 18,
        skillrackStreak: 12,
        githubStreak: 22,
        totalXP: 3200,
        level: 15,
        badges: [
            { title: "Data Wizard", color: "#A855F7", date: "Feb 2025", desc: "Built 3 ML pipelines from scratch." },
            { title: "Kaggle Explorer", color: "#FFD700", date: "Dec 2024", desc: "Top 15% in a Kaggle competition." },
        ],
        skillGaps: [
            { skill: "Deep Learning (PyTorch)", score: 48, color: "#A8C0FF" },
            { skill: "MLOps & Model Deployment", score: 35, color: "#A855F7" },
        ],
        semesterGoals: [
            { id: 1, text: "Complete Deep Learning Specialization", done: false },
            { id: 2, text: "Publish a Kaggle notebook with 50+ votes", done: false },
        ],
        recentActivity: [
            { type: "leetcode", title: "Solved 3 Array problems", date: "4h ago", icon: "🔶" },
            { type: "github", title: "Pushed EDA notebook for housing dataset", date: "Yesterday", icon: "" },
        ],
    },
];

// Currently logged-in student (index 0, can be changed via admin)
export const CURRENT_STUDENT_ID = "STU001";

export function getStudent(id: string): Student | undefined {
    return STUDENTS.find(s => s.id === id);
}

export function getCurrentStudent(): Student {
    return STUDENTS.find(s => s.id === CURRENT_STUDENT_ID)!;
}
