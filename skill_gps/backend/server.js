require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());

// ===== GEMINI HELPER =====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// gemini-2.0-flash is the current free available model (1.5-flash and 1.5-pro are deprecated)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Call Gemini 2.0 Flash API.
 * @param {string} systemPrompt - Instruction for the model
 * @param {Array}  messages     - [{role:'user'|'assistant', content:'...'}]
 * @param {boolean} jsonMode    - Enable JSON output mode
 */
async function callGemini(systemPrompt, messages, _unused = false, jsonMode = false) {
    // Convert messages: Gemini uses 'model' not 'assistant'
    const rawContents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }]
    }));

    // Gemini requires strictly alternating user/model turns.
    // Merge consecutive same-role messages into one.
    const contents = [];
    for (const turn of rawContents) {
        if (contents.length > 0 && contents[contents.length - 1].role === turn.role) {
            contents[contents.length - 1].parts[0].text += '\n' + turn.parts[0].text;
        } else {
            contents.push(turn);
        }
    }
    // Must end with a user message
    if (!contents.length || contents[contents.length - 1].role !== 'user') {
        throw new Error('Last message must be from user');
    }

    const requestBody = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            ...(jsonMode && { responseMimeType: 'application/json' })
        }
    };

    const response = await axios.post(GEMINI_URL, requestBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return reply;
}

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

// ===== AI CHAT ROUTE (Gemini Flash) =====
app.post('/api/chat', async (req, res) => {
    const { messages, studentId, requestingStudentId, systemPrompt: customSystemPrompt } = req.body;

    // If a custom system prompt is provided (from non-chat routes), use it directly
    if (customSystemPrompt) {
        try {
            const reply = await callGemini(customSystemPrompt, messages, false, false);
            return res.json({ reply });
        } catch (error) {
            console.error('Gemini error (custom prompt):', error.message);
            return res.status(500).json({ reply: 'AI service temporarily unavailable.' });
        }
    }

    const students = readStudents();
    const currentStudent = students.find(s => s.id === requestingStudentId) || students[0];
    const targetStudent = students.find(s => s.id === studentId);

    // Privacy check
    if (studentId && studentId !== requestingStudentId && targetStudent) {
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        const personalKeywords = ['cgpa', 'gpa', 'internship', 'project', 'badge', 'rank', 'streak', 'goal', 'grade', 'attendance', 'personal', 'his ', 'her ', 'their '];
        if (personalKeywords.some(k => lastMsg.includes(k))) {
            return res.json({ reply: "⚠️ Cannot provide other users' personal info due to safety reasons." });
        }
    }

    const student = currentStudent;
    const systemPrompt = `You are a friendly, conversational AI chatbot acting as the Skill GPS Career Mentor. You are chatting one-on-one with a student. You have complete knowledge of their academic profile. Your tone should be natural, helpful, engaging, and human-like. Keep responses short and conversational (1-2 short paragraphs). Use emojis occasionally. Be motivating, specific, and actionable.

=== STUDENT PROFILE ===
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

=== SKILL GAPS ===
${(student.skillGaps || []).map(g => `- ${g.skill}: ${g.score}%`).join('\n')}

=== SEMESTER GOALS ===
${(student.semesterGoals || []).map(g => `- [${g.done ? '✓' : ' '}] ${g.text}`).join('\n')}

IMPORTANT PRIVACY RULE: If asked about another student's personal details, respond ONLY with: "⚠️ Cannot provide other users' personal info due to safety reasons."`;

    try {
        const reply = await callGemini(systemPrompt, messages, false, false);
        res.json({ reply });
    } catch (error) {
        console.error('Gemini chat error:', error.message);
        // Intelligent fallback
        const student = currentStudent;
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        let fallbackReply = `Hey ${student.name.split(' ')[0]}! I'm your Skill GPS AI mentor. I'm having a moment of trouble connecting, but I'm here for you! Your career match for ${student.careerTarget} is ${student.careerProbability}%. Keep pushing! 💪`;
        if (lastMsg.includes('cgpa') || lastMsg.includes('gpa')) {
            fallbackReply = `Hey ${student.name.split(' ')[0]}! Your current CGPA is ${student.cgpa}. ${student.cgpa >= 8.5 ? "That's excellent! Keep it up! 🌟" : "There's room to push higher — aim for 8.5+ for competitive placements!"}`;
        }
        res.json({ reply: fallbackReply });
    }
});

// ===== APTITUDE TRAINER (Gemini Flash + JSON Mode) =====
app.post('/api/aptitude', async (req, res) => {
    const { topic, difficulty, score } = req.body;

    const systemPrompt = `You are an AI Aptitude Trainer for IT placement exams. Generate ONE high-quality multiple-choice question.

Return a valid JSON object with EXACTLY this structure:
{
  "topic": "Topic Name",
  "difficulty": "Easy/Medium/Hard",
  "question": "The question text",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correctAnswer": "A",
  "explanation": "Step-by-step explanation",
  "conceptTip": "A short trick or shortcut",
  "nextTopic": "Recommended next topic"
}`;

    const userMessage = `Generate a question for Topic: ${topic || 'Any'}, Difficulty: ${difficulty || 'Medium'}, Student Previous Score: ${score || 'N/A'}`;

    try {
        const reply = await callGemini(systemPrompt, [{ role: 'user', content: userMessage }], false, true);
        const parsed = JSON.parse(reply);
        res.json(parsed);
    } catch (error) {
        const detail = error.response?.data || error.message;
        console.error('Aptitude trainer error:', JSON.stringify(detail));
        res.status(500).json({ error: 'Failed to generate question. Please try again.' });
    }
});

// ===== CODING MENTOR (Gemini Pro + JSON Mode) =====
app.post('/api/coding-mentor', async (req, res) => {
    const { code, language, question } = req.body;

    const systemPrompt = `You are an expert AI Coding Mentor. Analyze the code or answer the coding question.

Return a valid JSON object with EXACTLY this structure:
{
  "feedback": "Detailed feedback about the code quality and logic",
  "optimization": "Specific optimization suggestion with example",
  "timeComplexity": "e.g. O(n log n)",
  "spaceComplexity": "e.g. O(n)",
  "suggestedExercise": "Name of a related problem to practice",
  "correctedCode": "The improved/corrected version of the code (if applicable)"
}`;

    const userMessage = question
        ? `Question: ${question}`
        : `Language: ${language || 'Unknown'}\nCode:\n${code}`;

    try {
        const reply = await callGemini(systemPrompt, [{ role: 'user', content: userMessage }], true, true);
        const parsed = JSON.parse(reply);
        res.json(parsed);
    } catch (error) {
        console.error('Coding mentor error:', error.message);
        res.status(500).json({ error: 'Failed to analyze code. Please try again.' });
    }
});

// ===== RESUME OPTIMIZER (Gemini Pro + JSON Mode) =====
app.post('/api/resume-optimizer', async (req, res) => {
    const { resumeText, targetRole } = req.body;

    const systemPrompt = `You are an expert AI Resume Optimizer and ATS (Applicant Tracking System) specialist.

Return a valid JSON object with EXACTLY this structure:
{
  "overall": 85,
  "atsScore": 80,
  "breakdown": [
    { "category": "Technical Skills", "score": 90 },
    { "category": "Experience", "score": 75 },
    { "category": "Education", "score": 95 },
    { "category": "Projects", "score": 80 },
    { "category": "Formatting", "score": 85 }
  ],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "missingKeywords": ["keyword1", "keyword2"],
  "rewrittenSummary": "A stronger, ATS-optimized professional summary"
}`;

    const userMessage = `Analyze this resume for the role of ${targetRole || 'Software Engineer'}:\n\n${resumeText}`;

    try {
        const reply = await callGemini(systemPrompt, [{ role: 'user', content: userMessage }], true, true);
        const parsed = JSON.parse(reply);
        res.json(parsed);
    } catch (error) {
        console.error('Resume optimizer error:', error.message);
        res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
    }
});

// ===== CAREER ROADMAP (Gemini Flash + JSON Mode) =====
app.post('/api/career-roadmap', async (req, res) => {
    const { currentSkills, targetRole, studentId } = req.body;

    const systemPrompt = `You are an AI Career Roadmap Generator. Create a personalized step-by-step learning roadmap.

Return a valid JSON object with EXACTLY this structure:
{
  "targetRole": "Full Stack Engineer",
  "nodes": [
    { "id": 1, "title": "Foundation", "description": "HTML, CSS, JS basics", "status": "completed", "xp": 100, "resources": ["freeCodeCamp", "MDN Docs"] },
    { "id": 2, "title": "React Mastery", "description": "Hooks, Context, Next.js", "status": "active", "xp": 300, "resources": ["React Docs", "Next.js Docs"] },
    { "id": 3, "title": "Backend Essentials", "description": "Node, Express, Databases", "status": "locked", "xp": 400, "resources": ["Node.js Docs", "MongoDB University"] }
  ],
  "estimatedTime": "6 Months",
  "marketDemand": "High",
  "avgSalary": "₹8-15 LPA"
}`;

    const userMessage = `Current Skills: ${currentSkills}. Target Role: ${targetRole}.`;

    try {
        const reply = await callGemini(systemPrompt, [{ role: 'user', content: userMessage }], false, true);
        const parsed = JSON.parse(reply);
        res.json(parsed);
    } catch (error) {
        console.error('Roadmap generator error:', error.message);
        res.status(500).json({ error: 'Failed to generate roadmap. Please try again.' });
    }
});

// ===== COMMUNICATION TRAINER (Gemini Flash + JSON Mode) =====
app.post('/api/communication-trainer', async (req, res) => {
    const { sentence } = req.body;
    if (!sentence || sentence.trim() === '') {
        return res.status(400).json({ error: 'No sentence provided' });
    }

    const systemPrompt = `You are an AI Real-Time Communication Trainer for students preparing for placements.

Return a valid JSON object with EXACTLY this structure:
{
  "correctSentence": "Grammatically correct version",
  "grammarMistakes": [{ "error": "mistake description", "explanation": "simple explanation" }],
  "vocabularyImprovement": [{ "original": "word used", "better": "professional word", "reason": "why" }],
  "fluencyFeedback": "How natural it sounds",
  "pronunciationTips": [{ "word": "word", "tip": "how to pronounce" }],
  "scores": { "grammar": 75, "fluency": 70, "vocabulary": 65, "pronunciation": 80, "confidence": 72 },
  "professionalVersion": "Interview-ready version of the sentence",
  "practiceSuggestion": "One short speaking exercise",
  "conversationalResponse": "A natural, supportive response",
  "followUpQuestion": "A question to keep the student speaking"
}`;

    try {
        const reply = await callGemini(systemPrompt, [{ role: 'user', content: `Input Sentence: "${sentence}"` }], false, true);
        const parsed = JSON.parse(reply);
        res.json(parsed);
    } catch (error) {
        console.error('Communication trainer error:', error.message);
        res.status(500).json({ error: 'Failed to analyze sentence. Please try again.' });
    }
});

// ===== MENTOR GUIDE (Gemini Flash) =====
app.post('/api/mentor-guide', async (req, res) => {
    const { studentProfile, question } = req.body;

    const systemPrompt = `You are a senior career mentor at a top placement consultancy. Give practical, motivating career advice to students. Keep responses concise (3-4 sentences max), actionable, and encouraging.`;

    const userMessage = `Student Profile: ${JSON.stringify(studentProfile || {})}. Question: ${question}`;

    try {
        const reply = await callGemini(systemPrompt, [{ role: 'user', content: userMessage }], false, false);
        res.json({ reply });
    } catch (error) {
        console.error('Mentor guide error:', error.message);
        res.status(500).json({ reply: 'Unable to connect to mentor AI. Please try again.' });
    }
});

// ===== INSIGHTS (Gemini Flash + JSON Mode) =====
app.post('/api/insights', async (req, res) => {
    const { studentId } = req.body;
    const students = readStudents();
    const student = students.find(s => s.id === studentId) || students[0];

    const systemPrompt = `You are an AI academic insights engine. Analyze the student's data and return actionable insights.

Return a valid JSON object with EXACTLY this structure:
{
  "summary": "2-sentence overview of the student's current standing",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "actionItems": [
    { "priority": "High", "action": "Specific action to take", "impact": "Expected outcome" }
  ],
  "weeklyGoal": "One specific goal to achieve this week",
  "motivationalNote": "A personalized motivational message"
}`;

    const userMessage = `Student Data: ${JSON.stringify(student)}`;

    try {
        const reply = await callGemini(systemPrompt, [{ role: 'user', content: userMessage }], false, true);
        const parsed = JSON.parse(reply);
        res.json(parsed);
    } catch (error) {
        console.error('Insights error:', error.message);
        res.status(500).json({ error: 'Failed to generate insights.' });
    }
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        ai: 'Google Gemini',
        model_chat: 'gemini-1.5-flash',
        model_pro: 'gemini-1.5-pro',
        gemini_key_set: !!GEMINI_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`✅ Skill GPS Backend running on http://localhost:${PORT}`);
    console.log(`📦 Student DB: ${DB_PATH}`);
    console.log(`🤖 AI Provider: Google Gemini`);
    console.log(`🔑 Gemini API Key: ${GEMINI_API_KEY ? 'SET ✅' : 'NOT SET ❌'}`);
});
