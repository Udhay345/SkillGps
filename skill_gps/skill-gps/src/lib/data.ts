// Fake data for Skill GPS platform

export const sampleStudent = {
    id: "STU2024001",
    name: "Arjun Sharma",
    email: "arjun.sharma@srmist.edu.in",
    regNo: "RA2111003010001",
    photo: null,
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
};

export const colleges = [
    {
        country: "India",
        flag: "",
        institutions: [
            "SRM Institute of Science and Technology",
            "VIT University, Vellore",
            "NIT Trichy",
            "IIT Madras",
            "PSG College of Technology",
            "Amrita Vishwa Vidyapeetham",
            "Anna University",
            "Manipal Institute of Technology",
            "BITS Pilani",
            "Thapar Institute of Engineering",
        ],
    },
    {
        country: "United States",
        flag: "",
        institutions: [
            "MIT",
            "Stanford University",
            "Carnegie Mellon University",
            "UC Berkeley",
            "Georgia Tech",
        ],
    },
    {
        country: "United Kingdom",
        flag: "",
        institutions: [
            "University of Oxford",
            "University of Cambridge",
            "Imperial College London",
            "UCL",
            "University of Edinburgh",
        ],
    },
];

export const skillDNA = {
    dominant: "Technical Builder",
    traits: [
        { skill: "Analytical", value: 72, fullMark: 100 },
        { skill: "Technical", value: 85, fullMark: 100 },
        { skill: "Creative", value: 55, fullMark: 100 },
        { skill: "Leadership", value: 40, fullMark: 100 },
        { skill: "Communication", value: 60, fullMark: 100 },
        { skill: "Problem Solving", value: 78, fullMark: 100 },
    ],
    description:
        "You are a Technical Builder — someone who thrives on solving complex problems with code. Your analytical mind and strong technical foundation are your superpowers.",
};

export const skillGaps = [
    {
        id: 1,
        skill: "Probability & Statistics",
        impact: "High",
        impactColor: "#FF3B3B",
        icon: "",
        currentLevel: 25,
        requiredLevel: 75,
        careerImpact: "Essential for ML algorithms and data science roles",
        learningPath: [
            "Khan Academy Statistics (2 weeks)",
            "Coursera ML Math Specialization (4 weeks)",
            "Practice with NumPy/SciPy",
        ],
        estimatedTime: "6 weeks",
        resources: 12,
    },
    {
        id: 2,
        skill: "System Design",
        impact: "High",
        impactColor: "#FF3B3B",
        icon: "",
        currentLevel: 20,
        requiredLevel: 80,
        careerImpact: "Critical for senior AI Engineer interviews",
        learningPath: [
            "Grokking System Design (3 weeks)",
            "Build a scalable ML pipeline",
            "Mock interviews on Pramp",
        ],
        estimatedTime: "8 weeks",
        resources: 18,
    },
    {
        id: 3,
        skill: "SQL & Databases",
        impact: "Medium",
        impactColor: "#FF8C00",
        icon: "",
        currentLevel: 35,
        requiredLevel: 70,
        careerImpact: "Needed for data pipeline management",
        learningPath: [
            "Mode Analytics SQL Tutorial (1 week)",
            "LeetCode SQL problems (2 weeks)",
            "PostgreSQL hands-on project",
        ],
        estimatedTime: "4 weeks",
        resources: 9,
    },
    {
        id: 4,
        skill: "MLOps & Deployment",
        impact: "Medium",
        impactColor: "#FF8C00",
        icon: "",
        currentLevel: 15,
        requiredLevel: 65,
        careerImpact: "Required to deploy AI models to production",
        learningPath: [
            "Docker & Kubernetes basics",
            "FastAPI for model serving",
            "AWS SageMaker project",
        ],
        estimatedTime: "5 weeks",
        resources: 14,
    },
    {
        id: 5,
        skill: "Research Paper Reading",
        impact: "Low",
        impactColor: "#00D4FF",
        icon: "",
        currentLevel: 30,
        requiredLevel: 55,
        careerImpact: "Keeps you ahead with latest AI advancements",
        learningPath: [
            "Andrej Karpathy's guide on reading papers",
            "Summarize 2 papers/month",
            "Join AI reading groups",
        ],
        estimatedTime: "Ongoing",
        resources: 6,
    },
];

export const roadmapData = [
    {
        semester: "Semester 5 (Current)",
        status: "active",
        tasks: [
            { title: "Complete DSA Basics (Arrays, Trees, Graphs)", done: true, type: "skill" },
            { title: "Build 1 ML Project (House Price Prediction)", done: true, type: "project" },
            { title: "Python Advanced Concepts", done: false, type: "skill" },
            { title: "Start Statistics Course", done: false, type: "skill" },
        ],
        milestone: "Foundation Builder",
        xpGain: 350,
    },
    {
        semester: "Semester 6",
        status: "upcoming",
        tasks: [
            { title: "Deep Learning with PyTorch", done: false, type: "skill" },
            { title: "System Design Fundamentals", done: false, type: "skill" },
            { title: "Build NLP Project", done: false, type: "project" },
            { title: "Open Source Contribution", done: false, type: "achievement" },
        ],
        milestone: "Deep Diver",
        xpGain: 500,
    },
    {
        semester: "Semester 7 (Internship)",
        status: "locked",
        tasks: [
            { title: "Land AI/ML Internship", done: false, type: "achievement" },
            { title: "Real-world project experience", done: false, type: "project" },
            { title: "Networking & LinkedIn optimization", done: false, type: "skill" },
        ],
        milestone: "Industry Ready",
        xpGain: 800,
    },
    {
        semester: "Semester 8 (Placement)",
        status: "locked",
        tasks: [
            { title: "LeetCode 200+ problems", done: false, type: "skill" },
            { title: "Mock interviews (10+)", done: false, type: "achievement" },
            { title: "Portfolio website live", done: false, type: "project" },
            { title: "Target: AI Engineer at MNC", done: false, type: "achievement" },
        ],
        milestone: "Job Ready",
        xpGain: 1000,
    },
];

export const resumeScore = {
    overall: 62,
    breakdown: [
        { category: "Technical Skills", score: 75, max: 100, color: "#00D4FF" },
        { category: "Projects", score: 55, max: 100, color: "#0066FF" },
        { category: "Work Experience", score: 20, max: 100, color: "#FF6B00" },
        { category: "Education", score: 90, max: 100, color: "#00D4FF" },
        { category: "Certifications", score: 60, max: 100, color: "#FF8C00" },
        { category: "Soft Skills", score: 70, max: 100, color: "#0099FF" },
    ],
    suggestions: [
        "Add 2 more project descriptions with quantified impact",
        "Get an internship or freelance project before semester 7",
        "Add 3 more relevant certifications",
        "Improve GitHub repository documentation",
        "Add a strong professional summary",
    ],
    atsScore: 58,
};

export const careerSimulation = {
    baselineProbability: 48,
    currentRole: "AI Engineer",
    factors: [
        {
            id: "projects",
            label: "Projects Built",
            icon: "",
            current: 2,
            max: 8,
            impactPerUnit: 3,
            unit: "projects",
        },
        {
            id: "internship",
            label: "Internship Months",
            icon: "",
            current: 0,
            max: 12,
            impactPerUnit: 2.5,
            unit: "months",
        },
        {
            id: "dsa",
            label: "DSA Problems Solved",
            icon: "",
            current: 50,
            max: 300,
            impactPerUnit: 0.08,
            unit: "problems",
        },
        {
            id: "certifications",
            label: "Certifications",
            icon: "",
            current: 1,
            max: 6,
            impactPerUnit: 3,
            unit: "certs",
        },
        {
            id: "opensource",
            label: "Open Source Contributions",
            icon: "",
            current: 0,
            max: 10,
            impactPerUnit: 2,
            unit: "PRs",
        },
    ],
};

export const mentorMessages = [
    {
        id: 1,
        type: "mentor",
        message:
            "Hey Arjun!  I've analyzed your profile. Your Python skills are solid but your GitHub shows mostly beginner-level repos. Let's fix that!",
        time: "just now",
    },
    {
        id: 2,
        type: "mentor",
        message:
            "Your biggest career blocker right now is System Design knowledge. AI Engineers at top companies are expected to design scalable ML pipelines from day 1.",
        time: "just now",
    },
];

export const achievements = [
    { icon: "", title: "7-Day Streak", description: "Learning consistently", unlocked: true },
    { icon: "⭐", title: "First Project", description: "Built ML project", unlocked: true },
    { icon: "", title: "DSA Warrior", description: "Solved 50 problems", unlocked: true },
    { icon: "", title: "Internship Ready", description: "Complete 3 projects", unlocked: false },
    { icon: "", title: "AI Pioneer", description: "Reach 80% career ready", unlocked: false },
];

export const platformStats = [
    { label: "Students Enrolled", value: "42,800+", icon: "" },
    { label: "Institutions Partnered", value: "180+", icon: "" },
    { label: "Skills Mapped", value: "1,200+", icon: "" },
    { label: "Placements Tracked", value: "8,500+", icon: "" },
];
