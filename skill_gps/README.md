# Skill GPS

Skill GPS is a comprehensive student management and career mentoring platform. It is designed to provide personalized roadmaps, track skill progression, and offer AI-powered career counseling to university students. 

The application is structured into two main parts:
- **Frontend**: A modern Next.js web application with a beautiful UI.
- **Backend**: A robust Node.js/Express service that manages student details and integrates with an external AI API for the mentorship chatbot.

---

## 🚀 Key Features

- **🎓 Student Management:** 
  - Comprehensive student profiles with CGPA, attendance, rank, streaks, and skill gaps.
  - Admin dashboard to add, update, and manage student tracking.
- **🤖 AI Career Mentor:**
  - A built-in AI chatbot acting as a personalized Career Mentor.
  - Uses Hugging Face inference (`Mistral-7B-Instruct-v0.3`) for dynamic interaction.
  - Context-aware mentoring using exact student data like skill gaps, projects, and target careers.
- **📊 Interactive Progress Tracking:** 
  - Tracks LeetCode, SkillRack, and GitHub streaks.
  - Visualization of skill gaps and performance mapping.
  - Tracking of semester goals and badging systems.
- **🗣️ Communication & Aptitude Trainer:** 
  - Dedicated training modules to refine verbal and quantitative skills tailored for placements.

---

## 🛠️ Tech Stack

### Frontend (`/skill-gps`)
- **Framework:** Next.js 15, React 19
- **Styling:** Tailwind CSS v4
- **UI Components:** Lucide React (Icons), Radix UI
- **Animations & Visuals:** Framer Motion, React Spring/Scroll Parallax, Spline 3D Let
- **Data Visualization:** Recharts

### Backend (`/backend`)
- **Server Environment:** Node.js, Express.js
- **Data Persistence:** JSON-based persistent storage (`students.json`)
- **AI Integration:** Axios, Hugging Face API (`HF_API_TOKEN`) / NVIDIA AI endpoint
- **Middleware:** CORS, dotenv

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd skill_gps
\`\`\`

### 2. Backend Setup

Open a terminal and navigate to the backend folder:
\`\`\`bash
cd backend
\`\`\`

Install dependencies:
\`\`\`bash
npm install
\`\`\`

Create a `.env` file based on `.env.example`:
\`\`\`bash
# Create the .env file and add your Hugging Face API token for AI features.
HF_API_TOKEN=your_huggingface_api_token
# (Optional) PORT=5000
\`\`\`

Start the backend development server:
\`\`\`bash
npm run dev
# The server will run on http://localhost:5000
\`\`\`

### 3. Frontend Setup

Open a **new** terminal window and navigate to the frontend directory:
\`\`\`bash
cd skill-gps
\`\`\`

Install dependencies:
\`\`\`bash
npm install
\`\`\`

Start the Next.js development server:
\`\`\`bash
npm run dev
\`\`\`

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**. The frontend will communicate seamlessly with the backend.

---

## 🔄 API Documentation

The backend service runs on `http://localhost:5000` and exposes several REST endpoints:

- **Admin Authentication:** 
  - `POST /api/admin/login` (Uses college name as username and static password by default)
- **Student Data Manipulation:**
  - `GET /api/students` - Retrieve all students.
  - `GET /api/students/:id` - Fetch student by unique ID.
  - `GET /api/students/lookup/email?email=...` - Lookup safe data by student email directly.
  - `POST /api/students`, `PUT /api/students/:id`, `DELETE /api/students/:id` - Modify student details.
- **AI Chat Module:**
  - `POST /api/chat` - Interact with the AI Mentor based on the student's dataset.
- **Health:**
  - `GET /api/health` - Check backend server status.

---

## 📝 Usage Notes

- **Initial Data:** The backend is pre-populated with data using `students.json`. Any additions or updates will be written directly to this file, making it persistently mock the database.
- **AI Constraints:** The chatbot context is carefully engineered to only converse gracefully about the logged-in student and explicitly blocks answering personal queries regarding other students as a safety measure. Ensure your Hugging Face Token is securely placed in the `.env` file for the bot to run correctly. Fallback responses are provided if the API limits are reached.
