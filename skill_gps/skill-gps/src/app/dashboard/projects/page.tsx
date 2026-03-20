"use client";
import { useState } from "react";
import { Code2, Github, LayoutGrid, CalendarDays, ExternalLink, Zap, Flame } from "lucide-react";
import Image from "next/image";
import mascotImg from "@/assets/mascot.png";
import trophyImg from "@/assets/trophy.png";

export default function ProjectsPage() {
    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", background: "var(--bg-tertiary)", borderRadius: 16, border: "1px solid var(--border-color)", marginBottom: 40, display: "flex", alignItems: "center", gap: 24, justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 8 }}>
                        Projects & <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Hackathons</span>
                    </h1>
                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1rem" }}>
                        Pushing code. Winning hackathons. Building the future.
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <Image src={mascotImg} alt="Mascot" width={64} height={64} style={{ borderRadius: "50%", background: "var(--bg-secondary)", border: "2px solid var(--border-light)" }} />
                </div>
            </div>

            {/* Top Grid: GitHub & Projects Overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 48 }}>

                {/* GitHub Progress */}
                <div className="glass-panel" style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-light)" }}>
                                <Github size={24} color="var(--text-primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)" }}>GitHub Activity</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 2 }}>@arjun_codes</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(255,140,0,0.1)", borderRadius: 100, border: "1px solid rgba(255,140,0,0.3)" }}>
                            <Flame size={14} color="#FF8C00" />
                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#FF8C00" }}>30 Day Streak!</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8 }}>
                            <span>Weekly Contribution Goal</span>
                            <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>12 / 15 commits</span>
                        </div>
                        <div style={{ height: 8, background: "var(--bg-tertiary)", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: "80%", height: "100%", background: "var(--text-primary)", borderRadius: 4 }} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: 8, border: "1px solid var(--border-light)" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Repositories</div>
                            <div style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif)", fontWeight: 500, color: "var(--text-primary)" }}>14</div>
                        </div>
                        <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: 8, border: "1px solid var(--border-light)" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Stars</div>
                            <div style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif)", fontWeight: 500, color: "var(--text-primary)" }}>32</div>
                        </div>
                    </div>
                </div>

                {/* Projects Status */}
                <div className="glass-panel" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-light)" }}>
                            <Code2 size={24} color="var(--text-primary)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)" }}>Project Portfolio</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 2 }}>Implementation tracking</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px dashed var(--border-light)" }}>
                            <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>Projects Completed</span>
                            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>4</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px dashed var(--border-light)" }}>
                            <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>Current Projects</span>
                            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>2</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
                            <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>Hackathons Participated</span>
                            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>3</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active & Past Projects List */}
            <div style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <LayoutGrid size={20} color="var(--text-primary)" />
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--text-primary)" }}>
                        Current Projects
                    </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", borderRadius: 12, border: "1px solid var(--border-color)", overflow: "hidden" }}>
                    {[
                        { name: "AI Resume Analyzer", tech: "Next.js, Python, OpenAI", status: "Active (70%)", time: "Started 3 weeks ago", color: "var(--text-primary)" },
                        { name: "Campus Navigation App", tech: "React Native, Google Maps", status: "Planning", time: "Starts next week", color: "var(--text-secondary)" }
                    ].map((proj, i) => (
                        <div key={i} className="flat-list-item">
                            <div>
                                <h4 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 }}>{proj.name}</h4>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{proj.tech}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "0.85rem", fontWeight: 500, color: proj.color, padding: "4px 10px", background: "var(--bg-tertiary)", borderRadius: 100, display: "inline-block", marginBottom: 6 }}>
                                    {proj.status}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{proj.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hackathons & Events Feed */}
            <div style={{ paddingBottom: 60 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,212,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,212,255,0.2)" }}>
                        <CalendarDays size={20} color="var(--cyan-primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--text-primary)" }}>
                            Live Hackathons
                        </h2>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 2 }}>Discover and register for ongoing events</p>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
                    {[
                        {
                            name: "Global AI Hackathon 2026",
                            abstract: "Build the next generation of AI-powered applications. Focus areas include healthcare, education, and sustainability. Prize pool: $50,000.",
                            date: "March 15-17, 2026",
                            format: "Online",
                            link: "#",
                            tags: ["AI", "Machine Learning"]
                        },
                        {
                            name: "Web3 Scholars Buildathon",
                            abstract: "Create decentralized solutions for identity, finance, and social networks. Mentorship provided by top industry experts.",
                            date: "April 5-10, 2026",
                            format: "Hybrid",
                            link: "#",
                            tags: ["Web3", "Blockchain"]
                        },
                        {
                            name: "GreenTech Challenge",
                            abstract: "Develop software solutions to combat climate change and promote sustainable living. Open to all students and recent graduates.",
                            date: "April 22-24, 2026",
                            format: "Online",
                            link: "#",
                            tags: ["Sustainability", "IoT"]
                        }
                    ].map((hack, i) => (
                        <div key={i} className="glass-card hover-blue-green" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                            <div style={{ padding: 24, flexGrow: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <h4 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3, maxWidth: "80%" }}>
                                        {hack.name}
                                    </h4>
                                    <div style={{ padding: "4px 10px", background: "rgba(57, 211, 83, 0.1)", color: "#39d353", borderRadius: 100, fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(57, 211, 83, 0.2)" }}>
                                        {hack.format}
                                    </div>
                                </div>

                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 20 }}>
                                    {hack.abstract}
                                </p>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                                    {hack.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: "0.75rem", padding: "4px 8px", background: "var(--bg-tertiary)", color: "var(--text-muted)", borderRadius: 4, border: "1px solid var(--border-light)" }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-light)", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>
                                    {hack.date}
                                </div>
                                <a href={hack.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 500, color: "var(--accent-light)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-light)"}>
                                    Register <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
