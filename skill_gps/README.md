# 🧭 Skill GPS

**Skill GPS** is a comprehensive student management and AI-powered career mentoring platform. It provides personalized roadmaps, skill gap analysis, AI-driven career counseling, aptitude training, and communication coaching — all tailored for placement-ready university students.

> 
> ⚠️ **Note for contributors:** API keys are required to run AI features locally. See setup instructions below.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🎓 Student Management | Profiles with CGPA, attendance, rank, streaks, and skill gaps |
| 🤖 AI Career Mentor | Context-aware AI chatbot using Groq (Llama 3.3 70B) |
| 📊 Progress Tracking | LeetCode, SkillRack, GitHub streaks + visualization |
| 🗺️ Career Roadmap | Personalized, AI-generated learning paths |
| 🗣️ Communication Trainer | Grammar, vocabulary, and fluency AI feedback |
| 🧮 Aptitude Trainer | AI-generated placement-style questions |
| 📄 Resume Optimizer | AI-powered resume feedback |
| 🛠️ Admin Dashboard | Analytics, student management, and insights |

---

## 🛠️ Tech Stack

### Frontend (`/skill-gps`)
- **Framework:** Next.js 16, React 19
- **Styling:** Tailwind CSS v4
- **UI:** Radix UI, Lucide Icons, Framer Motion
- **Charts:** Recharts
- **AI:** Groq API (server-side via Next.js API routes)

### Backend (`/backend`)
- **Runtime:** Node.js, Express.js
- **Storage:** JSON-based file persistence (`students.json`)
- **AI:** Groq API + Google Gemini API
- **Email:** Nodemailer (Gmail SMTP)

---

## ⚙️ Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A free [Groq API key](https://console.groq.com/keys) ← needed for all AI features

### 1. Clone the repository

```bash
git clone https://github.com/Udhay345/SkillGps.git
cd Skill-gps/skill_gps
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy the example env file and fill in your keys
cp .env.example .env
# Then edit .env with your actual API keys (see .env.example for guidance)

npm run dev
# Backend runs at http://localhost:5000
```

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd skill-gps
npm install

# Copy the example env file and fill in your Groq key
cp .env.local.example .env.local
# Then edit .env.local with your actual GROQ_API_KEY

npm run dev
# Frontend runs at http://localhost:3000
```

---

## 🔑 API Keys Required

This project uses the following third-party APIs. **You must supply your own keys** — no keys are included in the repository.

| Service | Purpose | Free Tier | Link |
|---|---|---|---|
| **Groq** | All AI features (chat, aptitude, roadmap, etc.) | ✅ Yes — generous limits | [console.groq.com/keys](https://console.groq.com/keys) |
| **Google Gemini** | Additional AI tasks in backend | ✅ Yes | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| **Gmail App Password** | Email notifications | ✅ Free with Gmail | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |

> **🔒 Security:** All API keys are loaded from `.env` / `.env.local` files which are **excluded from Git**. Never paste a real key directly in source code.

---

## 📁 Project Structure

```
skill_gps/
├── backend/              # Node.js / Express backend
│   ├── server.js         # Main server + API routes
│   ├── students.json     # Student data store
│   ├── .env.example      # ← Copy to .env, fill in your keys
│   └── package.json
│
└── skill-gps/            # Next.js frontend
    ├── src/
    │   ├── app/          # Pages + API routes
    │   └── lib/
    │       └── gemini.ts # Groq AI helper (server-side only)
    ├── .env.local.example # ← Copy to .env.local, fill in your keys
    └── package.json
```

---

## 🔄 Backend API Reference

The backend runs at `http://localhost:5000` and exposes:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/admin/login` | Admin authentication |
| `GET` | `/api/students` | List all students |
| `GET` | `/api/students/:id` | Get student by ID |
| `POST` | `/api/students` | Create student |
| `PUT` | `/api/students/:id` | Update student |
| `DELETE` | `/api/students/:id` | Delete student |
| `POST` | `/api/chat` | AI Career Mentor chat |

---

## 📝 Notes

- **Data Persistence:** The backend uses `students.json` as a lightweight database. All CRUD operations write directly to this file.
- **AI Safety:** The chatbot is prompt-engineered to only discuss the logged-in student's data and explicitly rejects queries about other students.
- **No Keys = No AI:** If you run without API keys, non-AI features (student management, dashboard) will still work. AI-powered routes will return a clear error.

---

## 📄 License

This project is for educational and demonstration purposes.
