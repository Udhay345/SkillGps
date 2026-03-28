import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are a friendly, conversational AI chatbot acting as the Skill GPS Career Mentor. You chat one-on-one with a student and have full context of their academic profile. Be natural, helpful, and human-like. Keep responses to 1-2 short paragraphs. Use emojis occasionally. Be motivating, specific, and actionable.

IMPORTANT PRIVACY RULE: If asked about another student's personal details (CGPA, projects, grades, etc.), respond ONLY with: "⚠️ Cannot provide other users' personal info due to safety reasons."`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, studentProfile } = body;

        const systemPrompt = studentProfile
            ? `${SYSTEM_PROMPT}

=== STUDENT PROFILE ===
Name: ${studentProfile.name}
College: ${studentProfile.college}
Department: ${studentProfile.department}
Year: ${studentProfile.year}, Semester: ${studentProfile.semester}
CGPA: ${studentProfile.cgpa} | Attendance: ${studentProfile.attendance}%
Career Target: ${studentProfile.careerTarget}
Career Match Probability: ${studentProfile.careerProbability}%
LeetCode Rank: #${studentProfile.leetcodeRank} | Streak: ${studentProfile.leetcodeStreak} days
GitHub: @${studentProfile.githubUsername} | Streak: ${studentProfile.githubStreak} days
XP Points: ${studentProfile.totalXP} | Level: ${studentProfile.level}
Projects Completed: ${studentProfile.projectsCompleted}
Internships: ${studentProfile.internships}
Skill Gaps: ${(studentProfile.skillGaps || []).map((g: { skill: string; score: number }) => `${g.skill}(${g.score}%)`).join(', ')}
Goals: ${(studentProfile.semesterGoals || []).map((g: { done: boolean; text: string }) => `[${g.done ? '✓' : ' '}] ${g.text}`).join(', ')}`
            : SYSTEM_PROMPT;

        const reply = await callGroq(systemPrompt, messages, false);
        return NextResponse.json({ reply });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Chat API error:', msg);
        if (msg.startsWith('RATE_LIMIT')) {
            return NextResponse.json({ reply: '⏳ AI is a bit busy right now. Please wait a moment and try again!' }, { status: 200 });
        }
        return NextResponse.json({ reply: 'Sorry, I am having trouble connecting. Please try again.' }, { status: 200 });
    }
}
