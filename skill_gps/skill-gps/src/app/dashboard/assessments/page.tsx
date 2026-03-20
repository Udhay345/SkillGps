"use client";
import { useState } from "react";
import { Calendar, CheckCircle2, AlertCircle, PieChart, Activity, FileCheck, CheckSquare, Target } from "lucide-react";

export default function AssessmentsPage() {
    return (
        <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 8 }}>
                    Academic <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Assessments</span>
                </h1>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1rem" }}>
                    Track your CAT schedules, internal calculations, and attendance metrics.
                </p>
            </div>

            {/* Horizontal Grid Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* Column 1: Attendance & Schedule */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                    {/* Attendance Percentage So Far */}
                    <div className="glass-panel" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                <CheckSquare size={20} color="var(--text-secondary)" />
                                <h3 style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Overall Attendance</h3>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Target: 85% to attend Placements.</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", color: "var(--accent)" }}>88%</div>
                            <div style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: 600 }}>Safe Zone</div>
                        </div>
                    </div>

                    {/* CAT Schedule */}
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <Calendar size={20} color="var(--text-secondary)" />
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Upcoming CAT Schedule</h3>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Date & Time</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { subject: "Advanced Data Structures", date: "Nov 12, 2026", time: "09:30 AM", type: "CAT 2" },
                                        { subject: "Machine Learning Concepts", date: "Nov 14, 2026", time: "01:30 PM", type: "CAT 2" },
                                        { subject: "Database Systems", date: "Nov 16, 2026", time: "09:30 AM", type: "CAT 2" }
                                    ].map((exam, i) => (
                                        <tr key={i}>
                                            <td style={{ fontWeight: 500 }}>{exam.subject}</td>
                                            <td>
                                                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{exam.date}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{exam.time}</div>
                                            </td>
                                            <td><div className="badge" style={{ background: "rgba(37,99,235,0.1)", color: "var(--accent)", border: "none" }}>{exam.type}</div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Column 2: Marks & Internals */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                    {/* Previous CAT Marks */}
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <FileCheck size={20} color="var(--text-secondary)" />
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Previous CAT 1 Performance</h3>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { subject: "Advanced Data Structures", total: 50, scored: 45 },
                                { subject: "Machine Learning Concepts", total: 50, scored: 38 },
                                { subject: "Database Systems", total: 50, scored: 42 }
                            ].map((res, i) => (
                                <div key={i}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: 6 }}>
                                        <span>{res.subject}</span>
                                        <span style={{ fontWeight: 600 }}>{res.scored} <span style={{ color: "var(--text-muted)" }}>/ {res.total}</span></span>
                                    </div>
                                    <div style={{ height: 6, background: "var(--bg-tertiary)", borderRadius: 4, overflow: "hidden" }}>
                                        <div style={{ width: `${(res.scored / res.total) * 100}%`, height: "100%", background: (res.scored / res.total) > 0.8 ? "#22c55e" : "var(--accent)" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Internals Calculations */}
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <PieChart size={20} color="var(--text-secondary)" />
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>Internals Calculation (Out of 40)</h3>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>
                            Projected internal scores based on CAT 1, given assignments, and attendance baseline.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                            {[
                                { subject: "Adv DS", cat1: 15, assign: 10, atten: 5, total: 30 },
                                { subject: "ML Concepts", cat1: 12, assign: 8, atten: 5, total: 25 },
                            ].map((proj, i) => (
                                <div key={i} style={{ padding: 16, background: "var(--bg-tertiary)", borderRadius: 12, border: "1px solid var(--border-light)" }}>
                                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>{proj.subject}</h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>CAT 1</span> <span>{proj.cat1}/15</span></div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Assign</span> <span>{proj.assign}/10</span></div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Atten</span> <span>{proj.atten}/5</span></div>
                                    </div>
                                    <div style={{ borderTop: "1px dashed var(--border-color)", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                        <span>Total</span>
                                        <span>{proj.total}/30</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 16, fontSize: "0.75rem", color: "var(--accent)" }}>
                            * Remaining 10 points are allocated to CAT 2 exams.
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
