"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStudent } from "@/lib/StudentContext";
import logo from "@/assets/logo.png";
import { LayoutDashboard, Fingerprint, LineChart, AlertCircle, Map as MapIcon, Bot, FileText, ChevronLeft, ChevronRight, Bell, MessageSquare, BrainCircuit, Mic } from "lucide-react";
import mascotImg from "@/assets/mascot.png";

const NAV_ITEMS = [
    { id: "home", path: "/dashboard", icon: <LayoutDashboard size={20} strokeWidth={1.5} />, label: "Overview" },
    { id: "roadmap", path: "/dashboard/roadmap", icon: <MapIcon size={20} strokeWidth={1.5} />, label: "Roadmap" },
    { id: "assessments", path: "/dashboard/assessments", icon: <LineChart size={20} strokeWidth={1.5} />, label: "Assessments" },
    { id: "projects", path: "/dashboard/projects", icon: <Bot size={20} strokeWidth={1.5} />, label: "Projects & Hackathons" },
    { id: "aptitude-trainer", path: "/dashboard/aptitude-trainer", icon: <BrainCircuit size={20} strokeWidth={1.5} />, label: "Aptitude Trainer" },
    { id: "resume", path: "/dashboard/resume", icon: <AlertCircle size={20} strokeWidth={1.5} />, label: "Resume Optimizer" },
    { id: "mentor", path: "/dashboard/mentor", icon: <FileText size={20} strokeWidth={1.5} />, label: "Mentor Guide" },
    { id: "chat", path: "/dashboard/chat", icon: <Bot size={20} strokeWidth={1.5} />, label: "Chat with AI" },
    { id: "connect", path: "/dashboard/connect", icon: <Fingerprint size={20} strokeWidth={1.5} />, label: "Alumni & Connect" },
    { id: "certifications", path: "/dashboard/certifications", icon: <FileText size={20} strokeWidth={1.5} />, label: "My Certifications" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { student, isLoading } = useStudent();

    if (isLoading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", flexDirection: "column", gap: 16 }}>
                <Image src={logo} alt="Skill GPS" width={48} height={48} style={{ borderRadius: 12, animation: "pulse 2s ease-in-out infinite" }} />
                <div style={{ width: 32, height: 32, border: "2px solid var(--border-color)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading your profile...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-primary)" }}>
            {/* ===== SIDEBAR ===== */}
            <aside
                style={{
                    width: sidebarCollapsed ? 80 : 260,
                    height: "100%",
                    background: "var(--bg-secondary)",
                    borderRight: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "width 0.3s cubic-bezier(0.2, 0, 0, 1)",
                    flexShrink: 0,
                    zIndex: 50,
                }}
                className="hide-mobile"
            >
                {/* Logo */}
                <div style={{ padding: sidebarCollapsed ? "24px 0" : "24px", display: "flex", alignItems: "center", justifyContent: sidebarCollapsed ? "center" : "space-between", borderBottom: "1px solid var(--border-light)" }}>
                    <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                        <Image src={logo} alt="Logo" width={32} height={32} style={{ borderRadius: "8px", flexShrink: 0 }} />
                        {!sidebarCollapsed && (
                            <span style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>
                                Skill GPS
                            </span>
                        )}
                    </Link>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "24px 12px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                                style={{ justifyContent: sidebarCollapsed ? "center" : "flex-start", padding: sidebarCollapsed ? "12px" : "12px 16px" }}
                                title={sidebarCollapsed ? item.label : undefined}
                            >
                                <div style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>{item.icon}</div>
                                {!sidebarCollapsed && <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    style={{ background: "none", border: "1px solid var(--border-light)", color: "var(--text-secondary)", cursor: "pointer", padding: "8px", margin: "16px", borderRadius: "8px", transition: "all 0.2s", display: "flex", justifyContent: "center" }}
                    aria-label="Toggle Sidebar"
                >
                    {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                {/* XP Widget */}
                {!sidebarCollapsed && (
                    <div style={{ padding: "0 20px" }}>
                        <div style={{ padding: "16px", background: "var(--bg-tertiary)", border: "1px solid var(--border-light)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                            <Image src={mascotImg} alt="Mascot" width={36} height={36} style={{ borderRadius: "50%", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }} />
                            <div>
                                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>Level {student.level}</span>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{student.totalXP.toLocaleString()} XP</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Footer */}
                <div style={{ padding: sidebarCollapsed ? "16px 0" : "16px 20px", display: "flex", alignItems: "center", justifyContent: sidebarCollapsed ? "center" : "flex-start", gap: 12, borderTop: "1px solid var(--border-light)", background: "var(--bg-tertiary)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "0.9rem", flexShrink: 0 }}>
                        {student.name.charAt(0)}
                    </div>
                    {!sidebarCollapsed && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 500, fontSize: "0.85rem", color: "var(--text-primary)" }}>{student.name}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{student.department.split(" ")[0]} · Sem {student.semester}</span>
                        </div>
                    )}
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main style={{ flex: 1, height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", position: "relative" }}>
                <header style={{ padding: "0 40px", height: "80px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)", position: "sticky", top: 0, zIndex: 40 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <h2 style={{ fontFamily: "var(--font-primary)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                            {NAV_ITEMS.find(n => n.path === pathname)?.label || "Overview"}
                        </h2>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <span className="badge">Semester {student.semester}</span>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                            <Bell size={20} strokeWidth={1.5} />
                        </button>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #A855F7)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontFamily: "var(--font-serif)", fontSize: "1rem" }}>
                            {student.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, padding: "40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
                    {children}
                </div>

                <nav style={{ display: "none", borderTop: "1px solid var(--border-color)", padding: "12px 8px", background: "var(--bg-secondary)", justifyContent: "space-around" }} className="mobile-nav">
                    {NAV_ITEMS.slice(0, 5).map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.id} href={item.path} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", color: isActive ? "var(--accent)" : "var(--text-secondary)", fontSize: "0.7rem", fontWeight: isActive ? 500 : 400 }}>
                                {item.icon}{item.label}
                            </Link>
                        );
                    })}
                </nav>
            </main>
        </div>
    );
}
