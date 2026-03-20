"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Code, Trophy, Search, Activity, Flame, Medal, CheckCircle2, TrendingUp } from "lucide-react";

export default function CodingTrackerPage() {
    const [leetcodeUser, setLeetcodeUser] = useState("");
    const [hackerrankUser, setHackerrankUser] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Using mock data initially; will be fetched from Spring Boot backend (e.g. http://localhost:8080/api/coding-stats)
    const [stats, setStats] = useState<any>(null);
    const [codeToReview, setCodeToReview] = useState("");
    const [mentorFeedback, setMentorFeedback] = useState<any>(null);
    const [isMentorLoading, setIsMentorLoading] = useState(false);
    const [mentorError, setMentorError] = useState("");

    const handleCodeReview = async () => {
        if (!codeToReview.trim()) return;
        setIsMentorLoading(true);
        setMentorError("");
        try {
            const res = await fetch("/api/coding-mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: codeToReview, language: "javascript" }),
            });
            if (!res.ok) throw new Error("Failed to get code review");
            const data = await res.json();
            setMentorFeedback(data);
        } catch (err) {
            setMentorError("Could not reach Coding Mentor.");
        } finally {
            setIsMentorLoading(false);
        }
    };

    const handleFetchStats = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Placeholder API call to Spring Boot backend
            // const response = await fetch(`http://localhost:8080/api/coding-stats/fetch?leetcode=${leetcodeUser}&hackerrank=${hackerrankUser}`);
            // const data = await response.json();

            // Mocking the API response for preview purposes
            setTimeout(() => {
                setStats({
                    leetcode: {
                        username: leetcodeUser || "Unknown",
                        solved: 245,
                        easy: 120,
                        medium: 100,
                        hard: 25,
                        ranking: 450212,
                        streak: 12,
                        badges: 3,
                    },
                    hackerrank: {
                        username: hackerrankUser || "Unknown",
                        solved: 180,
                        badges: ["Problem Solving (Gold)", "10 Days of JS (Silver)"],
                        ranking: 125034,
                        streak: 5,
                    },
                    history: [
                        { date: "Mon", solved: 5 },
                        { date: "Tue", solved: 12 },
                        { date: "Wed", solved: 8 },
                        { date: "Thu", solved: 15 },
                        { date: "Fri", solved: 10 },
                        { date: "Sat", solved: 22 },
                        { date: "Sun", solved: 30 },
                    ]
                });
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            console.error("Error fetching data from backend", error);
            setIsLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: "40px", animation: "fade-in 0.5s ease" }}>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.05);
                }
                .hero-gradient {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }
                .progress-bar-container {
                    width: 100%;
                    height: 8px;
                    background: var(--bg-tertiary);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 8px;
                }
                .stat-box {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
            `}</style>

            <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <Code color="#3B82F6" size={32} />
                        Coding Tracker
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                        Track your LeetCode and HackerRank progress in one place.
                    </p>
                </div>
            </div>

            {/* Input Form Section */}
            <div className="card" style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Search size={20} /> Link Your Accounts
                </h3>
                <form onSubmit={handleFetchStats} style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 300px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>LeetCode Username</label>
                        <input
                            type="text"
                            placeholder="e.g., neetcode"
                            value={leetcodeUser}
                            onChange={(e) => setLeetcodeUser(e.target.value)}
                            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                        />
                    </div>
                    <div style={{ flex: "1 1 300px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>HackerRank Username</label>
                        <input
                            type="text"
                            placeholder="e.g., john_doe"
                            value={hackerrankUser}
                            onChange={(e) => setHackerrankUser(e.target.value)}
                            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ height: "46px", padding: "0 24px", borderRadius: "10px", background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", color: "white", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", opacity: isLoading ? 0.7 : 1 }}
                        >
                            {isLoading ? "Fetching Data..." : "Sync Profiles"}
                        </button>
                    </div>
                </form>
            </div>

            {stats && (
                <div style={{ animation: "fade-in 0.5s ease" }}>
                    {/* Overall Streak & Analytics */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                        <div className="stat-box hero-gradient">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#F59E0B" }}>
                                <Flame size={20} /> <span style={{ fontWeight: 600 }}>Daily Streak</span>
                            </div>
                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                {Math.max(stats.leetcode.streak, stats.hackerrank.streak)} Days
                            </div>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Keep it up! 🔥</span>
                        </div>
                        <div className="stat-box">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10B981" }}>
                                <CheckCircle2 size={20} /> <span style={{ fontWeight: 600 }}>Total Solved</span>
                            </div>
                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                {stats.leetcode.solved + stats.hackerrank.solved}
                            </div>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Problems on all platforms</span>
                        </div>
                        <div className="stat-box">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#8B5CF6" }}>
                                <Medal size={20} /> <span style={{ fontWeight: 600 }}>Earned Badges</span>
                            </div>
                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                {stats.leetcode.badges + stats.hackerrank.badges.length}
                            </div>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Badges collected</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "30px" }}>
                        {/* LeetCode Details */}
                        <div className="card">
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" style={{ width: "32px", height: "32px", objectFit: "contain", filter: "invert(1) opacity(0.8)" }} />
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)" }}>LeetCode Stats</h3>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{stats.leetcode.username}</p>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                                        <span>Easy</span>
                                        <span style={{ color: "#10B981", fontWeight: 600 }}>{stats.leetcode.easy}</span>
                                    </div>
                                    <div className="progress-bar-container"><div style={{ width: `${(stats.leetcode.easy / stats.leetcode.solved) * 100}%`, height: "100%", background: "#10B981" }}></div></div>
                                </div>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                                        <span>Medium</span>
                                        <span style={{ color: "#F59E0B", fontWeight: 600 }}>{stats.leetcode.medium}</span>
                                    </div>
                                    <div className="progress-bar-container"><div style={{ width: `${(stats.leetcode.medium / stats.leetcode.solved) * 100}%`, height: "100%", background: "#F59E0B" }}></div></div>
                                </div>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                                        <span>Hard</span>
                                        <span style={{ color: "#EF4444", fontWeight: 600 }}>{stats.leetcode.hard}</span>
                                    </div>
                                    <div className="progress-bar-container"><div style={{ width: `${(stats.leetcode.hard / stats.leetcode.solved) * 100}%`, height: "100%", background: "#EF4444" }}></div></div>
                                </div>
                            </div>

                            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Global Ranking</p>
                                        <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{stats.leetcode.ranking.toLocaleString()}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Total Solved</p>
                                        <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{stats.leetcode.solved}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HackerRank Details */}
                        <div className="card">
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <div style={{ width: "32px", height: "32px", background: "#00EA64", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#111" }}>H</div>
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)" }}>HackerRank Stats</h3>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{stats.hackerrank.username}</p>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                                {stats.hackerrank.badges.map((badge: string, idx: number) => (
                                    <div key={idx} style={{ padding: "12px 16px", background: "var(--bg-primary)", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "12px" }}>
                                        <Trophy size={18} color="#F59E0B" />
                                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{badge}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Global Ranking</p>
                                        <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{stats.hackerrank.ranking.toLocaleString()}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Total Solved</p>
                                        <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{stats.hackerrank.solved}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="card">
                        <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <TrendingUp size={20} color="#3B82F6" /> Coding Activity (Past 7 Days)
                        </h3>
                        <div style={{ width: "100%", height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.history}>
                                    <defs>
                                        <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-secondary)" tick={{ fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", borderRadius: "10px", color: "var(--text-primary)" }}
                                        itemStyle={{ color: "#3B82F6" }}
                                    />
                                    <Area type="monotone" dataKey="solved" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSolved)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Coding Mentor Section */}
            <div className="card" style={{ marginTop: "30px" }}>
                <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Activity size={20} color="#8B5CF6" /> AI Coding Mentor
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "20px" }}>
                    Paste your code snippet below for an AI-powered review and optimization tips.
                </p>
                <div style={{ position: "relative" }}>
                    <textarea
                        value={codeToReview}
                        onChange={(e) => setCodeToReview(e.target.value)}
                        placeholder="// Paste your code here..."
                        rows={8}
                        style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "monospace", fontSize: "0.95rem", resize: "none" }}
                    />
                    <button
                        onClick={handleCodeReview}
                        disabled={isMentorLoading || !codeToReview.trim()}
                        style={{ marginTop: "12px", padding: "10px 24px", borderRadius: "10px", background: "#8B5CF6", color: "white", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                        {isMentorLoading ? "Analyzing..." : "Review My Code"}
                    </button>
                </div>

                {mentorError && <div style={{ marginTop: "16px", color: "#EF4444" }}>{mentorError}</div>}

                {mentorFeedback && (
                    <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div style={{ padding: "20px", background: "rgba(139, 92, 246, 0.05)", borderRadius: "12px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                            <h4 style={{ fontSize: "1rem", color: "#8B5CF6", marginBottom: "12px", fontWeight: 600 }}>Mentor Feedback</h4>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{mentorFeedback.feedback}</p>
                        </div>
                        <div style={{ padding: "20px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                            <h4 style={{ fontSize: "1rem", color: "#10B981", marginBottom: "12px", fontWeight: 600 }}>Optimizations</h4>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{mentorFeedback.optimization}</p>
                            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                                <span style={{ fontSize: "0.85rem", color: "#F59E0B", fontWeight: 600 }}>Suggested Exercise:</span>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "4px 0 0" }}>{mentorFeedback.suggestedExercise}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
