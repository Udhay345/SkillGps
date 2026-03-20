"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
    const router = useRouter();

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
            {/* Left Panel */}
            <div
                style={{
                    width: "45%",
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

                {/* Logo */}
                <div style={{ position: "absolute", top: 32, left: 32, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: "linear-gradient(135deg,#00D4FF,#0066FF)", display: "flex", alignItems: "center", justifyContent: "center" }}></div>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Skill<span style={{ color: "var(--cyan-primary)" }}>GPS</span></span>
                </div>

                {/* Feature bullets */}
                <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        " AI-powered career roadmap",
                        " Real-time skill gap analysis",
                        " 180+ institutions supported",
                        " 100% free for students",
                    ].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontSize: "0.88rem", transition: "color 0.3s" }}>
                            <span style={{ color: "var(--cyan-primary)" }}>{item.split(" ")[0]}</span>
                            {item.slice(2)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "60px 5%",
                    overflowY: "auto",
                }}
            >
                <div style={{ width: "100%", maxWidth: 400, animation: "slideInUp 0.5s ease" }}>
                    <Link href="/" style={{ background: "none", border: "none", color: "var(--white-muted)", cursor: "pointer", marginBottom: 20, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                        ← Back to Home
                    </Link>

                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
                        Welcome back
                    </h1>
                    <p style={{ color: "var(--white-muted)", marginBottom: 32 }}>
                        Sign in to continue exploring your career roadmap.
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--white-muted)", marginBottom: 8 }}>Username / Email</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="username or email"
                                style={{ width: "100%" }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--white-muted)", marginBottom: 8 }}>Password</label>
                            <input
                                className="input-field"
                                type="password"
                                placeholder="••••••••"
                                style={{ width: "100%" }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: "100%", padding: "16px", marginBottom: 24, fontSize: "1rem" }}
                        >
                            Sign In →
                        </button>
                    </form>

                    <p style={{ color: "var(--white-subtle)", fontSize: "0.85rem", textAlign: "center" }}>
                        Don&apos;t have an account? <Link href="/onboarding" style={{ color: "var(--cyan-primary)", textDecoration: "none" }}>Get Started →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
