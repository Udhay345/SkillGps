"use client";
import { useState } from "react";
import { User, Calendar, CheckSquare, MessagesSquare, FileText, CheckCircle2 } from "lucide-react";

export default function MentorPage() {
    const [aiFeedback, setAiFeedback] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAIReview = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/mentor-guide", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: "S101" }), // Mock ID
            });
            if (!res.ok) throw new Error("Failed to get AI review");
            const data = await res.json();
            setAiFeedback(data);
        } catch (err) {
            setError("Could not reach AI mentor.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 8 }}>
                    Mentor <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Guide</span>
                </h1>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                    Monthly review schedules, verified faculty feedbacks, and actionable suggestions.
                </p>
            </div>

            {/* Horizontal Grid Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>

                {/* Column 1: Mentor Profile & Schedule */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                    {/* Faculty Profile */}
                    <div className="stat-card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border-color)", marginBottom: 16 }}>
                            <User size={32} color="var(--text-secondary)" />
                        </div>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Dr. S. K. Mahapatra</h2>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 16px" }}>Associate Professor - CS Dept</p>

                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                                <MessagesSquare size={14} /> Message
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Counseling Slot */}
                    <div className="stat-card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <Calendar size={20} color="var(--accent)" />
                            <h3 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Next Scheduled Counseling</h3>
                        </div>
                        <div style={{ padding: 16, background: "rgba(37,99,235,0.05)", borderRadius: 12, border: "1px solid rgba(37,99,235,0.2)" }}>
                            <div style={{ fontSize: "0.85rem", color: "var(--accent)", textTransform: "uppercase", fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>Post-CAT 2 Review</div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                                <span>Nov 20, 2026</span>
                                <span>11:00 AM</span>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 12, marginBottom: 0 }}>
                                * Student must present their GitHub repository updates and CAT 2 marks.
                            </p>
                        </div>
                        <button 
                            onClick={handleAIReview}
                            disabled={isLoading}
                            style={{ marginTop: 20, padding: "10px 20px", borderRadius: "10px", background: "var(--accent)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                        >
                            <MessagesSquare size={18} /> {isLoading ? "Consulting AI..." : "Ask AI Mentor for Review"}
                        </button>
                    </div>

                </div>

                {/* Column 2: Feedback & Counseling Records */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                    {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: 12, borderRadius: 8, marginBottom: 20 }}>⚠️ {error}</div>}

                    <div className="stat-card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                            <FileText size={20} color="var(--text-primary)" />
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)" }}>Counseling Records & Feedback</h3>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* AI Record if exists */}
                            {aiFeedback && (
                                <div style={{ padding: 20, background: "rgba(139, 92, 246, 0.05)", borderRadius: 12, border: "1px solid rgba(139, 92, 246, 0.2)", marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                        <div>
                                            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#8B5CF6" }}>AI Academic Guidance</div>
                                            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>Generated: Just now</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#8B5CF6", fontWeight: 600, padding: "4px 10px", background: "rgba(139, 92, 246, 0.1)", borderRadius: 100 }}>
                                            AI Assistant
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>AI Feedback:</span>
                                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5, padding: 12, background: "var(--bg-secondary)", borderRadius: 8, borderLeft: "3px solid #8B5CF6" }}>
                                            "{aiFeedback.feedback}"
                                        </p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Assigned AI Tasks:</span>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                                            {aiFeedback.assignedTasks.map((t: any, i: number) => (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: t.status === 'completed' ? "var(--text-muted)" : "var(--text-secondary)", textDecoration: t.status === 'completed' ? "line-through" : "none" }}>
                                                    <CheckSquare size={16} color={t.status === 'completed' ? "#22c55e" : "var(--text-muted)"} />
                                                    {t.task}
                                                    <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: t.status === 'completed' ? "#22c55e" : "#8B5CF6" }}>{t.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 16, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                        <b>Suggested Follow-up:</b> {aiFeedback.nextMeeting}
                                    </div>
                                </div>
                            )}

                            {/* Record 1 */}
                            <div style={{ padding: 20, background: "var(--bg-tertiary)", borderRadius: 12, border: "1px solid var(--border-light)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Post-CAT 1 Assessment Review</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>Conducted on: Oct 15, 2026</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#22c55e", fontWeight: 600, padding: "4px 10px", background: "rgba(34,197,94,0.1)", borderRadius: 100 }}>
                                        <CheckCircle2 size={14} /> Verified by Faculty
                                    </div>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Faculty Feedback:</span>
                                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5, padding: 12, background: "var(--bg-secondary)", borderRadius: 8, borderLeft: "3px solid var(--accent)" }}>
                                        &quot;Excellent internal scores so far. However, your coding streak has dropped. I suggest completing 3 Graph Data Structure problems before next review. Also, attend the upcoming Tech Talk.&quot;
                                    </p>
                                </div>

                                <div>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Assigned Tasks:</span>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                            <CheckSquare size={16} color="var(--text-muted)" />
                                            Solve 3 LeetCode Graph Problems
                                            <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--accent)" }}>Pending</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                                            <CheckSquare size={16} color="#22c55e" />
                                            Register for Google Cloud Workshop
                                            <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#22c55e" }}>Completed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Record 2 */}
                            <div style={{ padding: 20, background: "var(--bg-tertiary)", borderRadius: 12, border: "1px solid var(--border-light)", opacity: 0.8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Semester Orientation</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>Conducted on: Aug 05, 2026</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#22c55e", fontWeight: 600, padding: "4px 10px", background: "rgba(34,197,94,0.1)", borderRadius: 100 }}>
                                        <CheckCircle2 size={14} /> Verified by Faculty
                                    </div>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Faculty Feedback:</span>
                                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5, padding: 12, background: "var(--bg-secondary)", borderRadius: 8, borderLeft: "3px solid var(--accent)" }}>
                                        &quot;Goals are set clearly. Prioritize AWS Cloud practitioner by December.&quot;
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
