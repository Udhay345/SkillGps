"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { CheckCircle, Loader2, User, Building2, Mail, BookOpen, Code2, Target, Calendar } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type Step = "name" | "college" | "email" | "dept" | "coding" | "interests" | "goals" | "success";

const STEPS: Step[] = ["name", "college", "email", "dept", "coding", "interests", "goals", "success"];

const STEP_META: Record<Step, { icon: React.ReactNode; title: string; subtitle: string }> = {
    name: { icon: <User size={20} />, title: "What's your name?", subtitle: "Let's start with the basics" },
    college: { icon: <Building2 size={20} />, title: "Your Institution", subtitle: "Select your college" },
    email: { icon: <Mail size={20} />, title: "College Email", subtitle: "Verify your student identity" },
    dept: { icon: <BookOpen size={20} />, title: "Academic Details", subtitle: "Tell us about your studies" },
    coding: { icon: <Code2 size={20} />, title: "Coding Profiles", subtitle: "Connect your coding platforms" },
    interests: { icon: <Target size={20} />, title: "Career Interests", subtitle: "Where do you want to go?" },
    goals: { icon: <Calendar size={20} />, title: "Semester Goals", subtitle: "What do you want to achieve this sem?" },
    success: { icon: <CheckCircle size={20} />, title: "You're in!", subtitle: "GPS Activated 🚀" },
};

const COLLEGES = [
    "Rajalakshmi Institute of Technology",
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
    "MIT",
    "Stanford University",
    "Carnegie Mellon University",
    "UC Berkeley",
    "Georgia Tech",
    "University of Oxford",
    "University of Cambridge",
    "Imperial College London",
    "UCL",
    "University of Edinburgh",
];

const DEPARTMENTS = [
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication Engineering",
    "Electrical & Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Artificial Intelligence & Data Science",
    "Cyber Security",
    "Robotics & Automation",
    "Biomedical Engineering",
];

const CAREER_GOALS = [
    "AI Engineer", "Data Scientist", "Full Stack Developer",
    "Cloud Architect", "Cybersecurity Expert", "Product Manager",
    "DevOps Engineer", "Mobile Developer", "Blockchain Developer",
    "UX/UI Designer",
];

const COLLEGE_EMAIL_DOMAINS: Record<string, string> = {
    "Rajalakshmi Institute of Technology": "@ritchennai.edu.in",
    "SRM Institute of Science and Technology": "@srmist.edu.in",
    "VIT University, Vellore": "@vit.ac.in",
    "NIT Trichy": "@nitt.edu",
    "IIT Madras": "@iitm.ac.in",
    "PSG College of Technology": "@psgtech.ac.in",
    "BITS Pilani": "@pilani.bits-pilani.ac.in",
};

// ─── Component ────────────────────────────────────────────────────────
export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("name");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [collegeSearch, setCollegeSearch] = useState("");

    // Form state — all fields
    const [form, setForm] = useState({
        name: "",
        college: "",
        email: "",
        password: "",    // for Firebase Auth
        department: "",
        year: "",
        semester: "",
        section: "",
        regNo: "",
        cgpa: "",
        githubUsername: "",
        leetcodeUsername: "",
        skillrackUsername: "",
        careerTarget: "AI Engineer",
        interests: [] as string[],
        semesterGoals: [""] as string[],
    });

    const stepIdx = STEPS.indexOf(step);
    const progress = ((stepIdx + 1) / STEPS.length) * 100;

    const filteredColleges = COLLEGES.filter(c =>
        c.toLowerCase().includes(collegeSearch.toLowerCase())
    );

    const emailHint = COLLEGE_EMAIL_DOMAINS[form.college] || "@college.edu.in";

    const set = (key: string, val: unknown) => {
        setForm(prev => ({ ...prev, [key]: val }));
        setError("");
    };

    const toggleInterest = (goal: string) => {
        setForm(prev => ({
            ...prev,
            interests: prev.interests.includes(goal)
                ? prev.interests.filter(g => g !== goal)
                : [...prev.interests, goal],
        }));
    };

    const addGoal = () => setForm(prev => ({ ...prev, semesterGoals: [...prev.semesterGoals, ""] }));
    const setGoal = (i: number, val: string) => {
        const updated = [...form.semesterGoals];
        updated[i] = val;
        setForm(prev => ({ ...prev, semesterGoals: updated }));
    };
    const removeGoal = (i: number) => {
        setForm(prev => ({ ...prev, semesterGoals: prev.semesterGoals.filter((_, idx) => idx !== i) }));
    };

    // ─── Validation ───────────────────────────────────────────────────
    const validateAndNext = () => {
        setError("");
        if (step === "name") {
            if (!form.name.trim() || form.name.trim().split(" ").length < 2) {
                setError("Please enter your full name (first and last)");
                return;
            }
        }
        if (step === "college") {
            if (!form.college) { setError("Please select your college"); return; }
        }
        if (step === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email.trim())) { 
                setError("Please enter a valid academic email address (e.g., name@college.edu.in)"); 
                return; 
            }
            if (!form.password || form.password.trim().length < 6) { 
                setError("Password must be at least 6 characters"); 
                return; 
            }
        }
        if (step === "dept") {
            if (!form.department) { setError("Please select your department"); return; }
            if (!form.year) { setError("Please select your year"); return; }
            if (!form.semester) { setError("Please select your semester"); return; }
        }
        if (step === "interests") {
            if (form.interests.length === 0) { setError("Pick at least one career interest"); return; }
        }
        if (step === "goals") {
            const filled = form.semesterGoals.filter(g => g.trim());
            if (filled.length === 0) { setError("Add at least one semester goal"); return; }
            // Final step — save to Firebase
            handleSubmit(filled);
            return;
        }
        const nextStep = STEPS[stepIdx + 1];
        if (nextStep) setStep(nextStep);
    };

    // ─── Firebase Submit ──────────────────────────────────────────────
    const handleSubmit = async (filledGoals: string[]) => {
        setSaving(true);
        setError("");
        try {
            const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
            const { doc, setDoc } = await import("firebase/firestore");
            const { auth, db } = await import("@/lib/firebase");

            // 1. Create Firebase Auth user
            const finalEmail = form.email.trim();
            const finalPass = form.password.trim();
            
            const userCred = await createUserWithEmailAndPassword(auth, finalEmail, finalPass);
            await updateProfile(userCred.user, { displayName: form.name.trim() });

            const uid = userCred.user.uid;
            const now = new Date().toISOString().split("T")[0];

            // 2. Build student document
            const studentDoc = {
                uid,
                name: form.name.trim(),
                email: finalEmail,
                college: form.college,
                department: form.department,
                year: parseInt(form.year) || 1,
                semester: parseInt(form.semester) || 1,
                section: form.section || "A",
                regNo: form.regNo.trim() || "",
                cgpa: parseFloat(form.cgpa) || 0,
                githubUsername: form.githubUsername.trim(),
                leetcodeUsername: form.leetcodeUsername.trim(),
                skillrackUsername: form.skillrackUsername.trim(),
                careerTarget: form.careerTarget,
                interests: form.interests,
                joinedDate: now,
                // defaults
                attendance: 0,
                projectsCompleted: 0,
                internships: 0,
                leetcodeRank: 0,
                leetcodeStreak: 0,
                skillrackStreak: 0,
                githubStreak: 0,
                totalXP: 100,
                level: 1,
                careerProbability: 50,
                badges: [],
                skillGaps: [],
                semesterGoals: filledGoals.filter(g => g.trim()).map((text, i) => ({
                    id: i + 1,
                    text,
                    done: false,
                })),
                recentActivity: [],
            };

            // 3. Store as student document with UID as the doc ID
            await setDoc(doc(db, "students", uid), studentDoc);

            // 4. Store UID in localStorage so StudentContext can pick it up
            localStorage.setItem("skillgps_student_id", uid);

            setStep("success");
            setTimeout(() => router.push("/dashboard"), 3000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            if (msg.includes("email-already-in-use")) {
                setError("This email is already registered. Please sign in instead.");
            } else if (msg.includes("permission-denied")) {
                setError("Database permission error. Check Firebase Firestore rules.");
            } else {
                setError(msg);
            }
        } finally {
            setSaving(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--black-secondary)",
                display: "flex",
                fontFamily: "var(--font-body)",
                overflow: "hidden",
            }}
            className="grid-bg"
        >
            {/* ===== LEFT PANEL ===== */}
            <div
                style={{
                    width: "38%",
                    background: "linear-gradient(135deg, #00D4FF08, #0066FF08)",
                    borderRight: "1px solid var(--black-border)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "60px 40px",
                    position: "relative",
                }}
                className="hide-mobile"
            >
                <div style={{ position: "absolute", top: "30%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent)", pointerEvents: "none" }} />

                {/* Logo */}
                <div style={{ position: "absolute", top: 32, left: 32 }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <Image src={logo} alt="Skill GPS Logo" width={32} height={32} style={{ borderRadius: 8 }} />
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "white" }}>
                            Skill<span style={{ color: "var(--cyan-primary)" }}>GPS</span>
                        </span>
                    </Link>
                </div>

                {/* Central branding */}
                <div style={{ textAlign: "center", marginBottom: 40, position: "relative", zIndex: 2 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,102,255,0.15))", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", backdropFilter: "blur(8px)" }}>
                        <Image src={logo} alt="Skill GPS" width={48} height={48} style={{ borderRadius: 10 }} />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", marginBottom: 8 }}>
                        Welcome to <span style={{ color: "var(--cyan-primary)" }}>Skill GPS</span>
                    </h2>
                    <p style={{ color: "var(--white-muted)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 280 }}>
                        Your AI-powered career navigation platform built for students.
                    </p>
                </div>

                {/* Step progress dots */}
                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
                    {STEPS.filter(s => s !== "success").map((s, i) => (
                        <div
                            key={s}
                            style={{
                                height: 4,
                                width: i < stepIdx ? 28 : 14,
                                borderRadius: 2,
                                background: i < stepIdx ? "var(--cyan-primary)" : i === stepIdx ? "rgba(0,212,255,0.5)" : "var(--black-border)",
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>
                <p style={{ color: "var(--white-muted)", fontSize: "0.82rem", marginBottom: 40 }}>
                    Step {Math.min(stepIdx + 1, STEPS.length - 1)} of {STEPS.length - 1}
                </p>

                {/* Steps checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 2, width: "100%", maxWidth: 280 }}>
                    {(["name", "college", "email", "dept", "coding", "interests", "goals"] as Step[]).map((s, i) => {
                        const meta = STEP_META[s];
                        const done = stepIdx > i;
                        const active = stepIdx === i;
                        return (
                            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, opacity: done || active ? 1 : 0.4 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    background: done ? "rgba(0,212,255,0.2)" : active ? "rgba(0,212,255,0.1)" : "transparent",
                                    border: `1px solid ${done ? "var(--cyan-primary)" : active ? "rgba(0,212,255,0.5)" : "var(--black-border)"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: done ? "var(--cyan-primary)" : active ? "rgba(0,212,255,0.8)" : "var(--white-muted)",
                                    flexShrink: 0, transition: "all 0.3s",
                                }}>
                                    {done ? <CheckCircle size={14} /> : <span style={{ fontSize: "0.7rem" }}>{meta.icon}</span>}
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.82rem", fontWeight: active ? 600 : 400, color: done ? "white" : active ? "white" : "var(--white-muted)" }}>{meta.title}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ===== RIGHT PANEL ===== */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "60px 5%",
                    overflowY: "auto",
                    maxHeight: "100vh",
                }}
            >
                {/* Progress bar */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.8rem", color: "var(--white-muted)" }}>
                        <span>Getting started</span>
                        <span style={{ color: "var(--cyan-primary)" }}>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill-cyan" style={{ width: `${progress}%`, transition: "width 0.5s ease" }} />
                    </div>
                </div>

                <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>

                    {/* ── STEP: NAME ── */}
                    {step === "name" && (
                        <div style={{ animation: "slideInUp 0.4s ease" }}>
                            <StepHeader meta={STEP_META.name} />
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="e.g. Rahul Kumar"
                                    value={form.name}
                                    onChange={e => set("name", e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && validateAndNext()}
                                    autoFocus
                                    style={{ width: "100%" }}
                                />
                            </div>
                            {error && <ErrorMsg msg={error} />}
                            <NextBtn onClick={validateAndNext} />
                        </div>
                    )}

                    {/* ── STEP: COLLEGE ── */}
                    {step === "college" && (
                        <div style={{ animation: "slideInUp 0.4s ease" }}>
                            <BackBtn onClick={() => setStep("name")} />
                            <StepHeader meta={STEP_META.college} />
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Search your college</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="🔍 Type to search..."
                                    value={collegeSearch}
                                    onChange={e => setCollegeSearch(e.target.value)}
                                    style={{ width: "100%", marginBottom: 12 }}
                                />
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
                                    {filteredColleges.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => { set("college", c); setStep("email"); }}
                                            style={{
                                                padding: "14px 18px", borderRadius: 10,
                                                border: `1px solid ${form.college === c ? "var(--cyan-primary)" : "var(--black-border)"}`,
                                                background: form.college === c ? "rgba(0,212,255,0.1)" : "var(--black-card)",
                                                cursor: "pointer", textAlign: "left", color: "white",
                                                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between",
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan-primary)"; e.currentTarget.style.background = "rgba(0,212,255,0.05)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = form.college === c ? "var(--cyan-primary)" : "var(--black-border)"; e.currentTarget.style.background = form.college === c ? "rgba(0,212,255,0.1)" : "var(--black-card)"; }}
                                        >
                                            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>🏛️ {c}</span>
                                            <span style={{ color: "var(--white-muted)", fontSize: "0.8rem" }}>→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {error && <ErrorMsg msg={error} />}
                        </div>
                    )}

                    {/* ── STEP: EMAIL ── */}
                    {step === "email" && (
                        <div style={{ animation: "slideInUp 0.4s ease" }}>
                            <BackBtn onClick={() => setStep("college")} />
                            <StepHeader meta={STEP_META.email} />
                            <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: "0.82rem", color: "var(--cyan-primary)" }}>
                                📧 Your email should end with <strong>{emailHint}</strong>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>College Email ID</label>
                                <input
                                    className="input-field"
                                    type="email"
                                    placeholder={`yourname${emailHint}`}
                                    value={form.email}
                                    onChange={e => set("email", e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Create Password <span style={{ color: "var(--white-subtle)", fontWeight: 400 }}>(min 6 characters)</span></label>
                                <input
                                    className="input-field"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => set("password", e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            {error && <ErrorMsg msg={error} />}
                            <NextBtn onClick={validateAndNext} />
                        </div>
                    )}

                    {/* ── STEP: DEPT ── */}
                    {step === "dept" && (
                        <div style={{ animation: "slideInUp 0.4s ease" }}>
                            <BackBtn onClick={() => setStep("email")} />
                            <StepHeader meta={STEP_META.dept} />
                            <div style={{ marginBottom: 14 }}>
                                <label style={labelStyle}>Department</label>
                                <select className="input-field" value={form.department} onChange={e => set("department", e.target.value)} style={{ width: "100%", cursor: "pointer" }}>
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                                <div>
                                    <label style={labelStyle}>Year</label>
                                    <select className="input-field" value={form.year} onChange={e => set("year", e.target.value)} style={{ width: "100%" }}>
                                        <option value="">Year</option>
                                        {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}st/nd/rd/th</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Semester</label>
                                    <select className="input-field" value={form.semester} onChange={e => set("semester", e.target.value)} style={{ width: "100%" }}>
                                        <option value="">Sem</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Section</label>
                                    <input className="input-field" type="text" placeholder="A / B..." value={form.section} onChange={e => set("section", e.target.value.toUpperCase())} style={{ width: "100%" }} maxLength={2} />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                                <div>
                                    <label style={labelStyle}>Register Number <OptLabel /></label>
                                    <input className="input-field" type="text" placeholder="e.g. 20BCE001" value={form.regNo} onChange={e => set("regNo", e.target.value)} style={{ width: "100%" }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>CGPA <OptLabel /></label>
                                    <input className="input-field" type="number" step="0.1" min="0" max="10" placeholder="e.g. 8.5" value={form.cgpa} onChange={e => set("cgpa", e.target.value)} style={{ width: "100%" }} />
                                </div>
                            </div>
                            {error && <ErrorMsg msg={error} />}
                            <NextBtn onClick={validateAndNext} />
                        </div>
                    )}

                    {/* ── STEP: CODING ── */}
                    {step === "coding" && (
                        <div style={{ animation: "slideInUp 0.4s ease" }}>
                            <BackBtn onClick={() => setStep("dept")} />
                            <StepHeader meta={STEP_META.coding} />
                            <p style={{ color: "var(--white-muted)", fontSize: "0.85rem", marginBottom: 24 }}>All profiles are optional — add what you have.</p>
                            {[
                                { key: "githubUsername", label: "GitHub Username", placeholder: "your-github-username", icon: "🐙" },
                                { key: "leetcodeUsername", label: "LeetCode Username", placeholder: "your-leetcode-id", icon: "🔶" },
                                { key: "skillrackUsername", label: "SkillRack Username", placeholder: "skillrack-id", icon: "🟢" },
                            ].map(({ key, label, placeholder, icon }) => (
                                <div key={key} style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>{icon} {label} <OptLabel /></label>
                                    <input
                                        className="input-field"
                                        type="text"
                                        placeholder={placeholder}
                                        value={(form as any)[key]}
                                        onChange={e => set(key, e.target.value)}
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            ))}
                            {error && <ErrorMsg msg={error} />}
                            <NextBtn onClick={() => { setError(""); setStep("interests"); }} label="Continue →" />
                        </div>
                    )}

                    {/* ── STEP: INTERESTS ── */}
                    {step === "interests" && (
                        <div style={{ animation: "slideInUp 0.4s ease" }}>
                            <BackBtn onClick={() => setStep("coding")} />
                            <StepHeader meta={STEP_META.interests} />
                            <p style={{ color: "var(--white-muted)", fontSize: "0.85rem", marginBottom: 20 }}>Pick your target career goals. You can choose multiple.</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                                {CAREER_GOALS.map(goal => (
                                    <button
                                        key={goal}
                                        onClick={() => toggleInterest(goal)}
                                        style={{
                                            padding: "10px 18px", borderRadius: 100,
                                            border: `1px solid ${form.interests.includes(goal) ? "var(--cyan-primary)" : "var(--black-border)"}`,
                                            background: form.interests.includes(goal) ? "rgba(0,212,255,0.12)" : "var(--black-card)",
                                            color: form.interests.includes(goal) ? "var(--cyan-primary)" : "var(--white-muted)",
                                            cursor: "pointer", fontSize: "0.88rem", fontWeight: 500, transition: "all 0.2s",
                                        }}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                            {/* Primary career target */}
                            {form.interests.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <label style={labelStyle}>Primary Career Target</label>
                                    <select className="input-field" value={form.careerTarget} onChange={e => set("careerTarget", e.target.value)} style={{ width: "100%" }}>
                                        {form.interests.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            )}
                            {error && <ErrorMsg msg={error} />}
                            <NextBtn onClick={validateAndNext} />
                        </div>
                    )}

                    {/* ── STEP: GOALS ── */}
                    {step === "goals" && (
                        <div style={{ animation: "slideInUp 0.4s ease" }}>
                            <BackBtn onClick={() => setStep("interests")} />
                            <StepHeader meta={STEP_META.goals} />
                            <p style={{ color: "var(--white-muted)", fontSize: "0.85rem", marginBottom: 20 }}>
                                What do you want to achieve this semester? Add 1–5 goals.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                                {form.semesterGoals.map((goal, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <input
                                            className="input-field"
                                            type="text"
                                            placeholder={`Goal ${i + 1}...`}
                                            value={goal}
                                            onChange={e => setGoal(i, e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        {form.semesterGoals.length > 1 && (
                                            <button
                                                onClick={() => removeGoal(i)}
                                                style={{ background: "none", border: "1px solid var(--black-border)", color: "var(--white-muted)", cursor: "pointer", borderRadius: 8, padding: "10px 12px", fontSize: "0.9rem" }}
                                            >✕</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {form.semesterGoals.length < 5 && (
                                <button
                                    onClick={addGoal}
                                    style={{ background: "none", border: "1px dashed var(--black-border)", color: "var(--white-muted)", cursor: "pointer", borderRadius: 10, padding: "12px", width: "100%", fontSize: "0.88rem", marginBottom: 24, transition: "all 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--cyan-primary)"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--black-border)"}
                                >
                                    + Add another goal
                                </button>
                            )}
                            {error && <ErrorMsg msg={error} />}
                            <button
                                className="btn-primary"
                                style={{ width: "100%", padding: "16px", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                                onClick={() => validateAndNext()}
                                disabled={saving}
                            >
                                {saving ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Creating your profile...</> : "🚀 Activate My Career GPS"}
                            </button>
                            <p style={{ color: "var(--white-subtle)", fontSize: "0.78rem", textAlign: "center", marginTop: 12 }}>
                                Already have an account? <Link href="/signin" style={{ color: "var(--cyan-primary)", textDecoration: "none" }}>Sign in →</Link>
                            </p>
                        </div>
                    )}

                    {/* ── STEP: SUCCESS ── */}
                    {step === "success" && (
                        <div style={{ textAlign: "center", animation: "slideInUp 0.4s ease" }}>
                            <div style={{ width: 88, height: 88, borderRadius: 22, background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,102,255,0.2))", border: "1px solid rgba(0,212,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
                                <Image src={logo} alt="Skill GPS" width={52} height={52} style={{ borderRadius: 12 }} />
                            </div>
                            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 800, marginBottom: 12 }}>
                                <span className="text-gradient-cyan">GPS Activated!</span>
                            </h1>
                            <p style={{ color: "var(--white-muted)", fontSize: "1.05rem", marginBottom: 32 }}>
                                Welcome, {form.name.split(" ")[0]}! Your personalized career dashboard is being prepared...
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: "2rem", marginBottom: 32 }}>
                                {["🎯", "🚀", "⭐", "🔥", "✨"].map((e, i) => (
                                    <div key={i} className="float-animation" style={{ animationDelay: `${i * 0.2}s` }}>{e}</div>
                                ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                                <Loader2 size={32} color="var(--cyan-primary)" style={{ animation: "spin 1s linear infinite" }} />
                            </div>
                            <p style={{ color: "var(--white-subtle)", fontSize: "0.85rem" }}>Redirecting to your dashboard...</p>
                        </div>
                    )}

                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.83rem", color: "var(--white-muted)", marginBottom: 7, fontWeight: 500 };

function StepHeader({ meta }: { meta: { icon: React.ReactNode; title: string; subtitle: string } }) {
    return (
        <div style={{ marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 100, padding: "6px 14px", marginBottom: 16, fontSize: "0.82rem", color: "var(--cyan-primary)" }}>
                {meta.icon} {meta.subtitle}
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: 0, color: "var(--text-primary)" }}>
                {meta.title}
            </h1>
        </div>
    );
}

function BackBtn({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} style={{ background: "none", border: "none", color: "var(--white-muted)", cursor: "pointer", marginBottom: 20, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6 }}>
            ← Back
        </button>
    );
}

function NextBtn({ onClick, label = "Continue →" }: { onClick: () => void; label?: string }) {
    return (
        <button className="btn-primary" onClick={onClick} style={{ width: "100%", padding: "16px", fontSize: "1rem" }}>
            {label}
        </button>
    );
}

function ErrorMsg({ msg }: { msg: string }) {
    return (
        <div style={{ background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#FF6B6B", fontSize: "0.85rem" }}>
            ⚠️ {msg}
        </div>
    );
}

function OptLabel() {
    return <span style={{ color: "var(--white-subtle)", fontWeight: 400, fontSize: "0.75rem" }}>(optional)</span>;
}
