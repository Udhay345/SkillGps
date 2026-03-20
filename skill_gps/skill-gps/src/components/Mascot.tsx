"use client";
import React, { useState, useEffect } from "react";

type MascotMood = "idle" | "celebrate" | "thinking" | "wave" | "sad" | "excited";

interface MascotProps {
    mood?: MascotMood;
    message?: string;
    size?: "sm" | "md" | "lg";
    showMessage?: boolean;
}

export default function Mascot({
    mood = "idle",
    message,
    size = "md",
    showMessage = true,
}: MascotProps) {
    const [currentMood, setCurrentMood] = useState(mood);
    const [blinking, setBlinking] = useState(false);

    useEffect(() => {
        setCurrentMood(mood);
    }, [mood]);

    // Random blink effect
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinking(true);
            setTimeout(() => setBlinking(false), 150);
        }, Math.random() * 3000 + 2000);
        return () => clearInterval(blinkInterval);
    }, []);

    const sizes = { sm: 80, md: 120, lg: 160 };
    const svgSize = sizes[size];

    const bodyColors: Record<MascotMood, { body: string; glow: string; accent: string }> = {
        idle: { body: "#00D4FF", glow: "rgba(0,212,255,0.3)", accent: "#0066FF" },
        celebrate: { body: "#FF8C00", glow: "rgba(255,140,0,0.4)", accent: "#FF6B00" },
        thinking: { body: "#00D4FF", glow: "rgba(0,212,255,0.2)", accent: "#0099AA" },
        wave: { body: "#00D4FF", glow: "rgba(0,212,255,0.3)", accent: "#0066FF" },
        sad: { body: "#6B7A99", glow: "rgba(107,122,153,0.2)", accent: "#4A5568" },
        excited: { body: "#FF6B00", glow: "rgba(255,107,0,0.4)", accent: "#FFA533" },
    };

    const colors = bodyColors[currentMood];

    const getMouthPath = () => {
        switch (currentMood) {
            case "celebrate":
            case "excited":
                return "M 38 68 Q 50 80 62 68"; // Big smile
            case "sad":
                return "M 38 72 Q 50 62 62 72"; // Frown
            case "thinking":
                return "M 42 70 L 58 70"; // Neutral
            default:
                return "M 40 70 Q 50 78 60 70"; // Smile
        }
    };

    const animationClass = {
        idle: "mascot-idle",
        celebrate: "mascot-celebrate",
        thinking: "",
        wave: "mascot-idle",
        sad: "",
        excited: "mascot-celebrate",
    }[currentMood];

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div className={animationClass} style={{ filter: `drop-shadow(0 0 20px ${colors.glow})` }}>
                <svg
                    width={svgSize}
                    height={svgSize * 1.2}
                    viewBox="0 0 100 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Glow filter */}
                    <defs>
                        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor={colors.body} stopOpacity="0" />
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Shadow */}
                    <ellipse cx="50" cy="118" rx="22" ry="4" fill="rgba(0,0,0,0.3)" />

                    {/* Body */}
                    <ellipse cx="50" cy="75" rx="22" ry="28" fill={colors.body} />
                    <ellipse cx="50" cy="75" rx="22" ry="28" fill="url(#bodyGrad)" />

                    {/* Belly */}
                    <ellipse cx="50" cy="80" rx="13" ry="16" fill="rgba(255,255,255,0.15)" />

                    {/* Arms */}
                    {currentMood === "celebrate" || currentMood === "excited" ? (
                        <>
                            {/* Arms up */}
                            <path d="M 28 65 Q 18 50 22 42" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" />
                            <path d="M 72 65 Q 82 50 78 42" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" />
                            {/* Hands */}
                            <circle cx="22" cy="40" r="6" fill={colors.body} />
                            <circle cx="78" cy="40" r="6" fill={colors.body} />
                            {/* Stars */}
                            <text x="10" y="38" fontSize="10" fill="#FFD700">⭐</text>
                            <text x="76" y="38" fontSize="10" fill="#FFD700">⭐</text>
                        </>
                    ) : currentMood === "wave" ? (
                        <>
                            <path d="M 28 70 Q 18 65 20 72" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" />
                            <circle cx="19" cy="73" r="6" fill={colors.body} />
                            <path d="M 72 70 Q 85 55 82 45" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#glow)" />
                            <circle cx="83" cy="43" r="6" fill={colors.body} />
                        </>
                    ) : currentMood === "thinking" ? (
                        <>
                            <path d="M 28 70 Q 18 65 20 72" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" />
                            <circle cx="19" cy="73" r="6" fill={colors.body} />
                            <path d="M 72 70 Q 84 62 80 54" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" />
                            <circle cx="81" cy="52" r="6" fill={colors.body} />
                            {/* Thought bubbles */}
                            <circle cx="90" cy="45" r="3" fill="rgba(0,212,255,0.5)" />
                            <circle cx="96" cy="38" r="4" fill="rgba(0,212,255,0.5)" />
                            <circle cx="103" cy="30" r="5" fill="rgba(0,212,255,0.5)" />
                        </>
                    ) : (
                        <>
                            <path d="M 28 70 Q 16 68 18 76" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" />
                            <circle cx="17" cy="77" r="6" fill={colors.body} />
                            <path d="M 72 70 Q 84 68 82 76" stroke={colors.body} strokeWidth="8" strokeLinecap="round" fill="none" />
                            <circle cx="83" cy="77" r="6" fill={colors.body} />
                        </>
                    )}

                    {/* Legs */}
                    <rect x="36" y="99" width="10" height="16" rx="5" fill={colors.accent} />
                    <rect x="54" y="99" width="10" height="16" rx="5" fill={colors.accent} />

                    {/* Head */}
                    <circle cx="50" cy="38" r="26" fill={colors.body} />
                    <circle cx="50" cy="38" r="26" fill="url(#bodyGrad)" />

                    {/* Helmet/Cap accent */}
                    <path d="M 26 30 Q 50 12 74 30" stroke={colors.accent} strokeWidth="3" fill="none" strokeLinecap="round" />

                    {/* Eyes */}
                    {blinking ? (
                        <>
                            <rect x="35" y="31" width="10" height="3" rx="1.5" fill="#0A0A0F" />
                            <rect x="55" y="31" width="10" height="3" rx="1.5" fill="#0A0A0F" />
                        </>
                    ) : currentMood === "sad" ? (
                        <>
                            {/* Sad droopy eyes */}
                            <ellipse cx="40" cy="33" rx="5" ry="6" fill="#0A0A0F" />
                            <ellipse cx="60" cy="33" rx="5" ry="6" fill="#0A0A0F" />
                            <circle cx="42" cy="31" r="2" fill="white" />
                            <circle cx="62" cy="31" r="2" fill="white" />
                            {/* Tears */}
                            <path d="M 38 39 Q 37 44 38 46" stroke="#00D4FF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <ellipse cx="40" cy="33" rx="5" ry="6" fill="#0A0A0F" />
                            <ellipse cx="60" cy="33" rx="5" ry="6" fill="#0A0A0F" />
                            <circle cx="42" cy="31" r="2" fill="white" />
                            <circle cx="62" cy="31" r="2" fill="white" />
                            {/* Shine */}
                            <circle cx="43" cy="30" r="1" fill="rgba(255,255,255,0.8)" />
                            <circle cx="63" cy="30" r="1" fill="rgba(255,255,255,0.8)" />
                        </>
                    )}

                    {/* Eyebrows */}
                    {currentMood === "sad" ? (
                        <>
                            <path d="M 35 26 Q 40 29 45 27" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <path d="M 55 27 Q 60 29 65 26" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </>
                    ) : currentMood === "thinking" ? (
                        <>
                            <path d="M 35 25 Q 40 22 45 25" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <path d="M 55 24 Q 60 27 65 24" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </>
                    ) : (
                        <>
                            <path d="M 35 25 Q 40 22 45 25" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <path d="M 55 25 Q 60 22 65 25" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </>
                    )}

                    {/* Mouth */}
                    <path
                        d={getMouthPath()}
                        stroke="#0A0A0F"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Cheeks */}
                    {(currentMood === "celebrate" || currentMood === "excited") && (
                        <>
                            <ellipse cx="31" cy="42" rx="6" ry="4" fill="rgba(255,100,100,0.3)" />
                            <ellipse cx="69" cy="42" rx="6" ry="4" fill="rgba(255,100,100,0.3)" />
                        </>
                    )}

                    {/* GPS pin emblem on chest */}
                    <circle cx="50" cy="75" r="8" fill="rgba(0,0,0,0.2)" />
                    <text x="46" y="79" fontSize="8" fill="white"></text>
                </svg>
            </div>

            {/* Speech bubble */}
            {showMessage && message && (
                <div
                    style={{
                        background: "rgba(17,19,24,0.95)",
                        border: `1px solid ${colors.body}40`,
                        borderRadius: "16px 16px 16px 4px",
                        padding: "12px 16px",
                        maxWidth: "260px",
                        position: "relative",
                        animation: "slideInUp 0.4s ease",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "16px",
                            width: 0,
                            height: 0,
                            borderLeft: "8px solid transparent",
                            borderRight: "8px solid transparent",
                            borderTop: `8px solid rgba(17,19,24,0.95)`,
                        }}
                    />
                    <p style={{ fontSize: "0.85rem", color: "#E0E8FF", lineHeight: 1.5 }}>{message}</p>
                </div>
            )}
        </div>
    );
}
