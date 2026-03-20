"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { colleges } from "@/lib/data";
import logo from "@/assets/logo.png";
import { CheckCircle, Loader2 } from "lucide-react";

type Step = "country" | "college" | "email" | "verify" | "profile" | "success";

const CAREER_GOALS = [
    "AI Engineer", "Data Scientist", "Full Stack Developer",
    "Cloud Architect", "Cybersecurity Expert", "Product Manager", "DevOps Engineer"
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("country");
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedCollege, setSelectedCollege] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [verifying, setVerifying] = useState(false);
    const [studentData, setStudentData] = useState<{
        id: string; name: string; regNo: string;
        year: number; section: string; department: string; college: string;
    } | null>(null);
    const [careerGoal, setCareerGoal] = useState<string>("AI Engineer");
    const [emailDomainHint, setEmailDomainHint] = useState<string>("");
    const [collegeSearch, setCollegeSearch] = useState<string>("");
    const [progress, setProgress] = useState(0);

    const STEPS: Step[] = ["country", "college", "email", "verify", "profile", "success"];
    const stepIdx = STEPS.indexOf(step);

    useEffect(() => {
        setProgress(((stepIdx + 1) / STEPS.length) * 100);
    }, [stepIdx]);

    useEffect(() => {
        if (selectedCollege.includes("SRM")) setEmailDomainHint("@srmist.edu.in");
        else if (selectedCollege.includes("VIT")) setEmailDomainHint("@vit.ac.in");
        else if (selectedCollege.includes("NIT")) setEmailDomainHint("@nittrichy.ac.in");
        else if (selectedCollege.includes("IIT")) setEmailDomainHint("@iitm.ac.in");
        else if (selectedCollege.includes("BITS")) setEmailDomainHint("@bits-pilani.ac.in");
        else setEmailDomainHint("@college.edu.in");
    }, [selectedCollege]);

    const allColleges = colleges.flatMap((c) =>
        c.institutions.map((inst) => ({ name: inst, flag: c.flag, country: c.country }))
    );
    const filteredColleges = allColleges.filter((c) =>
        c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
        c.country.toLowerCase().includes(collegeSearch.toLowerCase())
    );

    const handleEmailVerify = async () => {
        setEmailError("");
        if (!email.includes("@") || !email.includes(".")) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setVerifying(true);
        setStep("verify");

        // Small delay for UX
        await new Promise((r) => setTimeout(r, 1800));

        try {
            const res = await fetch(`/api/students/lookup?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                setStudentData(data);
                setStep("profile");
            } else {
                setEmailError("No student record found with this email. Please contact your institution admin to register you first.");
                setStep("email");
            }
        } catch {
            setEmailError("Connection error. Please ensure the backend server is running on port 5000.");
            setStep("email");
        } finally {
            setVerifying(false);
        }
    };

    const maskEmail = (e: string) => {
        const [user, domain] = e.split("@");
        return `${user.slice(0, 3)}***@${domain}`;
    };

    const handleActivate = () => {
        // Save the student ID locally so StudentContext can pick it up
        if (studentData) {
            localStorage.setItem("skillgps_student_id", studentData.id);
        }
        setStep("success");
        setTimeout(() => router.push("/dashboard"), 3000);
    };

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
                    width: "42%",
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
                {/* Background glow */}
                <div style={{ position: "absolute", top: "30%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent)", pointerEvents: "none" }} />

                {/* Logo — top left */}
                <div style={{ position: "absolute", top: 32, left: 32 }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <Image src={logo} alt="Skill GPS Logo" width={34} height={34} style={{ borderRadius: 8 }} />
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "white" }}>
                            Skill<span style={{ color: "var(--cyan-primary)" }}>GPS</span>
                        </span>
                    </Link>
                </div>

                {/* Central logo + tagline */}
                <div style={{ textAlign: "center", marginBottom: 40, position: "relative", zIndex: 2 }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,102,255,0.15))",
                        border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 24px", backdropFilter: "blur(8px)"
                    }}>
                        <Image src={logo} alt="Skill GPS" width={48} height={48} style={{ borderRadius: 10 }} />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", marginBottom: 8 }}>
                        Welcome to <span style={{ color: "var(--cyan-primary)" }}>Skill GPS</span>
                    </h2>
                    <p style={{ color: "var(--white-muted)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 280 }}>
                        Your AI-powered career navigation platform built for students.
                    </p>
                </div>

                {/* Step dots */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    {STEPS.map((s, i) => (
                        <div
                            key={s}
                            style={{
                                height: 4,
                                width: i <= stepIdx ? 32 : 16,
                                borderRadius: 2,
                                background: i <= stepIdx ? "var(--cyan-primary)" : "var(--black-border)",
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>
                <p style={{ color: "var(--white-muted)", fontSize: "0.85rem", marginBottom: 40 }}>
                    Step {stepIdx + 1} of {STEPS.length}
                </p>

                {/* Feature bullets */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 2, width: "100%", maxWidth: 280 }}>
                    {[
                        "AI-powered career roadmap",
                        "Real-time skill gap analysis",
                        "180+ institutions supported",
                        "100% free for students",
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            color: i <= stepIdx ? "white" : "var(--white-subtle)",
                            fontSize: "0.88rem", transition: "color 0.3s"
                        }}>
                            <CheckCircle size={16} color={i <= stepIdx ? "var(--cyan-primary)" : "var(--black-border)"} strokeWidth={2} />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== RIGHT PANEL - FORM ===== */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "60px 5%",
                    overflowY: "auto",
                }}
            >
                {/* Mobile logo */}
                <div style={{ display: "none", marginBottom: 32 }} className="show-mobile">
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <Image src={logo} alt="Skill GPS Logo" width={28} height={28} style={{ borderRadius: 6 }} />
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "white" }}>
                            Skill<span style={{ color: "var(--cyan-primary)" }}>GPS</span>
                        </span>
                    </Link>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.8rem", color: "var(--white-muted)" }}>
                        <span>Getting started</span>
                        <span style={{ color: "var(--cyan-primary)" }}>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill-cyan" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* ===== STEP: COUNTRY ===== */}
                {step === "country" && (
                    <div style={{ animation: "slideInUp 0.5s ease" }}>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>
                            Where are you from?
                        </h1>
                        <p style={{ color: "var(--white-muted)", marginBottom: 32 }}>Select your country to find your institution</p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
                            {colleges.map((c) => (
                                <button
                                    key={c.country}
                                    onClick={() => { setSelectedCountry(c.country); setStep("college"); }}
                                    style={{
                                        padding: "20px 16px", borderRadius: 14,
                                        border: `1px solid ${selectedCountry === c.country ? "var(--cyan-primary)" : "var(--black-border)"}`,
                                        background: selectedCountry === c.country ? "rgba(0,212,255,0.1)" : "var(--black-card)",
                                        cursor: "pointer", textAlign: "center", transition: "all 0.2s", color: "white",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cyan-primary)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedCountry === c.country ? "var(--cyan-primary)" : "var(--black-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                                >
                                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>{c.flag}</div>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.country}</div>
                                    <div style={{ color: "var(--white-muted)", fontSize: "0.75rem", marginTop: 2 }}>{c.institutions.length} institutions</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== STEP: COLLEGE ===== */}
                {step === "college" && (
                    <div style={{ animation: "slideInUp 0.5s ease" }}>
                        <button onClick={() => setStep("country")} style={{ background: "none", border: "none", color: "var(--white-muted)", cursor: "pointer", marginBottom: 20, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6 }}>
                            ← Back
                        </button>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>
                            Select your institution
                        </h1>
                        <p style={{ color: "var(--white-muted)", marginBottom: 24 }}>
                            Showing institutions in <strong style={{ color: "white" }}>{selectedCountry}</strong>
                        </p>

                        <div style={{ marginBottom: 20, position: "relative" }}>
                            <input
                                className="input-field"
                                placeholder="🔍 Search your college..."
                                value={collegeSearch}
                                onChange={(e) => setCollegeSearch(e.target.value)}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
                            {filteredColleges
                                .filter((c) => c.country === selectedCountry || !selectedCountry || collegeSearch)
                                .map((c) => (
                                    <button
                                        key={c.name}
                                        onClick={() => { setSelectedCollege(c.name); setStep("email"); }}
                                        style={{
                                            padding: "16px 20px", borderRadius: 12,
                                            border: "1px solid var(--black-border)",
                                            background: "var(--black-card)",
                                            cursor: "pointer", textAlign: "left", color: "white",
                                            transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between",
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cyan-primary)"; e.currentTarget.style.background = "rgba(0,212,255,0.05)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--black-border)"; e.currentTarget.style.background = "var(--black-card)"; }}
                                    >
                                        <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{c.flag} {c.name}</span>
                                        <span style={{ color: "var(--white-muted)", fontSize: "0.8rem" }}>→</span>
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* ===== STEP: EMAIL ===== */}
                {step === "email" && (
                    <div style={{ animation: "slideInUp 0.5s ease" }}>
                        <button onClick={() => setStep("college")} style={{ background: "none", border: "none", color: "var(--white-muted)", cursor: "pointer", marginBottom: 20, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6 }}>
                            ← Back
                        </button>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>
                            Verify your identity
                        </h1>
                        <p style={{ color: "var(--white-muted)", marginBottom: 8 }}>
                            Enter your official college email from{" "}
                            <strong style={{ color: "white" }}>{selectedCollege}</strong>
                        </p>
                        <p style={{ color: "var(--cyan-primary)", fontSize: "0.85rem", marginBottom: 28 }}>
                            Your email should end with <strong>{emailDomainHint}</strong>
                        </p>

                        {/* Demo hint */}
                        <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: "0.82rem", color: "var(--cyan-primary)" }}>
                            <strong>Registered students (demo):</strong>{" "}
                            <code style={{ background: "rgba(0,212,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>arjun.sharma@srmist.edu.in</code>,{" "}
                            <code style={{ background: "rgba(0,212,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>priya.nair@vit.ac.in</code>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--white-muted)", marginBottom: 8 }}>College Email ID</label>
                            <input
                                className="input-field"
                                type="email"
                                placeholder={`yourname${emailDomainHint}`}
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && handleEmailVerify()}
                            />
                            {emailError && (
                                <p style={{ color: "#FF3B3B", fontSize: "0.82rem", marginTop: 8, lineHeight: 1.4 }}>{emailError}</p>
                            )}
                        </div>

                        <button className="btn-primary" onClick={handleEmailVerify} style={{ width: "100%", padding: "16px" }}>
                            Verify & Continue →
                        </button>

                        <p style={{ color: "var(--white-subtle)", fontSize: "0.82rem", marginTop: 16, textAlign: "center" }}>
                            Not registered yet?{" "}
                            <Link href="/admin" style={{ color: "var(--cyan-primary)", textDecoration: "none" }}>
                                Ask your institution admin →
                            </Link>
                        </p>
                    </div>
                )}

                {/* ===== STEP: VERIFY ===== */}
                {step === "verify" && (
                    <div style={{ textAlign: "center", animation: "slideInUp 0.5s ease" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                            <Loader2 size={48} color="var(--cyan-primary)" style={{ animation: "spin 1s linear infinite" }} />
                        </div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
                            Searching records...
                        </h2>
                        <p style={{ color: "var(--white-muted)" }}>Checking student database for {maskEmail(email)}</p>
                        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                            {["✅ Institution verified", "✅ Checking student registry...", "⟳ Fetching profile data..."].map((msg, i) => (
                                <div key={i} style={{ color: i === 2 ? "var(--cyan-primary)" : "var(--white-muted)", fontSize: "0.85rem", animation: `slideInUp ${0.3 + i * 0.2}s ease` }}>
                                    {msg}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== STEP: PROFILE ===== */}
                {step === "profile" && studentData && (
                    <div style={{ animation: "slideInUp 0.5s ease" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: "0.82rem", color: "var(--cyan-primary)" }}>
                            ✅ Student record found!
                        </div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: 24 }}>
                            Hello, {studentData.name}!
                        </h1>

                        {/* Student card */}
                        <div className="glass-card-cyan" style={{ padding: 24, marginBottom: 24 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {[
                                    { label: "Name", value: studentData.name },
                                    { label: "Reg. No.", value: studentData.regNo },
                                    { label: "Year", value: `${studentData.year}${studentData.year === 1 ? "st" : studentData.year === 2 ? "nd" : studentData.year === 3 ? "rd" : "th"} Year` },
                                    { label: "Section", value: studentData.section },
                                    { label: "Department", value: studentData.department },
                                    { label: "College", value: (studentData.college || selectedCollege).split(" ").slice(0, 3).join(" ") + "..." },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div style={{ color: "var(--white-muted)", fontSize: "0.75rem", marginBottom: 2 }}>{item.label}</div>
                                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Career goal */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--white-muted)", marginBottom: 10 }}>
                                What&apos;s your career goal?
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {CAREER_GOALS.map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setCareerGoal(goal)}
                                        style={{
                                            padding: "8px 16px", borderRadius: 100,
                                            border: `1px solid ${careerGoal === goal ? "var(--cyan-primary)" : "var(--black-border)"}`,
                                            background: careerGoal === goal ? "rgba(0,212,255,0.1)" : "var(--black-card)",
                                            color: careerGoal === goal ? "var(--cyan-primary)" : "var(--white-muted)",
                                            cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, transition: "all 0.2s",
                                        }}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: "100%", padding: "16px" }}
                            onClick={handleActivate}
                        >
                            🚀 Activate My Career GPS
                        </button>
                    </div>
                )}

                {/* ===== STEP: SUCCESS ===== */}
                {step === "success" && (
                    <div style={{ textAlign: "center", animation: "slideInUp 0.5s ease" }}>
                        <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,102,255,0.2))", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                            <Image src={logo} alt="Skill GPS" width={48} height={48} style={{ borderRadius: 10 }} />
                        </div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 800, marginBottom: 12 }}>
                            <span className="text-gradient-cyan">GPS Activated!</span>
                        </h1>
                        <p style={{ color: "var(--white-muted)", fontSize: "1.05rem", marginBottom: 32 }}>
                            Welcome, {studentData?.name?.split(" ")[0] || "student"}! Your personalized career dashboard is being prepared...
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

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
