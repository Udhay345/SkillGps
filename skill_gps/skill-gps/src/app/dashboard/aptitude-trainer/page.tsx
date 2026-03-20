"use client";
import { useState, useEffect } from "react";
import { BrainCircuit, ChevronRight, CheckCircle2, XCircle, Loader2, Lightbulb, GraduationCap, ArrowRight, Award } from "lucide-react";

interface AptitudeQuestion {
    topic: string;
    difficulty: string;
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctAnswer: "A" | "B" | "C" | "D";
    explanation: string;
    conceptTip: string;
    nextTopic: string;
}

const TOPICS = [
    "Percentages", "Profit and Loss", "Time and Work", "Time and Distance",
    "Ratio and Proportion", "Probability", "Permutation and Combination",
    "Number Series", "Coding-Decoding", "Blood Relations", "Logical Puzzles",
    "Sentence Correction", "Reading Comprehension"
];

export default function AptitudeTrainerPage() {
    const [view, setView] = useState<"setup" | "quiz" | "result">("setup");
    const [topic, setTopic] = useState(TOPICS[0]);
    const [difficulty, setDifficulty] = useState("Medium");
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState<AptitudeQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [error, setError] = useState("");

    // Automatically adjust difficulty based on performance
    useEffect(() => {
        if (totalAnswered > 0) {
            const percentage = (score / totalAnswered) * 100;
            if (percentage < 40) setDifficulty("Easy");
            else if (percentage < 70) setDifficulty("Medium");
            else setDifficulty("Hard");
        }
    }, [score, totalAnswered]);

    const fetchQuestion = async (selectedTopic?: string) => {
        setIsLoading(true);
        setError("");
        setQuestion(null);
        setSelectedAnswer(null);
        setShowFeedback(false);

        try {
            const res = await fetch("/api/aptitude-trainer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    topic: selectedTopic || topic,
                    difficulty,
                    score: totalAnswered > 0 ? (score / totalAnswered) * 100 : 50
                }),
            });

            if (!res.ok) throw new Error("Failed to fetch question");
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            if (data.rawReply) throw new Error("AI returned invalid JSON");

            setQuestion(data);
            setView("quiz");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (ans: string) => {
        if (showFeedback) return;
        setSelectedAnswer(ans);
        setShowFeedback(true);
        setTotalAnswered(prev => prev + 1);
        if (ans === question?.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    return (
        <div style={{ paddingBottom: "60px", animation: "fade-in 0.5s ease" }}>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 20px; padding: 30px; box-shadow: 0 8px 30px rgba(0,0,0,0.05); }
                .option-btn {
                    padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-tertiary);
                    text-align: left; cursor: pointer; transition: all 0.2s ease; color: var(--text-primary); font-size: 1rem;
                    display: flex; align-items: center; justify-content: space-between; width: 100%;
                }
                .option-btn:hover:not(:disabled) { border-color: #3B82F6; background: rgba(59, 130, 246, 0.05); }
                .option-btn.selected { border-color: #3B82F6; background: rgba(59, 130, 246, 0.1); }
                .option-btn.correct { border-color: #10B981; background: rgba(16, 185, 129, 0.1); }
                .option-btn.wrong { border-color: #EF4444; background: rgba(239, 68, 68, 0.1); }
                .topic-badge { padding: 6px 12px; border-radius: 8px; background: rgba(59, 130, 246, 0.1); color: #3B82F6; font-size: 0.85rem; font-weight: 600; }
                .diff-badge { padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
                .diff-easy { background: rgba(16, 185, 129, 0.1); color: #10B981; }
                .diff-medium { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
                .diff-hard { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
                select, button:not(.option-btn) { cursor: pointer; }
            `}</style>

            <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                        AI Aptitude Trainer
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                        Personalized practice powered by AI to crack your dream job.
                    </p>
                </div>
                {totalAnswered > 0 && (
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>Success Rate</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3B82F6" }}>
                            {Math.round((score / totalAnswered) * 100)}%
                        </div>
                    </div>
                )}
            </div>

            {view === "setup" && (
                <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                        <div style={{ width: "64px", height: "64px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <BrainCircuit size={32} color="#3B82F6" />
                        </div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-primary)" }}>Select Your Practice Topic</h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "var(--text-secondary)" }}>Aptitude Topic</label>
                            <select 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: "1rem" }}
                            >
                                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Preferred Difficulty</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['Easy', 'Medium', 'Hard'].map(d => (
                                    <button 
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        style={{ 
                                            flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                                            background: difficulty === d ? '#3B82F6' : 'var(--bg-tertiary)',
                                            color: difficulty === d ? 'white' : 'var(--text-primary)',
                                            fontWeight: 600, transition: 'all 0.2s'
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <div style={{ color: "#EF4444", fontSize: "0.9rem", textAlign: "center" }}>⚠️ {error}</div>}

                        <button
                            onClick={() => fetchQuestion()}
                            disabled={isLoading}
                            style={{ 
                                marginTop: "10px", width: "100%", padding: "16px", background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", 
                                color: "white", borderRadius: "12px", border: "none", fontSize: "1.1rem", fontWeight: 700, 
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" 
                            }}
                        >
                            {isLoading ? <><Loader2 className="spin" /> Generating...</> : <><GraduationCap size={20} /> Start Practice</>}
                        </button>
                    </div>
                </div>
            )}

            {view === "quiz" && question && (
                <div style={{ display: 'grid', gridTemplateColumns: showFeedback ? '1fr 400px' : '1fr', gap: '30px', transition: 'all 0.3s ease' }}>
                    <div className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <span className="topic-badge">{question.topic}</span>
                                <span className={`diff-badge diff-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
                            </div>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Practice Session</span>
                        </div>

                        <h3 style={{ fontSize: "1.4rem", color: "var(--text-primary)", marginBottom: "30px", lineHeight: "1.6" }}>
                            {question.question}
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {Object.entries(question.options).map(([key, value]) => {
                                let btnClass = "option-btn";
                                if (showFeedback) {
                                    if (key === question.correctAnswer) btnClass += " correct";
                                    else if (key === selectedAnswer) btnClass += " wrong";
                                } else if (key === selectedAnswer) {
                                    btnClass += " selected";
                                }

                                return (
                                    <button
                                        key={key}
                                        className={btnClass}
                                        onClick={() => handleAnswer(key)}
                                        disabled={showFeedback}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ 
                                                width: "32px", height: "32px", borderRadius: "50%", 
                                                border: "1px solid var(--border-color)", display: "flex", 
                                                alignItems: "center", justifyContent: "center",
                                                background: key === selectedAnswer ? '#3B82F6' : 'transparent',
                                                color: key === selectedAnswer ? 'white' : 'var(--text-primary)',
                                                fontWeight: 700
                                            }}>
                                                {key}
                                            </div>
                                            {value}
                                        </span>
                                        {showFeedback && key === question.correctAnswer && <CheckCircle2 size={20} color="#10B981" />}
                                        {showFeedback && key === selectedAnswer && key !== question.correctAnswer && <XCircle size={20} color="#EF4444" />}
                                    </button>
                                );
                            })}
                        </div>

                        {showFeedback && (
                            <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
                                <button
                                    onClick={() => fetchQuestion()}
                                    style={{ 
                                        padding: "12px 24px", background: "#3B82F6", color: "white", 
                                        borderRadius: "10px", border: "none", fontWeight: 600, 
                                        display: "flex", alignItems: "center", gap: "8px" 
                                    }}
                                >
                                    Next Question <ArrowRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {showFeedback && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fade-in 0.5s ease' }}>
                            <div className="card" style={{ borderLeft: "4px solid #10B981" }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>
                                    <CheckCircle2 size={18} color="#10B981" /> Step-by-Step Solution
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {question.explanation}
                                </p>
                            </div>

                            <div className="card" style={{ borderLeft: "4px solid #F59E0B", background: 'rgba(245, 158, 11, 0.02)' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>
                                    <Lightbulb size={18} color="#F59E0B" /> Concept Tip
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    {question.conceptTip}
                                </p>
                            </div>

                            <div className="card" style={{ borderLeft: "4px solid #8B5CF6" }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>
                                    <Award size={18} color="#8B5CF6" /> Next Recommended Topic
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '15px' }}>
                                    Based on your performance, you should try <strong>{question.nextTopic}</strong>.
                                </p>
                                <button 
                                    onClick={() => {
                                        setTopic(question.nextTopic);
                                        fetchQuestion(question.nextTopic);
                                    }}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #8B5CF6', color: '#8B5CF6', background: 'transparent', fontWeight: 600 }}
                                >
                                    Practice {question.nextTopic}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isLoading && view === "quiz" && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                        <Loader2 className="spin" size={48} color="#3B82F6" style={{ margin: '0 auto 20px' }} />
                        <h3 style={{ color: 'var(--text-primary)' }}>Generating Next Question...</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>AI is curating a personalized challenge for you.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

