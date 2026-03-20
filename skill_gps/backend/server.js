require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// ===== MIDDLEWARE =====
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ===== DB HELPERS =====
const DB_PATH = path.join(__dirname, 'students.json');

function readStudents() {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
}

function writeStudents(students) {
    fs.writeFileSync(DB_PATH, JSON.stringify(students, null, 2));
}

// ===== ADMIN AUTH (Per College) =====
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // We treat the "username" field as the actual "college" name
    if (username && password === '12345678') {
        return res.json({ success: true, token: 'ADMIN_TOKEN_SKILLGPS', role: 'admin', college: username.trim() });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials. Password should be 12345678' });
});

// ===== STUDENT ROUTES =====

// Get all students (admin only - filtered by college)
app.get('/api/students', (req, res) => {
    const { college } = req.query;
    let students = readStudents();

    if (college && college !== 'admin') {
        // Find by partial match of college name
        students = students.filter(s => s.college.toLowerCase().includes(college.toLowerCase()));
    }
    res.json(students);
});

// Get single student by ID
app.get('/api/students/:id', (req, res) => {
    const students = readStudents();
    const student = students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
});

// Lookup student by email (used during onboarding)
app.get('/api/students/lookup/email', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const students = readStudents();
    const student = students.find(s => s.email.toLowerCase() === email.toString().toLowerCase());
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Return only safe fields for onboarding verification
    res.json({
        id: student.id,
        name: student.name,
        regNo: student.regNo,
        year: student.year,
        section: student.section,
        department: student.department,
        college: student.college
    });
});

// Add a new student (admin only)
app.post('/api/students', (req, res) => {
    const students = readStudents();
    const newStudent = {
        id: `STU${String(students.length + 1).padStart(3, '0')}`,
        ...req.body,
        // defaults
        careerProbability: req.body.careerProbability || 50,
        joinedDate: new Date().toISOString().split('T')[0],
        attendance: req.body.attendance || 80,
        leetcodeRank: req.body.leetcodeRank || 5000,
        leetcodeStreak: 0,
        skillrackStreak: 0,
        githubStreak: 0,
        totalXP: 100,
        level: 1,
        badges: [],
        skillGaps: req.body.skillGaps || [],
        semesterGoals: req.body.semesterGoals || [],
        recentActivity: []
    };
    students.push(newStudent);
    writeStudents(students);
    res.status(201).json(newStudent);
});

// Update student (admin)
app.put('/api/students/:id', (req, res) => {
    const students = readStudents();
    const idx = students.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Student not found' });
    students[idx] = { ...students[idx], ...req.body };
    writeStudents(students);
    res.json(students[idx]);
});

// Delete student (admin)
app.delete('/api/students/:id', (req, res) => {
    let students = readStudents();
    const idx = students.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Student not found' });
    students.splice(idx, 1);
    writeStudents(students);
    res.json({ success: true });
});

// ===== AI CHAT ROUTE (Gemini) =====
app.post('/api/chat', async (req, res) => {
    const { messages, studentId, requestingStudentId } = req.body;

    const students = readStudents();
    const currentStudent = students.find(s => s.id === requestingStudentId) || students[0];
    const targetStudent = students.find(s => s.id === studentId);

    // Security check: if asking about a different student's personal data
    if (studentId && studentId !== requestingStudentId && targetStudent) {
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        const personalKeywords = ['cgpa', 'gpa', 'internship', 'project', 'badge', 'rank', 'streak', 'goal', 'grade', 'attendance', 'personal', 'his ', 'her ', 'their '];
        const asksPersonal = personalKeywords.some(k => lastMsg.includes(k));
        if (asksPersonal) {
            return res.json({
                reply: "⚠️ Cannot provide other users' personal info due to safety reasons."
            });
        }
    }

    // Build context for the current logged-in student
    const student = currentStudent;
    const systemPrompt = `You are a friendly, conversational AI chatbot acting as the Skill GPS Career Mentor. You are chatting one-on-one with a student. You have complete knowledge of their academic profile. Your tone should be natural, helpful, engaging, and human-like (like ChatGPT or Gemini). Do NOT just dump data or output long essays. Have a dynamic back-and-forth conversation.

=== STUDENT PROFILE (LOGGED IN USER) ===
Name: ${student.name}
College: ${student.college}
Department: ${student.department}
Year ${student.year}, Semester ${student.semester}
CGPA: ${student.cgpa} | Attendance: ${student.attendance}%
Career Target: ${student.careerTarget}
Career Match Probability: ${student.careerProbability}%

=== ACTIVITY ===
LeetCode Rank: #${student.leetcodeRank} | Streak: ${student.leetcodeStreak} days
SkillRack Streak: ${student.skillrackStreak} days
GitHub: @${student.githubUsername} | Streak: ${student.githubStreak} days
XP Points: ${student.totalXP} | Level: ${student.level}
Projects Completed: ${student.projectsCompleted}
Internships: ${student.internships}

=== SKILL GAPS TO ADDRESS ===
${student.skillGaps.map(g => `- ${g.skill}: ${g.score}%`).join('\n')}

=== CURRENT SEMESTER GOALS ===
${student.semesterGoals.map(g => `- [${g.done ? '✓' : ' '}] ${g.text}`).join('\n')}

=== EARNED BADGES ===
${student.badges.map(b => `- ${b.title} (${b.date}): ${b.desc}`).join('\n')}

IMPORTANT PRIVACY RULE: If the user asks about another specific student's personal details (like their CGPA, projects, internships, rank, grades, etc.), respond ONLY with: "⚠️ Cannot provide other users' personal info due to safety reasons."

Always refer to the student by their first name. Converse naturally like an AI chatbot. Keep responses short and conversational (1-2 short paragraphs), using emojis occasionally. Ask follow-up questions to keep the chat engaging. Be motivating, specific, and actionable. When relevant, organically weave in their exact data (like CGPA or skill gaps).`;

    try {
        const HF_API_TOKEN = process.env.HF_API_TOKEN;
        const targetModel = req.body.model || 'mistralai/Mistral-7B-Instruct-v0.3';

        const hfMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content || ''
            }))
        ];

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${targetModel}/v1/chat/completions`,
            {
                model: targetModel,
                messages: hfMessages,
                max_tokens: 1024,
                temperature: 0.6
            },
            {
                headers: { 
                    'Authorization': `Bearer ${HF_API_TOKEN}`,
                    'Content-Type': 'application/json' 
                },
                timeout: 60000
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content || 'I could not generate a response.';
        res.json({ reply });

    } catch (error) {
        console.error('AI Chat error:', error.message || error);
        // Provide intelligent fallback
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        let fallbackReply = '';

        if (lastMsg.includes('cgpa') || lastMsg.includes('gpa')) {
            fallbackReply = `Hey ${student.name.split(' ')[0]}! Your current CGPA is ${student.cgpa}. ${student.cgpa >= 8.5 ? "That's excellent! Keep it up!" : student.cgpa >= 7.5 ? "That's good, but there's room to push it above 8.5 for competitive placements." : "Focus on improving your academic scores — aim for at least 7.5+ this semester."}`;
        } else if (lastMsg.includes('skill') || lastMsg.includes('work on') || lastMsg.includes('improve')) {
            fallbackReply = `Based on your profile, ${student.name.split(' ')[0]}, here are your key areas to focus on:\n\n${student.skillGaps.map(g => `• **${g.skill}** — currently at ${g.score}%, needs improvement`).join('\n')}\n\nI recommend starting with the skill that has the lowest score first for maximum impact on your career probability!`;
        } else if (lastMsg.includes('project')) {
            fallbackReply = `${student.name.split(' ')[0]}, you've completed ${student.projectsCompleted} projects so far. ${student.projectsCompleted < 3 ? "Try building 2-3 more projects aligned with your " + student.careerTarget + " goal." : "Great work on your projects! Consider contributing to open source to boost visibility."}`;
        } else {
            fallbackReply = `Hey ${student.name.split(' ')[0]}! I'm your Skill GPS AI mentor. You're targeting ${student.careerTarget} with a ${student.careerProbability}% career match. Focus on improving your skill gaps — especially ${student.skillGaps[0]?.skill || 'system design'} which is at ${student.skillGaps[0]?.score || 0}%. Keep your LeetCode streak going (currently ${student.leetcodeStreak} days) and you'll see your match percentage rise!`;
        }

        res.json({ reply: fallbackReply });
    }
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ Skill GPS Backend running on http://localhost:${PORT}`);
    console.log(`📦 Student DB: ${DB_PATH}`);
    console.log(`🔑 Hugging Face Token: ${process.env.HF_API_TOKEN ? 'SET' : 'NOT SET'}`);
});
