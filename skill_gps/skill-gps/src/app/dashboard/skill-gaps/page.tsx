"use client";
import { useState } from "react";
import { skillGaps } from "@/lib/data";
import { CheckCircle2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

export default function SkillGapsPage() {
    const [closedGaps, setClosedGaps] = useState<number[]>([]);

    const activeGaps = skillGaps.filter((g) => !closedGaps.includes(g.id));
    const resolvedGaps = skillGaps.filter((g) => closedGaps.includes(g.id));

    const toggleGap = (id: number) => {
        if (closedGaps.includes(id)) {
            setClosedGaps(closedGaps.filter((g) => g !== id));
        } else {
            setClosedGaps([...closedGaps, id]);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 8 }}>
                    Skill <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Gaps</span>
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                    Identify and address your weak points to maximize job readiness.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

                {/* Active Gaps */}
                <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                        <AlertCircle size={20} color="var(--accent)" /> Active Gaps ({activeGaps.length})
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {activeGaps.map((gap) => (
                            <div key={gap.id} className="stat-card" style={{ padding: 24, borderLeft: `4px solid ${gap.impactColor}` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>{gap.skill}</h3>
                                    <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: 100, background: "var(--bg-tertiary)", color: gap.impactColor, fontWeight: 600 }}>
                                        {gap.impact} Priority
                                    </span>
                                </div>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 16 }}>{gap.careerImpact}</p>

                                <div style={{ padding: "12px", background: "var(--bg-tertiary)", borderRadius: 8, marginBottom: 16 }}>
                                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>Recommendation:</span>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>{gap.learningPath[0]}</div>
                                </div>

                                <button onClick={() => toggleGap(gap.id)} className="btn-primary" style={{ width: "100%", padding: 10, fontSize: "0.85rem", display: "flex", justifyContent: "center", gap: 8 }}>
                                    <CheckCircle2 size={16} /> Mark as Resolved
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resolved Gaps */}
                <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckCircle2 size={20} color="#22c55e" /> Resolved Gaps ({resolvedGaps.length})
                    </h2>

                    {resolvedGaps.length === 0 ? (
                        <div style={{ padding: 40, textAlign: "center", background: "var(--bg-tertiary)", borderRadius: 16, border: "1px dashed var(--border-light)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            No gaps resolved yet. Keep pushing!
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {resolvedGaps.map((gap) => (
                                <div key={gap.id} className="stat-card" style={{ padding: 20, opacity: 0.7, border: "1px solid #22c55e30", background: "var(--bg-secondary)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                        <h3 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)", textDecoration: "line-through" }}>{gap.skill}</h3>
                                        <CheckCircle2 size={18} color="#22c55e" />
                                    </div>
                                    <button onClick={() => toggleGap(gap.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}>
                                        Re-open gap
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
