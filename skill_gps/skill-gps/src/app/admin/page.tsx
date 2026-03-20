"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { Shield, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                // Store admin token in sessionStorage
                sessionStorage.setItem("adminToken", data.token);
                sessionStorage.setItem("adminRole", data.role);
                sessionStorage.setItem("adminCollege", data.college || "");
                router.push("/admin/dashboard");
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch {
            setError("Connection error. Please ensure the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-primary)",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Background decoration */}
            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.08), transparent)", pointerEvents: "none" }} />

            <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", padding: "0 20px" }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 32 }}>
                        <Image src={logo} alt="Skill GPS Logo" width={36} height={36} style={{ borderRadius: 8 }} />
                        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 500, color: "var(--text-primary)" }}>
                            Skill GPS
                        </span>
                    </Link>

                    <div style={{
                        width: 72, height: 72, borderRadius: 20,
                        background: "linear-gradient(135deg, #3B82F6, #A855F7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px", boxShadow: "0 8px 32px rgba(59,130,246,0.3)"
                    }}>
                        <Shield size={36} color="white" />
                    </div>

                    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 500, marginBottom: 8, color: "var(--text-primary)" }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                        Institutional management & student oversight
                    </p>
                </div>

                {/* Login Card */}
                <div style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 24,
                    padding: 40,
                    boxShadow: "0 4px 40px rgba(0,0,0,0.08)"
                }}>
                    <form onSubmit={handleLogin}>
                        {/* Error */}
                        {error && (
                            <div style={{
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: 12, padding: "12px 16px", marginBottom: 24,
                                display: "flex", alignItems: "center", gap: 10, color: "#ef4444", fontSize: "0.9rem"
                            }}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Institution Name */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                                Institution Name
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter your institution name (e.g. SRM Institute)"
                                required
                                autoComplete="organization"
                                style={{
                                    width: "100%", boxSizing: "border-box", padding: "14px 16px",
                                    background: "var(--bg-primary)", border: "1px solid var(--border-color)",
                                    borderRadius: 12, color: "var(--text-primary)", fontSize: "1rem",
                                    outline: "none", transition: "border-color 0.2s"
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "#3B82F6")}
                                onBlur={e => (e.currentTarget.style.borderColor = "var(--border-color)")}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                                Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    autoComplete="current-password"
                                    style={{
                                        width: "100%", boxSizing: "border-box", padding: "14px 48px 14px 16px",
                                        background: "var(--bg-primary)", border: "1px solid var(--border-color)",
                                        borderRadius: 12, color: "var(--text-primary)", fontSize: "1rem",
                                        outline: "none", transition: "border-color 0.2s"
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "#3B82F6")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-color)")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%", padding: "16px", borderRadius: 12, border: "none",
                                background: loading ? "rgba(59,130,246,0.6)" : "linear-gradient(135deg, #3B82F6, #A855F7)",
                                color: "white", fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                transition: "all 0.2s", boxShadow: "0 4px 16px rgba(59,130,246,0.3)"
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In to Admin Portal
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo hint */}
                    <div style={{
                        marginTop: 24, padding: "12px 16px",
                        background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
                        borderRadius: 12, fontSize: "0.82rem", color: "var(--text-secondary)"
                    }}>
                        <strong style={{ color: "var(--text-primary)" }}>Demo credentials:</strong>{" "}
                        Institution: <code style={{ background: "var(--bg-primary)", padding: "2px 6px", borderRadius: 4 }}>Rajalakshmi</code> or your college<br />
                        Password: <code style={{ background: "var(--bg-primary)", padding: "2px 6px", borderRadius: 4 }}>12345678</code>
                    </div>
                </div>

                {/* Back to home */}
                <div style={{ textAlign: "center", marginTop: 28 }}>
                    <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>
                        ← Back to Homepage
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
