"use client";
import { useState } from "react";
import { UploadCloud, CheckCircle2, FileText, FileBadge, Activity } from "lucide-react";

export default function CertificationsPage() {
    const [dragActive, setDragActive] = useState(false);

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 8 }}>
                    My <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Certifications</span>
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                    Maintain your timeline of achievements block by block. Upload your proofs here.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

                {/* Upload Section */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                        <UploadCloud size={20} color="var(--text-secondary)" />
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>Upload Proofs</h3>
                    </div>

                    <div className="stat-card" style={{ padding: 32, marginBottom: 24 }}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 8 }}>Select Proof Type</label>
                            <select className="input-field" style={{ width: "100%", padding: "12px", borderRadius: 8, background: "var(--bg-tertiary)", border: "1px solid var(--border-light)", color: "var(--text-primary)" }}>
                                <option>Course Certificate</option>
                                <option>Hackathon Award / Placement</option>
                                <option>Extracurricular Proof</option>
                                <option>Internship Offer Letter</option>
                            </select>
                        </div>

                        {/* Drag and Drop Area */}
                        <div
                            style={{
                                border: `2px dashed ${dragActive ? "var(--text-primary)" : "var(--border-light)"}`,
                                borderRadius: 12,
                                padding: 40,
                                textAlign: "center",
                                background: dragActive ? "var(--bg-tertiary)" : "transparent",
                                transition: "all 0.2s"
                            }}
                            onDragEnter={() => setDragActive(true)}
                            onDragLeave={() => setDragActive(false)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => setDragActive(false)}
                        >
                            <UploadCloud size={32} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
                            <div style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>Drag and drop your file here</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>PDF, JPG, PNG (Max 5MB)</div>
                            <button className="btn-primary">Browse Files</button>
                        </div>
                    </div>

                    <div style={{ padding: 24, background: "var(--bg-tertiary)", borderRadius: 12, border: "1px solid var(--border-light)" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 12 }}>Pending Verifications</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderBottom: "1px dashed var(--border-light)", paddingBottom: 10, marginBottom: 10 }}>
                            <span style={{ color: "var(--text-secondary)" }}>AWS Solutions Architect Certificate</span>
                            <span style={{ color: "var(--accent)" }}>Under Review</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                            <span style={{ color: "var(--text-secondary)" }}>SIH 2024 Finalist Certificate</span>
                            <span style={{ color: "var(--text-primary)" }}>Verified</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Feed */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                        <Activity size={20} color="var(--text-secondary)" />
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>Activity Feed</h3>
                    </div>

                    <div style={{ borderLeft: "2px solid var(--border-light)", marginLeft: 10, paddingLeft: 24, display: "flex", flexDirection: "column", gap: 32 }}>
                        {[
                            { title: "Uploaded Course Certificate", desc: "Deep Learning Specialization (Coursera)", time: "2 hours ago", icon: <FileBadge size={16} /> },
                            { title: "Goal Achieved", desc: "Maintained > 8.0 CGPA in Semester 5", time: "1 day ago", icon: <CheckCircle2 size={16} /> },
                            { title: "Updated System Design skills", desc: "Progress advanced to 45%", time: "3 days ago", icon: <Activity size={16} /> },
                            { title: "Uploaded Resume Version 2", desc: "ATS Score improved from 62% to 71%", time: "1 week ago", icon: <FileText size={16} /> },
                        ].map((log, i) => (
                            <div key={i} style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: -35, top: 0, width: 20, height: 20, borderRadius: "50%", background: "var(--bg-primary)", border: "2px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                                    {log.icon}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>{log.time}</div>
                                <div style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>{log.title}</div>
                                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{log.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
