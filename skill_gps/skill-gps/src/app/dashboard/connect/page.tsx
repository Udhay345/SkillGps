"use client";
import { Users, GraduationCap, MessagesSquare, Calendar, Link as LinkIcon, Star, CheckCircle2 } from "lucide-react";

export default function ConnectPage() {
    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 8 }}>
                    Alumni & <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Mentor Connect</span>
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                    Network with past graduates and schedule guided sessions with your faculty mentor.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>

                {/* Faculty Mentor Section */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                        <GraduationCap size={20} color="var(--text-secondary)" />
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>Assigned Faculty Mentor</h3>
                    </div>

                    <div className="stat-card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", border: "1px solid var(--border-light)" }}>
                                <span style={{ color: "var(--text-muted)" }}>Dr</span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>Dr. S. K. Mahapatra</h4>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Associate Professor - AI & Data Science Dept</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 6 }}>
                                    <Star size={12} fill="var(--text-secondary)" /> 4.8 Rating from students
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: 16, background: "var(--bg-tertiary)", borderRadius: 12, border: "1px solid var(--border-light)" }}>
                            <h5 style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 8 }}>Next Available Slots</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                    <span>Tuesday, 10:30 AM</span>
                                    <span style={{ color: "var(--accent)", cursor: "pointer" }}>Book Slot</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                    <span>Thursday, 02:00 PM</span>
                                    <span style={{ color: "var(--accent)", cursor: "pointer" }}>Book Slot</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <Calendar size={16} /> Schedule 1:1 Meeting
                        </button>
                    </div>
                </div>

                {/* Alumni Network */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                        <Users size={20} color="var(--text-secondary)" />
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>Alumni Network</h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            { name: "Sanjana Mehta", role: "Machine Learning Engineer @ Google", batch: "Batch of 2021", match: "98%" },
                            { name: "Rishabh Singh", role: "Data Scientist @ Amazon", batch: "Batch of 2022", match: "92%" },
                            { name: "Priya Das", role: "AI Researcher @ Microsoft", batch: "Batch of 2020", match: "89%" },
                        ].map((alumni, i) => (
                            <div key={i} className="stat-card" style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-tertiary)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                                        <span style={{ color: "var(--text-muted)" }}>{alumni.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                                            {alumni.name}
                                        </h4>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 2 }}>{alumni.role}</div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{alumni.batch} · <span style={{ color: "var(--accent)" }}>{alumni.match} Match</span></div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button style={{ background: "none", border: "1px solid var(--border-color)", padding: 8, borderRadius: 8, cursor: "pointer", color: "var(--text-secondary)" }}>
                                        <LinkIcon size={16} />
                                    </button>
                                    <button style={{ background: "none", border: "1px solid var(--border-color)", padding: 8, borderRadius: 8, cursor: "pointer", color: "var(--text-secondary)" }}>
                                        <MessagesSquare size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
