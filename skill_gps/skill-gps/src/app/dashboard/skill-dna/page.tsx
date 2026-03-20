"use client";
import { useState, useEffect } from "react";
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from "recharts";
import { skillDNA } from "@/lib/data";

const TRAIT_DETAILS: Record<string, { desc: string; tips: string[]; color: string }> = {
    Analytical: {
        color: "#00D4FF",
        desc: "Your ability to break down complex problems and interpret data patterns.",
        tips: ["Solve 3 data puzzles weekly", "Take a Statistics course", "Practice data interpretation"],
    },
    Technical: {
        color: "#0066FF",
        desc: "Your coding, system building, and tool-usage proficiency.",
        tips: ["Build 2 more GitHub projects", "Learn system design basics", "Contribute to open source"],
    },
    Creative: {
        color: "#FF8C00",
        desc: "Your ability to think outside the box and innovate new solutions.",
        tips: ["Participate in hackathons", "Design a personal project", "Study UX/UI principles"],
    },
    Leadership: {
        color: "#FF6B00",
        desc: "Your ability to guide teams, manage projects, and influence decisions.",
        tips: ["Lead a team project", "Join a student club", "Mentor a junior student"],
    },
    Communication: {
        color: "#00B4CC",
        desc: "How effectively you express ideas verbally, in writing, and in presentations.",
        tips: ["Write 1 tech blog/month", "Present at a seminar", "Practice mock interviews"],
    },
    "Problem Solving": {
        color: "#0099FF",
        desc: "Your structured approach to identifying, analyzing, and resolving challenges.",
        tips: ["Solve 5 LeetCode problems/week", "Study algorithms deeply", "Join competitive programming"],
    },
};

export default function SkillDNAPage() {
    const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
    const [animatedValues, setAnimatedValues] = useState(skillDNA.traits.map(() => 0));
    const [mascotMood, setMascotMood] = useState<"celebrate" | "thinking" | "excited" | "idle">("idle");
    const [mascotMsg, setMascotMsg] = useState("Your Skill DNA is unique to you!  Let's decode what makes you powerful.");

    useEffect(() => {
        // Animate radar chart values
        let step = 0;
        const timer = setInterval(() => {
            step++;
            setAnimatedValues(skillDNA.traits.map((t) => Math.min(t.value, Math.floor((t.value * step) / 40))));
            if (step >= 40) clearInterval(timer);
        }, 30);
        setTimeout(() => {
            setMascotMood("celebrate");
            setMascotMsg("Your Technical score is 85%! You're a born builder  Let's strengthen your weak areas too!");
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const chartData = skillDNA.traits.map((t, i) => ({ ...t, value: animatedValues[i] }));

    const selected = selectedTrait ? TRAIT_DETAILS[selectedTrait] : null;
    const selectedTraitData = skillDNA.traits.find((t) => t.skill === selectedTrait);

    const getTraitComment = (val: number) => {
        if (val >= 80) return { label: "Expert", color: "#00D4FF" };
        if (val >= 60) return { label: "Proficient", color: "#0066FF" };
        if (val >= 40) return { label: "Developing", color: "#FF8C00" };
        return { label: "Beginner", color: "#FF3B3B" };
    };

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span className="badge badge-cyan"> Skill DNA</span>
                </div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: 6 }}>
                    Your Skill <span className="text-gradient-cyan">DNA</span>
                </h1>
                <p style={{ color: "var(--white-muted)" }}>
                    Your unique competency fingerprint across 6 core dimensions
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Left – Radar Chart */}
                <div>
                    {/* Dominant DNA badge */}
                    <div
                        className="glass-card-cyan"
                        style={{ padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}
                    >
                        <div style={{ fontSize: "2.5rem" }}></div>
                        <div>
                            <div style={{ fontSize: "0.75rem", color: "var(--cyan-primary)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
                                Your Dominant DNA
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800 }}>
                                {skillDNA.dominant}
                            </div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>

                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div
                        className="glass-card"
                        style={{ padding: 24, height: 380, position: "relative" }}
                    >
                        {/* Glow rings behind chart */}
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 280,
                                height: 280,
                                borderRadius: "50%",
                                background: "radial-gradient(circle, transparent, transparent 70%)",
                                pointerEvents: "none",
                            }}
                        />
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={chartData} outerRadius={120}>
                                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                                <PolarAngleAxis
                                    dataKey="skill"
                                    tick={{ fill: "#A8B4CC", fontSize: 12, fontFamily: "Space Grotesk", fontWeight: 600 }}
                                    onClick={(e: { value: string }) => {
                                        setSelectedTrait(e.value);
                                        setMascotMood("thinking");
                                        setMascotMsg(`Let me analyze your ${e.value} traits... `);
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                                <Radar
                                    name="Your Skills"
                                    dataKey="value"
                                    stroke="#00D4FF"
                                    fill="transparent"
                                    fillOpacity={1}
                                    strokeWidth={2}
                                    dot={{ r: 5, fill: "#00D4FF", strokeWidth: 0 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "#111318",
                                        border: "1px solid transparent",
                                        borderRadius: 10,
                                        color: "white",
                                        fontSize: "0.85rem",
                                    }}
                                    formatter={(val: unknown) => [`${val}%`, "Score"] as [string, string]}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Mascot message */}
                    <div style={{ marginTop: 16 }}>

                    </div>
                </div>

                {/* Right – trait list + detail */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Trait list */}
                    <div className="glass-card" style={{ padding: 20 }}>
                        <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 16 }}>
                            Click a trait to explore ↓
                        </h3>
                        {skillDNA.traits.map((trait, i) => {
                            const detail = TRAIT_DETAILS[trait.skill];
                            const comment = getTraitComment(trait.value);
                            return (
                                <div
                                    key={trait.skill}
                                    onClick={() => {
                                        setSelectedTrait(trait.skill);
                                        setMascotMood(trait.value >= 70 ? "celebrate" : "thinking");
                                        setMascotMsg(
                                            trait.value >= 70
                                                ? `Wow! Your ${trait.skill} score is amazing at ${trait.value}%! `
                                                : `Your ${trait.skill} is at ${trait.value}%. Let's level it up together! `
                                        );
                                    }}
                                    style={{
                                        padding: "12px 14px",
                                        borderRadius: 12,
                                        marginBottom: 8,
                                        background: selectedTrait === trait.skill ? `${detail.color}10` : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${selectedTrait === trait.skill ? `${detail.color}40` : "rgba(255,255,255,0.05)"}`,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{trait.skill}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: "0.75rem", color: comment.color, fontWeight: 700 }}>
                                                {comment.label}
                                            </span>
                                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: detail.color, fontSize: "1rem" }}>
                                                {animatedValues[i]}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            style={{
                                                height: "100%",
                                                borderRadius: 3,
                                                background: "var(--bg-tertiary)",
                                                width: `${animatedValues[i]}%`,
                                                transition: "width 0.05s linear",
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trait detail card */}
                    {selected && selectedTrait && (
                        <div
                            className="glass-card"
                            style={{
                                padding: 20,
                                border: `1px solid ${selected.color}30`,
                                background: `${selected.color}06`,
                                animation: "slideInUp 0.3s ease",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                <h3 style={{ fontWeight: 700, color: selected.color, fontSize: "1rem" }}>
                                    {selectedTrait}
                                </h3>
                                <span
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "2rem",
                                        fontWeight: 800,
                                        color: selected.color,
                                    }}
                                >
                                    {selectedTraitData?.value}%
                                </span>
                            </div>
                            <p style={{ color: "var(--white-muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 14 }}>
                                {selected.desc}
                            </p>
                            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--white-secondary)", marginBottom: 8 }}>
                                 Improvement Tips:
                            </div>
                            {selected.tips.map((tip, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 8,
                                        marginBottom: 6,
                                        fontSize: "0.82rem",
                                        color: "var(--white-muted)",
                                    }}
                                >
                                    <span style={{ color: selected.color, marginTop: 1 }}>→</span>
                                    {tip}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
