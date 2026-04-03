"use client";
import { useState, useRef } from "react";
import { CheckCircle2, AlertCircle, FileText, UploadCloud, TrendingUp, Sparkles, LayoutPanelLeft, Target, Briefcase, Search, Copy, Check } from "lucide-react";

export default function ResumePage() {
    const [resumeText, setResumeText] = useState("");
    const [targetRole, setTargetRole] = useState("Software Engineer");
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fileLoading, setFileLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFile(file.name);
        setError("");

        if (file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = (event) => setResumeText(event.target?.result as string || "");
            reader.readAsText(file);
        } else if (file.type === "application/pdf") {
            setFileLoading(true);
            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/pdf-to-text", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Failed to parse PDF");
                const { text } = await res.json();
                setResumeText(text);
            } catch (err) {
                setError("Failed to extract text from PDF. Please copy-paste the content instead.");
            } finally {
                setFileLoading(false);
            }
        } else {
            setError("Unsupported file format. Please use .pdf or .txt, or paste the text directly.");
        }
    };

    const handleAnalysis = async () => {
        if (resumeText.trim().length < 50) {
            setError("Resume text must be at least 50 characters long.");
            return;
        }
        setAnalyzing(true);
        setError("");
        try {
            const res = await fetch("/api/resume-optimizer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText, targetRole }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to analyze resume");
            }
            const data = await res.json();
            
            setResults(data);
            setShowResults(true);
        } catch (err: any) {
            setError(err.message || "Failed to connect to AI service.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(results?.rewrittenSummary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const overallColor = results?.overall >= 75 ? "#10B981" : results?.overall >= 55 ? "#F59E0B" : "#ef4444";

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: "80px", animation: "fadeIn 0.5s ease" }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .input-group { margin-bottom: 24px; }
                .input-label { display: block; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); marginBottom: 8px; }
                .text-area { 
                    width: 100%; 
                    min-height: 200px; 
                    padding: 16px; 
                    background: var(--bg-secondary); 
                    border: 1px solid var(--border-color); 
                    border-radius: 12px; 
                    color: var(--text-primary); 
                    font-family: inherit; 
                    font-size: 0.95rem; 
                    lineHeight: 1.6; 
                    transition: border-color 0.2s;
                }
                .text-area:focus { border-color: var(--accent); outline: none; }
                .keyword-tag { 
                    padding: 4px 12px; 
                    background: rgba(59, 130, 246, 0.1); 
                    border: 1px solid rgba(59, 130, 246, 0.2); 
                    color: #3B82F6; 
                    border-radius: 100px; 
                    font-size: 0.8rem; 
                    font-weight: 500; 
                }
            `}</style>

            {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "12px 16px", borderRadius: 8, marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem" }}>
                <AlertCircle size={18} /> {error}
            </div>}

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                    Resume <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--text-secondary)" }}>Optimizer</span>
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                    ATS score breakdowns, live suggestions, and AI-powered profile rewrites.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: showResults ? "1fr 1fr" : "1fr", gap: 32, alignItems: "start" }}>

                {/* Input Section */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div className="stat-card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                                <FileText size={20} color="var(--accent)" /> Input Details
                            </h3>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Target Role</label>
                            <div style={{ position: "relative" }}>
                                <Briefcase size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                                <select 
                                    value={targetRole} 
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    style={{ width: "100%", padding: "12px 12px 12px 40px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", borderRadius: 10, appearance: "none" }}
                                >
                                    {["Software Engineer", "AI Engineer", "Data Scientist", "Frontend Developer", "Backend Developer", "Product Manager", "UI/UX Designer"].map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                                <label className="input-label" style={{ marginBottom: 0 }}>Resume Content</label>
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                    <UploadCloud size={14} /> Import File
                                </button>
                                <input type="file" ref={fileInputRef} hidden accept=".txt,.pdf" onChange={handleFileChange} />
                            </div>
                            <textarea 
                                className="text-area"
                                placeholder={fileLoading ? "// Extracting text from PDF (one moment)..." : "// Paste your resume content here... (Tip: Upload PDF/TXT for auto-extraction)"}
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                disabled={fileLoading}
                            />
                            {uploadedFile && (
                                <p style={{ fontSize: "0.8rem", color: "#10B981", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                                    <CheckCircle2 size={12} /> {uploadedFile}
                                </p>
                            )}
                        </div>

                        <button 
                            onClick={handleAnalysis} 
                            className="btn-primary" 
                            disabled={analyzing || !resumeText.trim()}
                            style={{ width: "100%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "white", padding: 14, borderRadius: 10, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", justifyContent: "center", gap: 8, opacity: (analyzing || !resumeText.trim()) ? 0.7 : 1 }}
                        >
                            {analyzing ? "AI is Analyzing..." : <><TrendingUp size={18} /> Analyze Optimization</>}
                        </button>
                    </div>

                    {!showResults && (
                         <div style={{ padding: 24, border: "1px dashed var(--border-color)", borderRadius: 16, textAlign: "center" }}>
                            <Search size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Provide your resume content to see the breakdown.</p>
                         </div>
                    )}
                </div>

                {/* Results Section */}
                {showResults && results && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        
                        {/* Overall Match */}
                        <div className="stat-card" style={{ padding: 24, display: "flex", gap: 24, alignItems: "center" }}>
                            <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: `conic-gradient(${overallColor} ${results.overall}%, var(--bg-tertiary) ${results.overall}% 100%)`, flexShrink: 0 }}>
                                <div style={{ width: 84, height: 84, background: "var(--bg-secondary)", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{results.overall}%</span>
                                    <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Match</span>
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>ATS Fit Score</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                    Based on your match for the **{targetRole}** role. {results.overall > 70 ? "Excellent work! Your resume is highly optimized." : "There's room for improvement to beat the ATS bots."}
                                </p>
                            </div>
                        </div>

                        {/* Rewritten Summary */}
                        <div className="stat-card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                                    <Sparkles size={18} color="#F59E0B" /> Optimized Summary
                                </h3>
                                <button 
                                    onClick={handleCopy}
                                    style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}
                                >
                                    {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <div style={{ padding: 16, background: "var(--bg-primary)", borderRadius: 10, border: "1px solid var(--border-light)", fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.6 }}>
                                "{results.rewrittenSummary}"
                            </div>
                        </div>

                        {/* Missing Keywords */}
                        <div className="stat-card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <Target size={18} color="#ef4444" /> Missing Keywords
                            </h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {results.missingKeywords?.map((keyword: string) => (
                                    <span key={keyword} className="keyword-tag">{keyword}</span>
                                ))}
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="stat-card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><LayoutPanelLeft size={18} /> Section Strength</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {results.breakdown.map((item: any) => (
                                    <div key={item.category}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                            <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{item.category}</span>
                                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: item.score >= 80 ? "#10B981" : item.score >= 50 ? "#F59E0B" : "#ef4444" }}>{item.score}%</span>
                                        </div>
                                        <div style={{ height: 6, background: "var(--bg-tertiary)", borderRadius: 10 }}>
                                            <div style={{ width: `${item.score}%`, height: "100%", background: item.score >= 80 ? "#10B981" : item.score >= 50 ? "#F59E0B" : "#ef4444", borderRadius: 10, transition: "width 0.5s ease" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="stat-card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Actionable Recommendations</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {results.suggestions.map((tip: string, i: number) => (
                                    <div key={i} style={{ display: "flex", gap: 10, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                        <span style={{ color: "var(--accent)", fontWeight: 700 }}>•</span>
                                        {tip}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

