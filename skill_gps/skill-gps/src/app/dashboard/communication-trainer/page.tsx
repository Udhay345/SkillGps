"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Bot, Send, Loader2, CheckCircle2, BookOpen, Volume2, TrendingUp, Star, Lightbulb, RefreshCw } from "lucide-react";

// Browser Speech Recognition type declarations
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface GrammarMistake { error: string; explanation: string; }
interface VocabImprovement { original: string; better: string; reason: string; }
interface PronunciationTip { word: string; tip: string; }
interface Scores { grammar: number; fluency: number; vocabulary: number; pronunciation: number; confidence: number; }

interface FeedbackResult {
    correctSentence: string;
    grammarMistakes: GrammarMistake[];
    vocabularyImprovement: VocabImprovement[];
    fluencyFeedback: string;
    pronunciationTips: PronunciationTip[];
    scores: Scores;
    professionalVersion: string;
    practiceSuggestion: string;
    conversationalResponse: string;
    followUpQuestion: string;
    rawReply?: string;
}

const SAMPLE_PROMPTS = [
    "I'm very much interested for this job role.",
    "I was worked in a company before for two year.",
    "Can you explain me about the projects you did?",
    "I want to improve my communication skill for interviews.",
];

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
    return (
        <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color }}>{score}/10</span>
            </div>
            <div style={{ height: "8px", background: "var(--bg-tertiary)", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ width: `${score * 10}%`, height: "100%", background: color, borderRadius: "100px", transition: "width 1s ease" }} />
            </div>
        </div>
    );
}

export default function CommunicationTrainerPage() {
    const [sentence, setSentence] = useState("");
    const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [history, setHistory] = useState<{ sentence: string; overallScore: number; date: string }[]>([
        { sentence: "Junior Developer Interview", overallScore: 85, date: "Mar 11th" },
        { sentence: "Daily Greeting Practice", overallScore: 72, date: "Mar 10th" },
    ]);

    // ===== Voice Input (Hugging Face Whisper) =====
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await handleVoiceProcess(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError("");
        } catch (err) {
            setError("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleVoiceProcess = async (blob: Blob) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("audio", blob, "recording.wav");

            const res = await fetch("http://localhost:5000/api/asr", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Voice processing failed");
            const data = await res.json();

            if (data.text) {
                setSentence(data.text);
                handleAnalyze(data.text);
            }
        } catch (err) {
            setError("Failed to process voice. Please try typing instead.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) stopRecording();
        else startRecording();
    };

    const overallScore = feedback?.scores
        ? Math.round((feedback.scores.grammar + feedback.scores.fluency + feedback.scores.vocabulary + feedback.scores.pronunciation + feedback.scores.confidence) / 5 * 10)
        : 0;

    const handleAnalyze = async (inputSentence?: string) => {
        const target = (inputSentence || sentence).trim();
        if (!target) return;
        setIsLoading(true);
        setError("");
        setFeedback(null);

        try {
            const res = await fetch("/api/communication-trainer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sentence: target }),
            });

            const data: FeedbackResult = await res.json();

            if (!res.ok || data.rawReply) {
                setError(data.rawReply || "AI service temporarily unavailable. Please try again.");
                return;
            }

            setFeedback(data);
            setHistory(prev => [{
                sentence: target.slice(0, 40) + (target.length > 40 ? "..." : ""),
                overallScore: Math.round((data.scores.grammar + data.scores.fluency + data.scores.vocabulary + data.scores.pronunciation + data.scores.confidence) / 5 * 10),
                date: "Just now"
            }, ...prev.slice(0, 4)]);
        } catch {
            setError("Failed to connect to AI service. Please make sure the backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: "60px", animation: "fade-in 0.5s ease" }}>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 70% { box-shadow: 0 0 0 14px rgba(139,92,246,0); } 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); } }
                .card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 20px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .section-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
                .tag { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 0.78rem; font-weight: 600; }
                .tag-red { background: rgba(239,68,68,0.12); color: #EF4444; }
                .tag-green { background: rgba(16,185,129,0.12); color: #10B981; }
                .tag-blue { background: rgba(59,130,246,0.12); color: #3B82F6; }
                .sample-chip { padding: 8px 14px; border-radius: 100px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-secondary); font-size: 0.82rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .sample-chip:hover { border-color: #8B5CF6; color: #8B5CF6; background: rgba(139,92,246,0.06); }
                .analyze-btn { padding: 14px 28px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 1rem; transition: all 0.3s; box-shadow: 0 4px 18px rgba(139,92,246,0.35); }
                .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,92,246,0.45); }
                .analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .chat-bubble { padding: 20px; border-radius: 15px; background: var(--bg-tertiary); border: 1px solid var(--border-color); position: relative; margin-bottom: 24px; }
                .chat-bubble::after { content: ''; position: absolute; left: 20px; bottom: -10px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid var(--bg-tertiary); }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Mic size={22} color="white" />
                    </div>
                    AI Communication Trainer
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
                    Speak or type — your AI coach will provide real-time conversational feedback and professional analysis.
                </p>
            </div>

            {/* Input Section */}
            <div className="card" style={{ marginBottom: "28px" }}>
                <div className="section-title">
                    <Bot size={18} color="#6366F1" /> Coach Interaction
                </div>

                {/* Sample prompts */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {SAMPLE_PROMPTS.map((p, i) => (
                        <button key={i} className="sample-chip" onClick={() => { setSentence(p); }}>
                            "{p.slice(0, 35)}…"
                        </button>
                    ))}
                </div>

                <div style={{ position: "relative" }}>
                    <textarea
                        value={sentence}
                        onChange={(e) => setSentence(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAnalyze(); }}
                        placeholder='Speak your thoughts here... (Ctrl+Enter to send)'
                        rows={3}
                        style={{
                            width: "100%", padding: "16px", paddingRight: "60px", borderRadius: "12px",
                            border: "1.5px solid var(--border-color)", background: "var(--bg-primary)",
                            color: "var(--text-primary)", fontSize: "1.1rem", resize: "none",
                            outline: "none", fontFamily: "inherit", lineHeight: 1.6,
                            transition: "border-color 0.2s", boxSizing: "border-box"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#8B5CF6"}
                        onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
                    />

                    <button
                        onClick={toggleRecording}
                        title={isRecording ? "Stop Recording" : "Start Recording"}
                        style={{
                            position: "absolute", top: "12px", right: "12px",
                            width: "40px", height: "40px", borderRadius: "50%",
                            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            background: isRecording ? "rgba(239, 68, 68, 0.1)" : "rgba(139, 92, 246, 0.1)",
                            color: isRecording ? "#EF4444" : "#8B5CF6",
                            transition: "all 0.3s",
                            animation: isRecording ? "pulse-ring 1.5s ease-out infinite" : "none"
                        }}
                    >
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "16px" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        {feedback && (
                            <button onClick={() => { setFeedback(null); setSentence(""); setError(""); }}
                                style={{ padding: "12px 20px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
                                <RefreshCw size={16} /> New Session
                            </button>
                        )}
                        <button className="analyze-btn" disabled={!sentence.trim() || isLoading} onClick={() => handleAnalyze()}>
                            {isLoading ? <><Loader2 size={18} className="spin" style={{ animation: "spin 1s linear infinite" }} /> Thinking...</> : <><Send size={18} /> Send Message</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Feedback Results */}
            {feedback && !isLoading && (
                <div style={{ animation: "fade-in 0.5s ease" }}>

                    {/* Conversational Part */}
                    <div style={{ marginBottom: "40px" }}>
                        <div className="chat-bubble">
                            <p style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.6 }}>
                                {feedback.conversationalResponse}
                            </p>
                            <p style={{ margin: 0, marginTop: "12px", fontSize: "1.05rem", color: "#6366F1", fontWeight: 600 }}>
                                {feedback.followUpQuestion}
                            </p>
                        </div>
                    </div>

                    {/* Score Overview */}
                    <div className="card" style={{ marginBottom: "24px", background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
                            <div>
                                <div className="section-title"><Star size={18} color="#F59E0B" /> Communication Score</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                                    <span style={{ fontSize: "4rem", fontWeight: 800, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{overallScore}</span>
                                    <span style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>/100</span>
                                </div>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Based on 5 key communication metrics</p>
                            </div>
                            <div style={{ flex: 1, minWidth: "260px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                                    <ScoreBar label="Grammar" score={feedback.scores.grammar} color="#10B981" />
                                    <ScoreBar label="Fluency" score={feedback.scores.fluency} color="#3B82F6" />
                                    <ScoreBar label="Vocabulary" score={feedback.scores.vocabulary} color="#8B5CF6" />
                                    <ScoreBar label="Confidence" score={feedback.scores.confidence} color="#6366F1" />
                                    <ScoreBar label="Pronunciation" score={feedback.scores.pronunciation} color="#F59E0B" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        {/* Correct Sentence */}
                        <div className="card">
                            <div className="section-title"><CheckCircle2 size={18} color="#10B981" /> Better Grammar</div>
                            <p style={{ color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: 1.6, padding: "14px 16px", background: "rgba(16,185,129,0.06)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.15)", borderLeft: "4px solid #10B981", margin: 0 }}>
                                "{feedback.correctSentence}"
                            </p>
                        </div>

                        {/* Professional Version */}
                        <div className="card">
                            <div className="section-title"><TrendingUp size={18} color="#6366F1" /> Professional Version</div>
                            <p style={{ color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: 1.6, padding: "14px 16px", background: "rgba(99,102,241,0.06)", borderRadius: "10px", border: "1px solid rgba(99,102,241,0.15)", borderLeft: "4px solid #6366F1", margin: 0 }}>
                                "{feedback.professionalVersion}"
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        {/* Grammar Mistakes */}
                        <div className="card">
                            <div className="section-title"><BookOpen size={18} color="#EF4444" /> Grammar Pitfalls</div>
                            {feedback.grammarMistakes.length === 0 ? (
                                <p style={{ color: "#10B981", fontWeight: 500 }}>✅ No grammar mistakes found! Great job.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {feedback.grammarMistakes.map((m, i) => (
                                        <div key={i} style={{ padding: "12px 14px", background: "var(--bg-primary)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                                            <span className="tag tag-red" style={{ marginBottom: "6px" }}>{m.error}</span>
                                            <p style={{ margin: 0, marginTop: "6px", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{m.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vocabulary */}
                        <div className="card">
                            <div className="section-title"><Star size={18} color="#8B5CF6" /> Vocabulary Boosters</div>
                            {feedback.vocabularyImprovement.length === 0 ? (
                                <p style={{ color: "#10B981", fontWeight: 500 }}>✅ Good vocabulary usage!</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {feedback.vocabularyImprovement.map((v, i) => (
                                        <div key={i} style={{ padding: "12px 14px", background: "var(--bg-primary)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                                <span className="tag tag-red">"{v.original}"</span>
                                                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>→</span>
                                                <span className="tag tag-green">"{v.better}"</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>{v.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        {/* Fluency */}
                        <div className="card">
                            <div className="section-title"><Mic size={18} color="#3B82F6" /> Fluency & Flow</div>
                            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>{feedback.fluencyFeedback}</p>
                        </div>

                        {/* Pronunciation */}
                        <div className="card">
                            <div className="section-title"><Volume2 size={18} color="#F59E0B" /> Pronunciation Check</div>
                            {feedback.pronunciationTips.length === 0 ? (
                                <p style={{ color: "#10B981", fontWeight: 500 }}>✅ Clear pronunciation detected.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {feedback.pronunciationTips.map((p, i) => (
                                        <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 14px", background: "var(--bg-primary)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                                            <span className="tag tag-blue" style={{ flexShrink: 0 }}>{p.word}</span>
                                            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)" }}>{p.tip}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Practice Suggestion */}
                    <div className="card" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(99,102,241,0.06) 100%)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <div className="section-title"><Lightbulb size={18} color="#F59E0B" /> Homework: Speaking Practice</div>
                        <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1.7 }}>{feedback.practiceSuggestion}</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div style={{ padding: "16px 20px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#EF4444", marginBottom: "24px", fontSize: "0.95rem" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Past Analysis Reports */}
            <div className="card" style={{ marginTop: "28px" }}>
                <div className="section-title"><TrendingUp size={18} color="#3B82F6" /> Past Progress Logs</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {history.map((report, idx) => (
                        <div key={idx} style={{ background: "var(--bg-tertiary)", padding: "14px 18px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border-light)" }}>
                            <div>
                                <div style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "3px", fontSize: "0.95rem" }}>{report.sentence}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{report.date}</div>
                            </div>
                            <div style={{ background: report.overallScore > 75 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: report.overallScore > 75 ? '#10B981' : '#F59E0B', padding: "6px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                                {report.overallScore}/100
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

