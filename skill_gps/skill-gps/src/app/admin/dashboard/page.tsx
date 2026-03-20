"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/assets/logo.png";
import {
    Users, TrendingUp, Award, Target, LogOut, ChevronRight,
    BookOpen, Zap, Activity, Search, Eye, BarChart2, Shield,
    Plus, Trash2, X, Check, AlertCircle, UserPlus
} from "lucide-react";

type Student = {
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
    attendance: number;
    projectsCompleted: number;
    internships: number;
    leetcodeStreak: number;
    skillGaps: { skill: string; score: number; color: string }[];
    badges: { title: string; color: string; date: string; desc: string }[];
};

const EMPTY_FORM = {
    name: "", email: "", regNo: "", college: "", department: "",
    year: 1, semester: 1, section: "A", cgpa: 0, careerTarget: "AI Engineer",
    attendance: 80, projectsCompleted: 0, internships: 0, githubUsername: "",
    leetcodeRank: 5000
};

export default function AdminDashboard() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState(EMPTY_FORM);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [adminCollege, setAdminCollege] = useState("");

    const fetchStudents = useCallback(async () => {
        try {
            const college = sessionStorage.getItem("adminCollege") || "";
            setAdminCollege(college);
            const res = await fetch(`/api/students?college=${encodeURIComponent(college)}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setStudents(data);
        } catch {
            setError("Could not load student data. Is the backend server running?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Auth check
        const token = sessionStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin");
            return;
        }
        fetchStudents();
    }, [fetchStudents, router]);

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminRole");
        router.push("/admin");
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError(""); setAddSuccess("");
        setAddLoading(true);
        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addForm)
            });
            if (!res.ok) throw new Error("Failed to add");
            const newStu = await res.json();
            setStudents(prev => [...prev, newStu]);
            setAddSuccess(`✅ ${newStu.name} added successfully! (ID: ${newStu.id})`);
            setAddForm(EMPTY_FORM);
            setTimeout(() => { setShowAddModal(false); setAddSuccess(""); }, 2500);
        } catch {
            setAddError("Failed to add student. Please check all fields and try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/students/${id}`, { method: "DELETE" });
            setStudents(prev => prev.filter(s => s.id !== id));
            setDeleteConfirm(null);
            if (selectedStudent?.id === id) setSelectedStudent(null);
        } catch {
            alert("Failed to delete student.");
        }
    };

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.college.toLowerCase().includes(search.toLowerCase()) ||
        s.careerTarget.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const avgCGPA = students.length ? (students.reduce((a, b) => a + b.cgpa, 0) / students.length).toFixed(2) : "0";
    const avgProb = students.length ? Math.round(students.reduce((a, b) => a + b.careerProbability, 0) / students.length) : 0;
    const totalProjects = students.reduce((a, b) => a + b.projectsCompleted, 0);
    const totalInternships = students.reduce((a, b) => a + b.internships, 0);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "var(--font-primary)" }}>
            {/* TOP NAV */}
            <header style={{
                background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)",
                padding: "0 40px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 50
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Image src={logo} alt="Skill GPS" width={36} height={36} style={{ borderRadius: 8 }} />
                    <div>
                        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 600 }}>Skill GPS</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Admin Dashboard</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {adminCollege && (
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", padding: "4px 12px", background: "rgba(59,130,246,0.1)", borderRadius: 100, border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", gap: 6 }}>
                            <Shield size={14} color="#3B82F6" /> {adminCollege}
                        </span>
                    )}
                    <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", background: "none", border: "1px solid var(--border-color)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: "0.9rem" }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <div style={{ display: "flex", minHeight: "calc(100vh - 72px)" }}>
                {/* SIDEBAR */}
                <aside style={{ width: 220, background: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                        { icon: <BarChart2 size={18} />, label: "Overview", active: true },
                        { icon: <Users size={18} />, label: "Students" },
                        { icon: <TrendingUp size={18} />, label: "Analytics" },
                        { icon: <Award size={18} />, label: "Badges & Quests" },
                        { icon: <Target size={18} />, label: "Roadmaps" },
                    ].map((item, i) => (
                        <button key={i} style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                            background: item.active ? "rgba(59,130,246,0.15)" : "transparent",
                            border: item.active ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                            borderRadius: 10, cursor: "pointer", color: item.active ? "#3B82F6" : "var(--text-secondary)",
                            fontSize: "0.9rem", fontWeight: item.active ? 500 : 400, textAlign: "left", transition: "all 0.2s"
                        }}>{item.icon} {item.label}</button>
                    ))}

                    <div style={{ flex: 1 }} />
                    <Link href="/dashboard" style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                        background: "rgba(57,211,83,0.1)", border: "1px solid rgba(57,211,83,0.2)",
                        borderRadius: 10, color: "#39d353", fontSize: "0.85rem", textDecoration: "none", fontWeight: 500
                    }}>
                        <ChevronRight size={16} /> Student View
                    </Link>
                </aside>

                {/* MAIN */}
                <main style={{ flex: 1, padding: 40, overflowY: "auto" }}>
                    {/* Page Title */}
                    <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 500, marginBottom: 6 }}>
                                Admin <span style={{ color: "#3B82F6" }}>Overview</span>
                            </h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Monitor all student activity, performance, and career trajectories.</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "12px 20px",
                                background: "linear-gradient(135deg, #3B82F6, #A855F7)", border: "none",
                                borderRadius: 12, color: "white", fontSize: "0.95rem", fontWeight: 600,
                                cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.3)"
                            }}
                        >
                            <UserPlus size={18} /> Add Student
                        </button>
                    </div>

                    {error && (
                        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 32, display: "flex", alignItems: "center", gap: 12, color: "#ef4444" }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {/* STAT CARDS */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 40 }}>
                        {[
                            { label: "Total Students", value: students.length, icon: <Users size={22} />, color: "#3B82F6" },
                            { label: "Avg CGPA", value: avgCGPA, icon: <BookOpen size={22} />, color: "#39d353" },
                            { label: "Avg Career Match", value: `${avgProb}%`, icon: <TrendingUp size={22} />, color: "#A855F7" },
                            { label: "Total Projects", value: totalProjects, icon: <Activity size={22} />, color: "#FFD700" },
                            { label: "Total Internships", value: totalInternships, icon: <Zap size={22} />, color: "#FF8C00" },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
                                borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12
                            }}>
                                <div style={{ color: stat.color, display: "flex", alignItems: "center", gap: 10 }}>
                                    {stat.icon}
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</span>
                                </div>
                                <div style={{ fontSize: "2rem", fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--text-primary)" }}>{loading ? "—" : stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* STUDENT TABLE */}
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 20, overflow: "hidden" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 500 }}>All Students ({filtered.length})</h2>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "8px 14px" }}>
                                <Search size={16} color="var(--text-muted)" />
                                <input
                                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search students..."
                                    style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "0.9rem", width: 200 }}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ padding: 60, textAlign: "center", color: "var(--text-secondary)" }}>
                                <div style={{ width: 32, height: 32, border: "2px solid var(--border-color)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                                Loading student data...
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "var(--bg-primary)" }}>
                                            {["Student", "College", "CGPA", "Career Target", "Match %", "Streak", "Actions"].map(h => (
                                                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((s, i) => (
                                            <tr key={s.id} style={{ borderTop: "1px solid var(--border-color)", transition: "background 0.2s" }}
                                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.03)")}
                                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                                <td style={{ padding: "16px 20px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${i * 70}, 60%, 35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "1rem", flexShrink: 0, color: "white" }}>
                                                            {s.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>{s.name}</div>
                                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{s.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px 20px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{s.college.split(" ").slice(0, 3).join(" ")}</td>
                                                <td style={{ padding: "16px 20px" }}>
                                                    <span style={{ fontWeight: 600, color: s.cgpa >= 8.5 ? "#39d353" : s.cgpa >= 7.5 ? "#FFD700" : "#FF8C00" }}>{s.cgpa}</span>
                                                </td>
                                                <td style={{ padding: "16px 20px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{s.careerTarget}</td>
                                                <td style={{ padding: "16px 20px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <div style={{ width: 60, height: 6, background: "var(--bg-primary)", borderRadius: 100, overflow: "hidden" }}>
                                                            <div style={{ width: `${s.careerProbability}%`, height: "100%", background: s.careerProbability >= 70 ? "#39d353" : s.careerProbability >= 50 ? "#FFD700" : "#FF8C00", borderRadius: 100 }} />
                                                        </div>
                                                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{s.careerProbability}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px 20px" }}>
                                                    <span style={{ fontSize: "0.85rem", color: "#FF8C00" }}>🔥 {s.leetcodeStreak}d</span>
                                                </td>
                                                <td style={{ padding: "16px 20px" }}>
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <button
                                                            onClick={() => setSelectedStudent(s)}
                                                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#3B82F6", fontSize: "0.8rem", cursor: "pointer", fontWeight: 500 }}>
                                                            <Eye size={14} /> View
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(s.id)}
                                                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#ef4444", fontSize: "0.8rem", cursor: "pointer", fontWeight: 500 }}>
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filtered.length === 0 && (
                                    <div style={{ padding: "48px", textAlign: "center", color: "var(--text-secondary)" }}>
                                        No students found matching &ldquo;{search}&rdquo;
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ===== VIEW STUDENT MODAL ===== */}
            {selectedStudent && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
                    onClick={() => setSelectedStudent(null)}>
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 40, width: 600, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", position: "relative" }}
                        onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedStudent(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>

                        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 700, color: "white" }}>
                                {selectedStudent.name.charAt(0)}
                            </div>
                            <div>
                                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: 4 }}>{selectedStudent.name}</h2>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{selectedStudent.email} · {selectedStudent.regNo}</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                            {[
                                { label: "College", value: selectedStudent.college },
                                { label: "Department", value: selectedStudent.department },
                                { label: "CGPA", value: selectedStudent.cgpa },
                                { label: "Attendance", value: `${selectedStudent.attendance}%` },
                                { label: "Career Target", value: selectedStudent.careerTarget },
                                { label: "Career Match", value: `${selectedStudent.careerProbability}%` },
                                { label: "Projects", value: selectedStudent.projectsCompleted },
                                { label: "Internships", value: selectedStudent.internships },
                            ].map((item, i) => (
                                <div key={i} style={{ background: "var(--bg-primary)", borderRadius: 12, padding: "14px 18px" }}>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>{String(item.value)}</div>
                                </div>
                            ))}
                        </div>

                        {selectedStudent.skillGaps?.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 14, color: "var(--text-secondary)" }}>Skill Gaps</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {selectedStudent.skillGaps.map((gap, i) => (
                                        <div key={i}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.9rem" }}>
                                                <span>{gap.skill}</span>
                                                <span style={{ color: gap.color, fontWeight: 600 }}>{gap.score}%</span>
                                            </div>
                                            <div style={{ height: 6, background: "var(--bg-primary)", borderRadius: 100, overflow: "hidden" }}>
                                                <div style={{ width: `${gap.score}%`, height: "100%", background: gap.color, borderRadius: 100 }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 24, textAlign: "center" }}>
                            <button
                                onClick={() => {
                                    localStorage.setItem("skillgps_student_id", selectedStudent.id);
                                    window.open('/dashboard', '_blank');
                                }}
                                style={{
                                    width: "100%", padding: "14px", background: "rgba(57,211,83,0.1)",
                                    border: "1px solid rgba(57,211,83,0.3)", borderRadius: 12, color: "#39d353",
                                    fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                }}
                            >
                                <Eye size={18} /> Simulate Student Dashboard
                            </button>
                            <p style={{ marginTop: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>This will open the student's dashboard in a new tab.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ADD STUDENT MODAL ===== */}
            {showAddModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", overflowY: "auto", padding: "20px" }}
                    onClick={() => setShowAddModal(false)}>
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 40, width: 640, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", position: "relative" }}
                        onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAddModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                            <X size={20} />
                        </button>

                        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", marginBottom: 8 }}>Add New Student</h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: "0.9rem" }}>Enter student details to register them in the Skill GPS database.</p>

                        {addError && (
                            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#ef4444", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 8 }}>
                                <AlertCircle size={14} /> {addError}
                            </div>
                        )}
                        {addSuccess && (
                            <div style={{ background: "rgba(57,211,83,0.08)", border: "1px solid rgba(57,211,83,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#39d353", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 8 }}>
                                <Check size={14} /> {addSuccess}
                            </div>
                        )}

                        <form onSubmit={handleAddStudent} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {[
                                { key: "name", label: "Full Name", type: "text", placeholder: "e.g., Arjun Sharma", span: 2 },
                                { key: "email", label: "College Email", type: "email", placeholder: "e.g., student@college.edu", span: 2 },
                                { key: "regNo", label: "Registration No.", type: "text", placeholder: "e.g., RA2111003010005" },
                                { key: "college", label: "College", type: "text", placeholder: "e.g., SRM Institute" },
                                { key: "department", label: "Department", type: "text", placeholder: "e.g., CSE" },
                                { key: "githubUsername", label: "GitHub Username", type: "text", placeholder: "e.g., student-dev" },
                                { key: "cgpa", label: "CGPA", type: "number", placeholder: "e.g., 8.5" },
                                { key: "attendance", label: "Attendance %", type: "number", placeholder: "e.g., 85" },
                                { key: "year", label: "Year", type: "number", placeholder: "1-4" },
                                { key: "semester", label: "Semester", type: "number", placeholder: "1-8" },
                                { key: "projectsCompleted", label: "Projects Done", type: "number", placeholder: "0" },
                                { key: "internships", label: "Internships", type: "number", placeholder: "0" },
                            ].map(field => (
                                <div key={field.key} style={{ gridColumn: field.span === 2 ? "1 / -1" : "auto" }}>
                                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 6, fontWeight: 500 }}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        step={field.type === "number" ? "0.1" : undefined}
                                        placeholder={field.placeholder}
                                        value={(addForm as Record<string, string | number>)[field.key] || ""}
                                        onChange={e => setAddForm(prev => ({ ...prev, [field.key]: field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
                                        required={["name", "email", "regNo", "college", "department"].includes(field.key)}
                                        style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 10, color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }}
                                    />
                                </div>
                            ))}

                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 6, fontWeight: 500 }}>Career Target</label>
                                <select
                                    value={addForm.careerTarget}
                                    onChange={e => setAddForm(prev => ({ ...prev, careerTarget: e.target.value }))}
                                    style={{ width: "100%", padding: "10px 14px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 10, color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }}
                                >
                                    {["AI Engineer", "Data Scientist", "Full Stack Developer", "Cloud Architect", "DevOps Engineer", "Cybersecurity Expert", "Product Manager", "Mobile Developer"].map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    style={{ flex: 1, padding: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 12, color: "var(--text-secondary)", cursor: "pointer", fontWeight: 500 }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={addLoading}
                                    style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #3B82F6, #A855F7)", border: "none", borderRadius: 12, color: "white", fontWeight: 600, cursor: addLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                    {addLoading ? "Adding..." : <><Plus size={16} /> Add Student</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== DELETE CONFIRM ===== */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
                    onClick={() => setDeleteConfirm(null)}>
                    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 20, padding: 32, width: 400, maxWidth: "90vw" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                            <Trash2 size={24} color="#ef4444" />
                        </div>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>Delete Student?</h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9rem" }}>
                            This will permanently remove the student record from the database. This action cannot be undone.
                        </p>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button onClick={() => setDeleteConfirm(null)}
                                style={{ flex: 1, padding: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 10, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500 }}>
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)}
                                style={{ flex: 1, padding: "12px", background: "#ef4444", border: "none", borderRadius: 10, color: "white", fontWeight: 600, cursor: "pointer" }}>
                                Delete Student
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
