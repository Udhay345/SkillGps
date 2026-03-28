"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Shield } from "lucide-react";
import { useStudent } from "@/lib/StudentContext";

type Message = { id: number; text: string; sender: "user" | "bot"; timestamp: string };

export default function ChatPage() {
    const { student } = useStudent();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `Hello ${student.name.split(" ")[0]}! 👋 I'm your Skill GPS AI Career Mentor powered by Gemini AI. I have full context of your profile — your **${student.cgpa} CGPA**, **${student.leetcodeStreak}-day LeetCode streak**, and your goal to become a **${student.careerTarget}**. I can also tell you exactly which areas need improvement based on your skill gap data. What would you like help with today?`,
            sender: "bot",
            timestamp: "Just now",
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatMessage = (text: string) => {
        // Simple markdown-like formatting for **bold** and newlines
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const msgText = input.trim();
        const userMsg: Message = { id: Date.now(), text: msgText, sender: "user", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // Build conversation history (exclude system first message)
            const apiMessages = messages.slice(1).concat(userMsg).map(m => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.text,
            }));
            // Add current message
            apiMessages.push({ role: "user", content: msgText });

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    studentProfile: student,   // send full profile for context
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        text: data.reply,
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    }
                ]);
            } else {
                throw new Error("API error");
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Sorry, I'm having trouble connecting to the AI service. Please ensure the backend server is running on port 5000.",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const SUGGESTION_CHIPS = [
        `What's my current CGPA?`,
        `Which skills should I work on first?`,
        `How can I improve my career probability?`,
        `Review my semester goals`,
        `What projects should I build?`,
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", position: "relative", animation: "fadeIn 0.5s ease" }}>

            {/* Header */}
            <div style={{ marginBottom: 24, padding: "24px", background: "var(--bg-tertiary)", borderRadius: 16, border: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: 4 }}>
                        Chat with <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Gemini AI</span>
                    </h1>
                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                        Context-aware AI powered by Gemini 1.5 Flash — mapped directly to your Skill DNA.
                    </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(37,99,235,0.1)", borderRadius: 100, border: "1px solid rgba(37,99,235,0.2)" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
                        <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>Online · Context Synced</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        <Shield size={12} color="#39d353" />
                        Your data is private and secure
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="stat-card" style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-secondary)", borderRadius: 16, overflow: "hidden" }}>

                {/* Messages Container */}
                <div style={{ flex: 1, padding: 32, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{ display: "flex", gap: 16, alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                            {msg.sender === "bot" && (
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--accent)" }}>
                                    <Bot size={20} color="var(--accent)" />
                                </div>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                                <div style={{
                                    padding: "16px 20px",
                                    background: msg.sender === "user" ? "var(--accent)" : "var(--bg-tertiary)",
                                    color: msg.sender === "user" ? "#FFFFFF" : "var(--text-primary)",
                                    borderRadius: msg.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.6,
                                    border: msg.sender === "bot" ? "1px solid var(--border-light)" : "none",
                                    boxShadow: msg.sender === "user" ? "0 4px 14px var(--accent-glow)" : "none",
                                    whiteSpace: "pre-wrap",
                                }}
                                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                                />
                                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 8px" }}>{msg.timestamp}</span>
                            </div>
                            {msg.sender === "user" && (
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: "1rem", color: "white" }}>
                                    {student.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: "flex", gap: 16, alignSelf: "flex-start", maxWidth: "80%" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--accent)" }}>
                                <Bot size={20} color="var(--accent)" />
                            </div>
                            <div style={{
                                padding: "16px 20px", background: "var(--bg-tertiary)", color: "var(--text-primary)",
                                borderRadius: "20px 20px 20px 4px", fontSize: "0.95rem", lineHeight: 1.5,
                                border: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8
                            }}>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Gemini AI is thinking</span>
                                {[0, 0.2, 0.4].map((delay, i) => (
                                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: `${delay}s` }} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: 20, background: "var(--bg-tertiary)", borderTop: "1px solid var(--border-color)" }}>
                    {/* Suggestion Chips */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 16, overflowX: "auto", paddingBottom: 8 }}>
                        {SUGGESTION_CHIPS.map((chip, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(chip)}
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", padding: "8px 16px", borderRadius: 100, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--accent)" }}>
                            <Sparkles size={20} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask about your CGPA, skills, projects, career path..."
                            style={{
                                width: "100%",
                                padding: "16px 60px 16px 48px",
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: 12,
                                color: "var(--text-primary)",
                                fontSize: "1rem",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            style={{
                                position: "absolute",
                                right: 8, top: 8, bottom: 8,
                                background: input.trim() && !isLoading ? "var(--accent)" : "transparent",
                                color: input.trim() && !isLoading ? "#FFF" : "var(--text-muted)",
                                border: "none",
                                borderRadius: 8,
                                padding: "0 20px",
                                cursor: input.trim() && !isLoading ? "pointer" : "default",
                                transition: "all 0.2s",
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 10, textAlign: "center" }}>
                        🔒 Powered by Gemini AI • Your personal data is never shared with other users
                    </p>
                </div>
            </div>
        </div>
    );
}
