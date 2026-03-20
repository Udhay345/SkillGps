"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Crosshair, Award, Zap, Compass, BriefcaseIcon,
    CheckCircle, PlayCircle, BookOpen, ChevronRight, Lock, Unlock, TrendingUp, Sparkles, User, Brain, MessageSquare
} from "lucide-react";

import mascotImg from "@/assets/mascot.png";
import trophyImg from "@/assets/trophy.png";

const ROADMAP_NODES = [
    { id: 1, title: "Frontend Foundation", status: "completed", xp: 150, description: "Mastering HTML, CSS, JavaScript basics and DOM manipulation.", icon: <BookOpen size={18} /> },
    { id: 2, title: "React & Next.js Ecosystem", status: "active", xp: 300, description: "Building interactive user interfaces, SSR, state management.", icon: <Sparkles size={18} /> },
    { id: 3, title: "Professional Communication", status: "active", xp: 250, description: "Mock interviews, professional email writing, and verbal articulation for tech interviews.", icon: <MessageSquare size={18} /> },
    { id: 4, title: "Aptitude Trainer", status: "active", xp: 200, description: "Quantitative problem solving, logical reasoning, and puzzle challenges for clearing Day 1 placement tests.", icon: <Brain size={18} /> },
    { id: 5, title: "Backend & Systems Design", status: "locked", xp: 500, description: "APIs, databases, scalable architecture, and microservices.", icon: <Lock size={18} /> },
    { id: 6, title: "Cloud Deployment (AWS)", status: "locked", xp: 400, description: "Deploying applications, Docker, CI/CD, and Serverless.", icon: <Lock size={18} /> }
];

const MARKETPLACE_SKILLS = [
    { name: "Web3 & Blockchain", cost: "500 XP", tag: "Trending", color: "#8ab4f8" },
    { name: "ML Models & AI", cost: "750 XP", tag: "High Demand", color: "#f28b82" },
    { name: "Advanced System Design", cost: "800 XP", tag: "Elite", color: "#ccff90" }
];

export default function RoadmapPage() {
    const [selectedNode, setSelectedNode] = useState<{ id: number, title: string, status: string, xp: number, description: string, icon: React.ReactNode } | null>(null);
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async (targetRole: string) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/career-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentSkills: "JavaScript, HTML, CSS", targetRole }),
            });

            if (!res.ok) throw new Error("Failed to generate roadmap");
            const data = await res.json();
            setRoadmapData(data);
        } catch (err) {
            setError("Communication failure with AI service.");
        } finally {
            setIsLoading(false);
        }
    };

    const nodes = roadmapData?.nodes || ROADMAP_NODES;

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>

            {/* Header Area */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.8rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                        Career <span style={{ background: "linear-gradient(90deg, #A8C0FF 0%, #3f2b96 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Roadmap</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "600px" }}>
                        Your personalized path to mastering software engineering. Unlock nodes, gain XP, and acquire high-demand industry skills.
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button 
                        onClick={() => handleGenerate("Full Stack AI Engineer")}
                        disabled={isLoading}
                        style={{ padding: "10px 20px", borderRadius: "10px", background: "var(--accent)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                    >
                        <Sparkles size={18} /> {isLoading ? "Generating..." : "Generate AI Roadmap"}
                    </button>
                    <div style={{ padding: "8px 16px", borderRadius: "100px", background: "rgba(168, 192, 255, 0.1)", border: "1px solid rgba(168, 192, 255, 0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                        <Zap size={16} color="#A8C0FF" />
                        <span style={{ fontSize: "0.9rem", color: "#A8C0FF", fontWeight: 600 }}>1,250 Total XP</span>
                    </div>
                </div>
            </div>

            {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: 12, borderRadius: 8, marginBottom: 20 }}>⚠️ {error}</div>}

            {/* Main Interactive Grid Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start", marginBottom: 48 }}>

                {/* Left Area: The Path / Journey */}
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                    {/* The Visual Timeline (Roadmap) */}
                    <div style={{
                        background: "rgba(20, 20, 25, 0.6)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        padding: "40px",
                        borderRadius: 24,
                        boxShadow: "0 24px 40px rgba(0,0,0,0.2)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
                            <Compass size={24} color="#A8C0FF" />
                            <h3 style={{ fontSize: "1.4rem", fontWeight: 500, color: "var(--text-primary)" }}>Core Skill Path</h3>
                        </div>

                        <div style={{ position: "relative", paddingLeft: "40px", borderLeft: "2px dashed rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 40 }}>
                            {nodes.map((node: any, index: number) => {
                                const isCompleted = node.status === "completed";
                                const isActive = node.status === "active";
                                const isLocked = node.status === "locked";

                                return (
                                    <motion.div
                                        key={node.id}
                                        whileHover={!isLocked ? { scale: 1.02, x: 5 } : {}}
                                        onClick={() => !isLocked && setSelectedNode(node)}
                                        style={{
                                            position: "relative",
                                            background: isActive ? "linear-gradient(145deg, rgba(168, 192, 255, 0.1), rgba(63, 43, 150, 0.2))" : "rgba(30, 30, 35, 0.5)",
                                            border: isActive ? "1px solid rgba(168, 192, 255, 0.4)" : "1px solid rgba(255,255,255,0.05)",
                                            padding: "24px",
                                            borderRadius: "16px",
                                            cursor: isLocked ? "not-allowed" : "pointer",
                                            opacity: isLocked ? 0.6 : 1,
                                            boxShadow: isActive ? "0 0 30px rgba(168, 192, 255, 0.1)" : "none"
                                        }}
                                    >
                                        {/* Timeline Node Dot */}
                                        <div style={{
                                            position: "absolute",
                                            left: -53,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            background: isCompleted ? "#A8C0FF" : isActive ? "var(--bg-primary)" : "var(--bg-tertiary)",
                                            border: `4px solid ${isActive ? "#A8C0FF" : "var(--bg-secondary)"}`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            boxShadow: isActive ? "0 0 15px #A8C0FF" : "none"
                                        }}>
                                            {isCompleted && <CheckCircle size={12} color="#000" />}
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                                    <div style={{ color: isActive ? "#A8C0FF" : "var(--text-secondary)" }}>{node.icon || <BookOpen size={18} />}</div>
                                                    <h4 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>{node.title}</h4>
                                                </div>
                                                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", margin: 0, paddingLeft: 30 }}>
                                                    {node.description}
                                                </p>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                                {isActive && <span style={{ padding: "4px 10px", background: "rgba(168,192,255,0.2)", color: "#A8C0FF", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>In Progress</span>}
                                                {isCompleted && <span style={{ padding: "4px 10px", background: "rgba(76, 175, 80, 0.2)", color: "#4CAF50", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>Mastered</span>}
                                                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Zap size={12} /> {node.xp} XP
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Right Area: Market, Stats, Leaderboard */}
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                    {/* Active Goal Glass Card */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(63, 43, 150, 0.8), rgba(168, 192, 255, 0.2))",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(168, 192, 255, 0.3)",
                        padding: "24px",
                        borderRadius: 20,
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div style={{ position: "absolute", right: -30, top: -30, width: 150, height: 150, background: "rgba(168,192,255,0.2)", filter: "blur(50px)", borderRadius: "50%" }}></div>
                        <h4 style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Current Primary Goal</h4>
                        <div style={{ fontSize: "1.4rem", fontWeight: 500, color: "#fff", marginBottom: 20 }}>
                            Land Summer Internship
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "100px", height: "8px", width: "100%", overflow: "hidden", marginBottom: 8 }}>
                            <div style={{ width: "65%", height: "100%", background: "#A8C0FF", borderRadius: "100px" }}></div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
                            <span>Progress: 65%</span>
                            <span>Est: 2 Months</span>
                        </div>
                    </div>

                    {/* Skill Marketplace (Stitch Suggestion) */}
                    <div style={{
                        background: "rgba(20, 20, 25, 0.6)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        padding: "24px",
                        borderRadius: 20
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <Unlock size={20} color="var(--text-primary)" />
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)" }}>Skill Marketplace</h3>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 20 }}>
                            Spend your earned XP to unlock specialized career paths and exclusive content.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {MARKETPLACE_SKILLS.map((skill, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                                    <div>
                                        <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500, marginBottom: 4 }}>{skill.name}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: skill.color }}></div>
                                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{skill.tag}</span>
                                        </div>
                                    </div>
                                    <button style={{ background: "rgba(168,192,255,0.1)", border: "1px solid rgba(168,192,255,0.2)", color: "#A8C0FF", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} className="hover-scale">
                                        Unlock {skill.cost}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard Preview (Stitch Suggestion) */}
                    <div style={{
                        background: "rgba(20, 20, 25, 0.6)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        padding: "24px",
                        borderRadius: 20
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <TrendingUp size={20} color="var(--text-primary)" />
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)" }}>Global Ranking</h3>
                            </div>
                            <span style={{ color: "#A8C0FF", fontSize: "0.8rem", cursor: "pointer" }}>View All</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { rank: 1, name: "Arjun C.", xp: "3,250", me: false },
                                { rank: 2, name: "Sneha R.", xp: "2,840", me: false },
                                { rank: 14, name: "You", xp: "1,250", me: true }
                            ].map((user, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: user.me ? 1 : 0.7 }}>
                                    <span style={{ width: 20, fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>#{user.rank}</span>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: user.me ? "#A8C0FF" : "var(--bg-tertiary)", color: user.me ? "#000" : "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 600 }}>
                                        {user.me ? <User size={16} /> : user.name.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: "0.95rem", color: user.me ? "#A8C0FF" : "var(--text-primary)", fontWeight: user.me ? 600 : 400 }}>{user.name}</span>
                                    <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{user.xp} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Pop-up for Node Details (Stitch Suggestion) */}
            <AnimatePresence>
                {selectedNode && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNode(null)}
                            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, backdropFilter: "blur(5px)" }}
                        />
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            style={{
                                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                                background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: 40,
                                borderRadius: 24, zIndex: 101, width: "100%", maxWidth: 600, boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(168,192,255,0.1)", color: "#A8C0FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {selectedNode.icon}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "1.6rem", color: "var(--text-primary)", margin: 0 }}>{selectedNode.title}</h2>
                                    <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                        <span style={{ textTransform: "uppercase", color: selectedNode.status === 'completed' ? "#4CAF50" : "#A8C0FF", fontWeight: 600 }}>{selectedNode.status}</span>
                                        <span>•</span>
                                        <span>Yields {selectedNode.xp} XP Mastered</span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
                                This node represents a critical milestone in your software engineering journey. Dive deep into the recommended resources below to advance your skill set and clear the assessment challenges.
                            </p>

                            <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>Recommended Resources</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                                {[
                                    { name: "Official Documentation Guide", type: "Reading", duration: "45m" },
                                    { name: "Frontend Masters: Deep Dive", type: "Video", duration: "3h 20m" },
                                    { name: "Interactive Sandbox Challenge", type: "Practice", duration: "1h" }
                                ].map((res, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", border: "1px solid var(--border-light)", borderRadius: 12, background: "var(--bg-primary)", cursor: "pointer" }} className="hover-scale">
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            {res.type === 'Video' ? <PlayCircle size={18} color="var(--text-secondary)" /> : <BookOpen size={18} color="var(--text-secondary)" />}
                                            <span style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{res.name}</span>
                                        </div>
                                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{res.duration}</span>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => setSelectedNode(null)} style={{ width: "100%", padding: "16px", background: "#A8C0FF", color: "#000", border: "none", borderRadius: 12, fontSize: "1rem", fontWeight: 600, cursor: "pointer" }} className="hover-scale">
                                {selectedNode.status === 'completed' ? "Review Node" : "Start Learning"}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
