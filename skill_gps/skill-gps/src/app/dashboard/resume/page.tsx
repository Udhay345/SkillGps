"use client";
import { useState } from "react";
import { resumeScore } from "@/lib/data";
import { CheckCircle2, AlertCircle, FileText, UploadCloud, TrendingUp, Sparkles, LayoutPanelLeft } from "lucide-react";

export default function ResumePage() {
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");

    const handleUpload = async () => {
        setAnalyzing(true);
        setError("");
        try {
            // In a real app, we'd extract text from the PDF.
            // For this demo, we'll simulate text extraction.
            const sampleText = "Experienced developer with React, Node.js and SQL knowledge.";
            
            const res = await fetch("/api/resume-optimizer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText: sampleText }),
            });

            if (!res.ok) throw new Error("Failed to analyze resume");
            const data = await res.json();
            
            setResults(data);
            setShowResults(true);
            setUploadedFile("My_Resume.pdf");
        } catch (err) {
            setError("Failed to connect to AI service.");
        } finally {
            setAnalyzing(false);
        }
    };

    const overallColor = results?.overall >= 75 ? "#2563EB" : results?.overall >= 55 ? "#FF8C00" : "#ef4444";

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
            {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: 12, borderRadius: 8, marginBottom: 20 }}>⚠️ {error}</div>}
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 8 }}>
                    Resume <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>Optimizer</span>
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                    ATS score breakdowns, live suggestions, and AI rewrites.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

                {/* Column 1: Upload & Overall Score */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                    {/* Upload Card */}
                    <div className="stat-card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}><FileText size={20} /> Current Resume</h3>
                            {uploadedFile && <span className="badge">Analyzed</span>}
                        </div>
                        {uploadedFile ? (
                            <div style={{ padding: 16, background: "var(--bg-tertiary)", borderRadius: 12, border: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <span style={{ fontSize: "0.95rem", color: "var(--accent)", fontWeight: 500 }}>{uploadedFile}</span>
                                <CheckCircle2 size={18} color="#22c55e" />
                            </div>
                        ) : (
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>No resume uploaded. Upload a PDF to get ATS feedback.</p>
                        )}
                        <button onClick={handleUpload} className="btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", gap: 8 }}>
                            {analyzing ? "Analyzing Document..." : <><UploadCloud size={16} /> Upload New Version</>}
                        </button>
                    </div>

                    {/* Overall Score Card */}
                    {showResults && results && (
                        <div className="stat-card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 16 }}>ATS Match Probability</h3>

                            <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: `conic-gradient(${overallColor} ${results.overall}%, var(--bg-tertiary) ${results.overall}% 100%)`, marginBottom: 16 }}>
                                <div style={{ width: 120, height: 120, background: "var(--bg-secondary)", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 500, color: "var(--text-primary)" }}>{results.overall}%</span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Score</span>
                                </div>
                            </div>

                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 20 }}>
                                Based on AI analysis of your skills and target industry standards.
                            </p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}>
                                <div style={{ background: "var(--bg-primary)", padding: 12, borderRadius: 8, border: "1px solid var(--border-light)" }}>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)" }}>{results.atsScore}%</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Raw ATS Parse</div>
                                </div>
                                <div style={{ background: "var(--bg-primary)", padding: 12, borderRadius: 8, border: "1px solid var(--border-light)" }}>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)" }}>{results.suggestions.length}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Action Items</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Column 2: Breakdowns & Tips */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                    {/* Section Breakdown */}
                    {showResults && results && (
                        <div className="stat-card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><LayoutPanelLeft size={20} /> Section Breakdown</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {results.breakdown.map((item: any) => (
                                    <div key={item.category}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                            <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{item.category}</span>
                                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: item.score >= 80 ? "#22c55e" : item.score >= 50 ? "#FF8C00" : "#ef4444" }}>{item.score}%</span>
                                        </div>
                                        <div style={{ height: 6, background: "var(--bg-tertiary)", borderRadius: 10 }}>
                                            <div style={{ width: `${item.score}%`, height: "100%", background: item.score >= 80 ? "#22c55e" : item.score >= 50 ? "#FF8C00" : "#ef4444", borderRadius: 10 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Improvement Suggestions */}
                    {showResults && results && (
                        <div className="stat-card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={20} /> AI Recommendations</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {results.suggestions.map((tip: string, i: number) => (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, background: "var(--bg-tertiary)", border: "1px solid var(--border-light)", borderRadius: 8 }}>
                                        <AlertCircle size={16} color={i < 2 ? "#ef4444" : "#FF8C00"} style={{ marginTop: 2, flexShrink: 0 }} />
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{tip}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
