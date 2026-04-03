"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStudent } from "@/lib/StudentContext";
import {
    Activity, Award, Code2, MessageSquare, Zap, TrendingUp, FileText, ChevronRight, ExternalLink, X, Target, Plus, CheckSquare, Square, Users, PlayCircle, Loader2, Sparkles
} from "lucide-react";

import mascotImg from "@/assets/mascot.png";
import trophyImg from "@/assets/trophy.png";
import logoImg from "@/assets/logo.png";

export default function DashboardHome() {
    const { student } = useStudent();
    const [selectedBadge, setSelectedBadge] = useState<any>(null);
    const [insights, setInsights] = useState<any[]>([]);
    const [insightsLoading, setInsightsLoading] = useState(true);
    const [platformStats, setPlatformStats] = useState<any>(null);
    const [syncing, setSyncing] = useState(false);

    // Editable Semester Goals loaded from student data
    const [semesterTasks, setSemesterTasks] = useState(student.semesterGoals);
    const [newTaskText, setNewTaskText] = useState("");

    useEffect(() => {
        setSemesterTasks(student.semesterGoals);
    }, [student.semesterGoals]);

    const toggleTask = (id: number) => {
        setSemesterTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTaskText.trim()) {
            setSemesterTasks([...semesterTasks, { id: Date.now(), text: newTaskText.trim(), done: false }]);
            setNewTaskText("");
        }
    };

    const fetchPlatformStats = async () => {
        if (!student.githubUsername && !student.leetcodeUsername) return;
        setSyncing(true);
        try {
            const res = await fetch(`/api/stats/platforms?github=${student.githubUsername}&leetcode=${student.leetcodeUsername}`);
            if (res.ok) {
                const data = await res.json();
                setPlatformStats(data);
            }
        } catch (error) {
            console.error("Failed to sync platform stats", error);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchPlatformStats();
    }, [student.githubUsername, student.leetcodeUsername]);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const interestQuery = student.careerTarget;
                const res = await fetch(`/api/insights?interests=${encodeURIComponent(interestQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setInsights(data);
                }
            } catch (error) {
                console.error("Failed to fetch insights", error);
            } finally {
                setInsightsLoading(false);
            }
        };
        fetchInsights();
    }, [student.careerTarget]);

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>

            {selectedBadge && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={() => setSelectedBadge(null)}>
                    <div className="glass-card" style={{ padding: 32, width: 400, maxWidth: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedBadge(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 8 }}>
                            <X size={20} />
                        </button>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            <div style={{ width: 100, height: 100, borderRadius: 20, background: selectedBadge.color, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${selectedBadge.border}40`, marginBottom: 20 }}>
                                <Image src={trophyImg} alt={selectedBadge.title} width={64} height={64} style={{ objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                            </div>
                            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{selectedBadge.title}</h2>
                            <div style={{ padding: "4px 12px", background: "rgba(57, 211, 83, 0.1)", color: "#39d353", borderRadius: 100, fontSize: "0.8rem", fontWeight: 600, border: "1px solid rgba(57, 211, 83, 0.2)", marginBottom: 16 }}>
                                Awarded {selectedBadge.date}
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                                {selectedBadge.desc}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ANNOUNCEMENT BANNER */}
            <div style={{ background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))", border: "1px solid var(--border-color)", padding: "16px 24px", borderRadius: 16, marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Image src={mascotImg} alt="Mascot" width={48} height={48} style={{ borderRadius: "50%", border: "1px solid var(--border-light)" }} />
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span className="badge badge-orange" style={{ background: "transparent", border: "1px solid #FF8C00", color: "#FF8C00", fontSize: "0.7rem", padding: "2px 8px" }}>Weekly Contest</span>
                            <span style={{ fontWeight: 600, fontSize: "1rem" }}>CodeSprint 2026 starts in 2 days!</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>Register now to boost your global ranking and win exclusive badges.</p>
                    </div>
                </div>
                <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>Register <ChevronRight size={14} /></button>
            </div>

            {/* ===== PROFILE HEADER (GitHub Style) ===== */}
            <div className="glass-card" style={{ padding: "32px", marginBottom: 32, display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start", position: "relative" }}>
                {/* Badges positioned at top right — dynamic from student data */}
                <div style={{ position: "absolute", top: 24, right: 32, display: "flex", gap: 8 }}>
                    {student.badges.map((badge, i) => (
                        <div key={i} title={badge.title} style={{
                            width: 36, height: 36,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, rgba(255,255,255,0.1), ${badge.color}40)`,
                            border: `1px solid ${badge.color}80`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 0 10px ${badge.color}30`,
                            cursor: "pointer", transition: "transform 0.2s"
                        }} className="hover-scale" onClick={() => setSelectedBadge({ ...badge, border: badge.color })}>
                            <Award size={18} color={badge.color} style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.5))" }} />
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #A855F7)", border: "2px solid #39d353", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {platformStats?.github?.avatar ? (
                            <img src={platformStats.github.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <span style={{ fontSize: "4rem", color: "white", fontWeight: 700, fontFamily: "var(--font-serif)" }}>{student.name.charAt(0)}</span>
                        )}
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h1 style={{ fontFamily: "var(--font-primary)", fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>{student.name}</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "4px 0 0" }}>@{student.githubUsername}</p>
                    </div>
                    <button 
                        onClick={fetchPlatformStats}
                        disabled={syncing}
                        style={{ width: "100%", padding: "8px", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: 6, fontWeight: 500, cursor: "pointer", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                        {syncing ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                        {syncing ? "Syncing..." : "Sync Platforms"}
                    </button>
                </div>

                <div style={{ flex: 1, minWidth: 280, paddingTop: 16 }}>
                    <div style={{ display: "flex", gap: 24, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border-light)" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 4 }}>LC Rank</span>
                            <span style={{ fontSize: "1.6rem", fontFamily: "var(--font-primary)", color: "var(--text-primary)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                                {platformStats?.leetcode?.ranking ? platformStats.leetcode.ranking.toLocaleString() : student.leetcodeRank.toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 4 }}>Solved</span>
                            <span style={{ fontSize: "1.6rem", fontFamily: "var(--font-primary)", color: "var(--text-primary)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                                {platformStats?.leetcode?.totalSolved || student.projectsCompleted}
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 4 }}>GH Repos</span>
                            <span style={{ fontSize: "1.6rem", fontFamily: "var(--font-primary)", color: "var(--text-primary)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                                {platformStats?.github?.publicRepos || 0}
                            </span>
                        </div>
                    </div>

                    {/* Overall Heatmap (Aggregated from GitHub, LeetCode, SkillRack) */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Live Activity Feed</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                {platformStats?.github?.recentEvents?.length || 0} recent activities
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }} className="custom-scrollbar">
                            {platformStats?.github?.recentEvents?.map((ev: any, i: number) => (
                                <div key={i} style={{ background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-light)", minWidth: 180, flexShrink: 0 }}>
                                    <div style={{ fontSize: "0.75rem", color: "#39d353", marginBottom: 4 }}>{ev.type.replace("Event", "")}</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.repo}</div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{new Date(ev.date).toLocaleDateString()}</div>
                                </div>
                            ))}
                            {!platformStats?.github?.recentEvents?.length && <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No recent events found.</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== PLATFORM CONSISTENCY & WORK AREAS ===== */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, marginBottom: 48 }}>
                {/* Platform Consistency Heatmaps */}
                <div style={{
                    position: "relative",
                    background: "rgba(20, 20, 25, 0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 24,
                    padding: 32,
                    boxShadow: "0 24px 40px rgba(0,0,0,0.2)",
                    overflow: "hidden"
                }}>
                    {/* Background Glow */}
                    <div style={{ position: "absolute", right: -50, top: -50, width: 250, height: 250, background: "rgba(59, 130, 246, 0.15)", filter: "blur(70px)", borderRadius: "50%", pointerEvents: "none" }}></div>
                    <div style={{ position: "absolute", left: -50, bottom: -50, width: 200, height: 200, background: "rgba(57, 211, 83, 0.1)", filter: "blur(70px)", borderRadius: "50%", pointerEvents: "none" }}></div>

                    <h3 style={{ fontSize: "1.3rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 28, display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
                        <Activity size={22} color="#3B82F6" /> Consistency Engine
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative", zIndex: 2 }}>
                        {[
                            { name: "LeetCode", streak: platformStats?.leetcode?.streak || student.leetcodeStreak, suffix: "Day Streak", baseColor: "255, 161, 22" },
                            { name: "SkillRack", streak: student.skillrackStreak, suffix: "Day Streak", baseColor: "0, 184, 148" },
                            { name: "GitHub", streak: student.githubStreak, suffix: "Day Streak", baseColor: "57, 211, 83" }
                        ].map((plat, i) => (
                            <div key={i} style={{
                                background: "rgba(255,255,255,0.02)",
                                padding: "16px 20px",
                                borderRadius: 16,
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
                                    <span style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)" }}>{plat.name}</span>
                                    <span style={{ color: `rgb(${plat.baseColor})`, fontSize: "0.85rem", fontWeight: 600, padding: "2px 8px", background: `rgba(${plat.baseColor}, 0.1)`, border: `1px solid rgba(${plat.baseColor}, 0.2)`, borderRadius: 100 }}>
                                        {plat.streak} {plat.suffix}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", opacity: 0.9 }}>
                                    {Array.from({ length: 50 }).map((_, j) => {
                                        // Pseudo-random but consistent per platform
                                        const rand = (Math.sin((i+1)*(j+1)/5) + 1) / 2;
                                        const level = plat.name === "GitHub" ? (rand > 0.3 ? rand : 0) : (rand > 0.6 ? rand : 0);
                                        const opacity = level > 0.8 ? 1 : level > 0.5 ? 0.7 : level > 0.2 ? 0.4 : 0.1;
                                        const bg = level > 0 ? `rgba(${plat.baseColor}, ${opacity})` : "rgba(255,255,255,0.03)";
                                        return <div key={j} style={{ width: 10, height: 10, borderRadius: 2, background: bg }} />
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Areas Needed to Work (Clickable Card) */}
                <Link href="/dashboard/roadmap" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                    <div style={{
                        position: "relative",
                        background: "linear-gradient(135deg, rgba(63, 43, 150, 0.4), rgba(20, 20, 25, 0.8))",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(168, 192, 255, 0.15)",
                        borderRadius: 24,
                        padding: 32,
                        boxShadow: "0 24px 40px rgba(0,0,0,0.2)",
                        overflow: "hidden",
                        height: "100%",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.borderColor = "rgba(168, 192, 255, 0.4)";
                            e.currentTarget.style.boxShadow = "0 30px 50px rgba(63, 43, 150, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "rgba(168, 192, 255, 0.15)";
                            e.currentTarget.style.boxShadow = "0 24px 40px rgba(0,0,0,0.2)";
                        }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 250, height: 250, background: "rgba(168, 192, 255, 0.1)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none" }}></div>

                        <h3 style={{ fontSize: "1.3rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Sparkles size={22} color="#A8C0FF" /> Areas to Focus On</span>
                            <ChevronRight color="var(--text-secondary)" />
                        </h3>

                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 28, position: "relative", zIndex: 2 }}>
                            AI Analytics has identified these skill gaps in your current trajectory. Strengthen them to reach your goal.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 2 }}>
                            {student.skillGaps.length > 0 ? (
                                student.skillGaps.slice(0, 4).map((area: any, i: number) => (
                                    <div key={i} style={{
                                        background: "rgba(0,0,0,0.2)",
                                        padding: "16px",
                                        borderRadius: "16px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: 10, fontWeight: 500 }}>
                                            <span>{area.skill}</span>
                                            <span style={{ color: area.color }}>{area.score}% Proficiency</span>
                                        </div>
                                        <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 100, overflow: "hidden" }}>
                                            <div style={{ width: `${area.score}%`, height: "100%", background: area.color, borderRadius: 100 }} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No critical gaps analyzed yet. Connect more platforms to see insights.</div>
                            )}
                        </div>

                    </div>
                </Link>
            </div>

            {/* ===== GOALS & QUESTS (STITCH PREMIUM) ===== */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, marginBottom: 48 }}>

                {/* Semester To-Do List (Editable) */}
                <div style={{
                    position: "relative",
                    background: "rgba(20, 20, 25, 0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 24,
                    padding: 32,
                    boxShadow: "0 24px 40px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    display: "flex", flexDirection: "column"
                }}>
                    <div style={{ position: "absolute", left: -50, top: -50, width: 250, height: 250, background: "rgba(168, 85, 247, 0.1)", filter: "blur(70px)", borderRadius: "50%", pointerEvents: "none" }}></div>

                    <h3 style={{ fontSize: "1.3rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
                        <Target size={22} color="#A855F7" /> Targets for this Semester
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, position: "relative", zIndex: 2 }}>
                        Keep track of your immediate personal goals. Press <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>Enter</code> to add new items.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 2, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                            <Plus size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                onKeyDown={addTask}
                                placeholder="Add a new goal..."
                                style={{ background: "transparent", border: "none", color: "var(--text-primary)", outline: "none", width: "100%", fontSize: "0.95rem" }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, maxHeight: 180, overflowY: "auto", paddingRight: 8 }} className="custom-scrollbar">
                            {semesterTasks.map((task) => (
                                <div key={task.id} onClick={() => toggleTask(task.id)} style={{
                                    display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                                    padding: "12px 16px", borderRadius: 12,
                                    background: task.done ? "rgba(57, 211, 83, 0.05)" : "rgba(255,255,255,0.02)",
                                    border: `1px solid ${task.done ? "rgba(57, 211, 83, 0.2)" : "rgba(255,255,255,0.05)"}`,
                                    transition: "all 0.2s"
                                }} className="hover-scale">
                                    <div style={{ color: task.done ? "#39d353" : "var(--text-muted)", display: "flex", alignItems: "center" }}>
                                        {task.done ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </div>
                                    <span style={{ fontSize: "0.95rem", color: task.done ? "var(--text-secondary)" : "var(--text-primary)", textDecoration: task.done ? "line-through" : "none" }}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quests & Collectibles */}
                <div style={{
                    position: "relative",
                    background: "rgba(20, 20, 25, 0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 24,
                    padding: 32,
                    boxShadow: "0 24px 40px rgba(0,0,0,0.2)",
                    overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", right: -50, bottom: -50, width: 250, height: 250, background: "rgba(255, 215, 0, 0.1)", filter: "blur(70px)", borderRadius: "50%", pointerEvents: "none" }}></div>

                    <h3 style={{ fontSize: "1.3rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
                        <Award size={22} color="#FFD700" /> Active Quests
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24, position: "relative", zIndex: 2 }}>
                        Complete the following tasks to earn exclusive profile flags and limited-edition badges.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 2 }}>
                        {[
                            { title: "Review 10 GitHub PRs", reward: "Code Reviewer Flag", color: "#3B82F6", hint: "0/10 PRs" },
                            { title: "Participate in 2 Global Hackathons", reward: "Innovator Badge", color: "#FF8C00", hint: "1/2 Hacks" },
                            { title: "Hit 40 Day Streak on LeetCode", reward: "Consistency Champion", color: "#FFA116", hint: "14/40 Days" }
                        ].map((quest, i) => (
                            <div key={i} style={{
                                background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: 16,
                                border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}>
                                <div>
                                    <div style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 }}>{quest.title}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Award size={14} color={quest.color} />
                                        <span style={{ fontSize: "0.8rem", color: quest.color, fontWeight: 600 }}>{quest.reward}</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 100 }}>
                                    {quest.hint}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== EXPLORE PLATFORM ===== */}
            <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, marginBottom: 20, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Image src={logoImg} alt="logo" width={24} height={24} style={{ borderRadius: 6 }} /> Recommended Hubs
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                    {[
                        { id: "projects", icon: <Code2 size={24} />, title: "Projects & Hackathons", desc: "View your GitHub progress & events" },
                        { id: "roadmap", icon: <TrendingUp size={24} />, title: "Roadmap & Goals", desc: "Track goals, milestones & certificates" },
                        { id: "mentor", icon: <MessageSquare size={24} />, title: "AI Mentor", desc: "Get AI-generated career suggestions" },
                        { id: "certifications", icon: <FileText size={24} />, title: "My Certifications", desc: "Upload certificates & progress proofs" },
                        { id: "simulation", icon: <Activity size={24} />, title: "Career Simulator", desc: "Simulate probability of landing job" },
                        { id: "connect", icon: <Users size={24} />, title: "Alumni Connect", desc: "Talk to Alumni & book mentor meetings" }
                    ].map((card) => (
                        <Link key={card.id} href={`/dashboard/${card.id}`} style={{ textDecoration: "none" }}>
                            <div className="glass-panel hover-blue-green" style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column", background: "rgba(18, 22, 30, 0.4)", border: "1px solid var(--border-light)" }}>
                                <div style={{ marginBottom: 16, color: "var(--text-secondary)", transition: "color 0.2s" }}>{card.icon}</div>
                                <div style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 8 }}>{card.title}</div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{card.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* INTEGRATED FEED MODULE (YouTube & Blogs) via API */}
            <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, marginBottom: 20, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <PlayCircle size={24} color="var(--text-primary)" /> Daily Industry Insights
                </h3>

                {insightsLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Loading personalized insights from API...</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                        {insights.map((insight, i) => (
                            <div key={i} className="glass-card hover-blue-green" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                <div style={{ height: 160, position: "relative", overflow: "hidden", background: "var(--bg-tertiary)" }}>
                                    <img src={insight.thumbnail} alt={insight.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <div style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", borderRadius: 100, fontSize: "0.75rem", fontWeight: 600, color: "#fff", textTransform: "uppercase" }}>
                                        {insight.type}
                                    </div>
                                    {insight.type === "video" && (
                                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 48, height: 48, background: "rgba(220, 38, 38, 0.8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <PlayCircle size={24} color="#fff" />
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                                    <h4 style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 8, flex: 1 }}>{insight.title}</h4>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{insight.source}</span>
                                        <a href={insight.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "var(--accent-light)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                                            View <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
