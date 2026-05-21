<div align="center">

# 🧭 Skill GPS

### AI-Powered Career & Academic Intelligence Platform

*Transforming student data into personalized career pathways*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6366f1?style=for-the-badge&logo=vercel)](https://github.com/Udhay345/SkillGps)
[![GitHub Stars](https://img.shields.io/github/stars/Udhay345/SkillGps?style=for-the-badge&color=f59e0b)](https://github.com/Udhay345/SkillGps/stargazers)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Overview

**Skill GPS** is an AI-driven platform that analyzes students' academic, coding, aptitude, and communication data to identify skill gaps and generate personalized career development roadmaps.

By combining **Machine Learning (ML)** and **Natural Language Processing (NLP)**, it bridges the gap between academic performance and real-world employability — giving students a clear, actionable path toward their target career.

> 💡 Think of it as a GPS for your career: it knows where you are, understands where you want to go, and recalculates the best route in real time.

---

## 🎯 Features

<table>
<tr>
<td width="50%">

### 📊 Academic Intelligence
- Internal marks calculator
- Pass probability prediction *(ML-based)*
- Subject-wise risk analysis
- CGPA & semester performance tracking

</td>
<td width="50%">

### 🧠 Career Intelligence
- Skill gap analysis vs. industry benchmarks
- AI-generated, personalized career roadmap
- Course, project & certification recommendations

</td>
</tr>
<tr>
<td>

### 💻 Coding Tracker
- LeetCode & SkillRack integration
- Topic-wise strength & weakness analysis
- Consistency scoring and progress trends

</td>
<td>

### 🧮 Aptitude Trainer
- Daily practice questions
- Mock test simulation
- Weak area detection
- Placement aptitude readiness score

</td>
</tr>
<tr>
<td>

### 🗣️ Communication Lab *(AI)*
- Speech-to-text analysis *(Whisper / Vosk)*
- Grammar, fluency, and vocabulary scoring
- AI mock interview trainer
- Real-time feedback and improvement tips

</td>
<td>

### 🏆 Placement Intelligence
- Holistic placement readiness score
- Multi-factor evaluation:
  - 📚 Academics · 💻 Coding
  - 🧮 Aptitude · 🗣️ Communication
- Company-specific readiness insights

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                     React.js Frontend                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST / WebSocket
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐  ┌──────────────┐  ┌───────────────────┐
│  Spring Boot    │  │  FastAPI     │  │  Speech Service   │
│  Core API       │  │  ML Engine   │  │  (Whisper/Vosk)   │
│  (Java)         │  │  (Python)    │  │  (Python)         │
└────────┬────────┘  └──────┬───────┘  └────────┬──────────┘
         │                  │                   │
         ▼                  ▼                   ▼
┌─────────────────┐  ┌──────────────────────────────────────┐
│     MySQL       │  │         AI / LLM APIs                │
│   Database      │  │  Groq · HuggingFace · OpenAI         │
└─────────────────┘  └──────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js | Interactive UI & dashboards |
| **Backend** | Spring Boot (Java) | Core REST API & business logic |
| **Database** | MySQL | Persistent student & academic data |
| **ML Engine** | Python · FastAPI · Scikit-learn | Predictive models & skill analysis |
| **NLP / LLM** | Groq · HuggingFace · OpenAI | AI roadmap generation & feedback |
| **Speech** | Whisper · Vosk | Communication lab transcription |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Java JDK](https://adoptium.net/) 17+
- [Python](https://www.python.org/) 3.10+
- [MySQL](https://dev.mysql.com/downloads/) 8.0+

### 1. Clone the repository

```bash
git clone https://github.com/Udhay345/SkillGps.git
cd SkillGps
```

### 2. Frontend Setup

```bash
cd skill-gps
npm install

# Copy the env template and add your API key
cp .env.local.example .env.local

npm run dev
# → http://localhost:3000
```

### 3. Backend Setup *(Spring Boot)*

```bash
cd backend
# Configure DB credentials in src/main/resources/application.properties
./mvnw spring-boot:run
# → http://localhost:8080
```

### 4. ML Microservice Setup *(Python / FastAPI)*

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
```

---

## 🔑 Environment Variables

Copy each `.env.example` file and fill in your keys. **Never commit real secrets.**

**Frontend** (`skill-gps/.env.local`):
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Backend** (`backend/.env`):
```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password_here
```

| Service | Free Tier | Get Key |
|---|---|---|
| **Groq** *(LLM inference)* | ✅ Yes | [console.groq.com/keys](https://console.groq.com/keys) |
| **Google Gemini** | ✅ Yes | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| **HuggingFace** | ✅ Yes | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |

---

## 📐 ML Models

| Model | Algorithm | Target |
|---|---|---|
| Pass Probability | Logistic Regression / Random Forest | Predict pass/fail risk per subject |
| Skill Gap Analyzer | Cosine Similarity + NLP | Match student skills vs job requirements |
| Aptitude Readiness | Gradient Boosting | Score based on mock test performance |
| Placement Score | Multi-factor weighted model | Overall employability prediction |

---

## 🗂️ Project Structure

```
SkillGps/
├── skill-gps/            # React.js / Next.js Frontend
│   ├── src/app/          # Pages & API routes
│   ├── src/lib/          # AI helper utilities
│   └── .env.local.example
│
├── backend/              # Spring Boot Core API
│   ├── src/main/java/    # Controllers, Services, Repositories
│   ├── students.json     # Dev data store
│   └── .env.example
│
└── ml-service/           # Python FastAPI ML Engine
    ├── models/           # Trained scikit-learn models
    ├── routers/          # API endpoints
    └── requirements.txt
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ by [Udhay](https://github.com/Udhay345) and contributors

⭐ Star this repo if Skill GPS helped you!

</div>
