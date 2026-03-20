"use client";
import { useState, useEffect, useCallback } from "react";
import { careerSimulation, sampleStudent } from "@/lib/data";

type SimFactor = { id: string; label: string; icon: string; current: number; max: number; impactPerUnit: number; unit: string };

export default function SimulationPage() {
    const [values, setValues] = useState<Record<string, number>>(() =>
        Object.fromEntries(careerSimulation.factors.map((f) => [f.id, f.current]))
    );
    const [animatedProbability, setAnimatedProbability] = useState(careerSimulation.baselineProbability);

    const computeProbability = useCallback((vals: Record<string, number>) => {
        let bonus = 0;
        careerSimulation.factors.forEach((f) => {
            const delta = vals[f.id] - f.current;
            bonus += delta * f.impactPerUnit;
        });
        return Math.min(99, Math.max(careerSimulation.baselineProbability, careerSimulation.baselineProbability + bonus));
    }, []);

    useEffect(() => {
        const newProb = computeProbability(values);

        // Animate number
        const start = animatedProbability;
        const end = newProb;
        const steps = 20;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            setAnimatedProbability(start + ((end - start) * step) / steps);
            if (step >= steps) clearInterval(timer);
        }, 20);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const handleSlider = (id: string, val: number) => {
        setValues((prev) => ({ ...prev, [id]: val }));
    };

    const reset = () => {
        setValues(Object.fromEntries(careerSimulation.factors.map((f) => [f.id, f.current])));
    };

    const gain = Math.round(animatedProbability) - careerSimulation.baselineProbability;

    const getColor = (prob: number) => {
        if (prob >= 80) return "#00D4FF";
        if (prob >= 65) return "#0066FF";
        if (prob >= 50) return "#FF8C00";
        return "#FF6B00";
    };

    const probColor = getColor(animatedProbability);

    const ROLE_THRESHOLDS = [
        { role: "Junior Developer", threshold: 30, icon: "" },
        { role: "ML Engineer", threshold: 55, icon: "" },
        { role: "AI Engineer", threshold: 70, icon: "" },
        { role: "Senior AI Engineer", threshold: 85, icon: "" },
        { role: "AI Architect", threshold: 95, icon: "" },
    ];

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <span className="badge badge-orange" style={{ marginBottom: 12, display: "inline-flex" }}> Career Simulation</span>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: 6 }}>
                    Simulate Your <span className="text-gradient-orange">Career Path</span>
                </h1>
                <p style={{ color: "var(--white-muted)" }}>
                    Drag the sliders to add achievements and watch your probability score update in real time
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                {/* Left – Sliders */}
                <div>
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>Add Achievements</h3>
                            <button
                                onClick={reset}
                                style={{ background: "transparent", border: "1px solid transparent", color: "var(--orange-primary)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                            >
                                Reset
                            </button>
                        </div>

                        {careerSimulation.factors.map((factor: SimFactor) => {
                            const val = values[factor.id];
                            const pct = ((val - factor.current) / (factor.max - factor.current)) * 100;
                            const impact = Math.round((val - factor.current) * factor.impactPerUnit);

                            return (
                                <div key={factor.id} style={{ marginBottom: 28 }}>
                                    {/* Label */}
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: "1.3rem" }}>{factor.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{factor.label}</div>
                                                <div style={{ color: "var(--white-muted)", fontSize: "0.75rem" }}>
                                                    Current: {factor.current} {factor.unit}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: val > factor.current ? "#00D4FF" : "var(--white-muted)" }}>
                                                {val}
                                            </div>
                                            {impact > 0 && (
                                                <div style={{ color: "#00D4FF", fontSize: "0.72rem", fontWeight: 700 }}>
                                                    +{impact}% boost
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Slider */}
                                    <div style={{ position: "relative" }}>
                                        {/* Track bg */}
                                        <div style={{ height: 6, borderRadius: 3, background: "var(--bg-tertiary)", position: "relative", marginBottom: 4 }}>
                                            {/* Current marker */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    left: `${(factor.current / factor.max) * 100}%`,
                                                    top: -3,
                                                    width: 2,
                                                    height: 12,
                                                    background: "rgba(255,255,255,0.3)",
                                                    borderRadius: 1,
                                                }}
                                            />
                                            {/* Fill */}
                                            <div
                                                style={{
                                                    height: "100%",
                                                    borderRadius: 3,
                                                    background: val > factor.current
                                                        ? "transparent"
                                                        : "rgba(255,255,255,0.1)",
                                                    width: `${(val / factor.max) * 100}%`,
                                                    transition: "width 0.1s",
                                                }}
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min={factor.current}
                                            max={factor.max}
                                            value={val}
                                            onChange={(e) => handleSlider(factor.id, Number(e.target.value))}
                                            className="custom-slider"
                                            style={{ position: "absolute", top: -3, left: 0, right: 0, opacity: 0, cursor: "pointer", height: 12 }}
                                        />
                                        {/* Custom slider visual */}
                                        <input
                                            type="range"
                                            min={factor.current}
                                            max={factor.max}
                                            value={val}
                                            onChange={(e) => handleSlider(factor.id, Number(e.target.value))}
                                            style={{
                                                width: "100%",
                                                height: 6,
                                                borderRadius: 3,
                                                appearance: "none",
                                                background: "var(--bg-tertiary)",
                                                outline: "none",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.72rem", color: "var(--white-subtle)" }}>
                                            <span>{factor.current} (current)</span>
                                            <span>{factor.max} (max)</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right – Probability + Mascot */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Probability Card */}
                    <div
                        className="glass-card"
                        style={{
                            padding: 28,
                            textAlign: "center",
                            border: `1px solid ${probColor}30`,
                            background: `${probColor}06`,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${probColor}08, transparent)`, pointerEvents: "none" }} />

                        <div style={{ fontSize: "0.8rem", color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            AI Engineer Readiness
                        </div>

                        {/* Big probability ring */}
                        <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 16px" }}>
                            <svg width="160" height="160" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="68"
                                    fill="none"
                                    stroke={probColor}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 68}`}
                                    strokeDashoffset={`${2 * Math.PI * 68 * (1 - animatedProbability / 100)}`}
                                    transform="rotate(-90 80 80)"
                                    style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.5s ease" }}
                                />
                                <defs>
                                    <linearGradient id="simGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00D4FF" />
                                        <stop offset="100%" stopColor={probColor} />
                                    </linearGradient>
                                </defs>
                                <text x="80" y="72" textAnchor="middle" fill="white" fontSize="30" fontWeight="800" fontFamily="Syne">
                                    {Math.round(animatedProbability)}%
                                </text>
                                <text x="80" y="92" textAnchor="middle" fill="#6B7A99" fontSize="11">
                                    Ready
                                </text>
                                {gain > 0 && (
                                    <text x="80" y="108" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="700">
                                        +{gain}% gained!
                                    </text>
                                )}
                            </svg>
                        </div>

                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>
                            {sampleStudent.careerTarget}
                        </div>
                        {gain > 0 && (
                            <div style={{ color: "#00D4FF", fontSize: "0.85rem", fontWeight: 700 }}>
                                ↑ {gain}% from baseline ({careerSimulation.baselineProbability}%)
                            </div>
                        )}
                    </div>

                    {/* Role progression */}
                    <div className="glass-card" style={{ padding: 20 }}>
                        <h3 style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 14, color: "var(--white-muted)" }}>
                            Role Progression
                        </h3>
                        {ROLE_THRESHOLDS.map((r) => (
                            <div
                                key={r.role}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "8px 0",
                                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                                    opacity: animatedProbability >= r.threshold ? 1 : 0.4,
                                }}
                            >
                                <span style={{ fontSize: "1rem" }}>{r.icon}</span>
                                <div style={{ flex: 1, fontSize: "0.82rem", fontWeight: 500 }}>{r.role}</div>
                                <div style={{ fontSize: "0.75rem", color: animatedProbability >= r.threshold ? "#00D4FF" : "var(--white-subtle)", fontWeight: 700 }}>
                                    {r.threshold}%+
                                </div>
                                {animatedProbability >= r.threshold && (
                                    <span style={{ color: "#00D4FF", fontSize: "0.9rem" }}></span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mascot */}
                    <div style={{ display: "flex", justifyContent: "center" }}>

                    </div>
                </div>
            </div>
        </div>
    );
}
