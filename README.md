# 🤖 FreddyAI — Personal Placement & Coding Journey Platform

A modern, full-stack **MERN** web platform with built-in **AI Placement Scoring & Daily Evaluation** and **Multi-User JWT Authentication**, designed to track coding consistency, DSA mastery, system design, projects, and interview rounds for product-company placements.

---

## ✨ Features

- **🔐 Multi-User Authentication & Profile Isolation**:
  - Secure JWT authentication (`bcryptjs` + `jsonwebtoken`) with persistent client sessions.
  - Multi-tenant architecture: Each registered candidate maintains their own private DSA question vault, devlogs, interview archives, and AI scoring history.
  - User profile customization: Set your target role (e.g. SDE-1, Full-Stack), target company, and link your public competitive coding handles (LeetCode, Codeforces, GitHub).

- **🧠 FreddyAI Placement Scoring Engine**:
  - Automatically scores each day from **0 to 100** based on problem-solving difficulty, topic diversity, CS fundamentals (OS, DBMS, CN), and project contributions.
  - Categorizes your daily placement readiness into candidate tiers (*Top 5% Placement Ready*, *Strong Candidate*, *Competitive Tier*).
  - Outlines key observed strengths, critical gaps, and **generates high-impact targets for tomorrow**.
  - Supports local heuristic intelligence out-of-the-box, with optional **Google Gemini API** integration for deep natural language critique.

- **🧩 DSA Question Vault**:
  - Filterable by topic (*Dynamic Programming, Graphs, Trees, Heap, Two Pointers, Design, etc.*).
  - Filterable by difficulty (*Easy, Medium, Hard*) and review status (*Solved, Mastered, Needs Revisit*).
  - Expandable cards showing time & space complexity, optimal approaches, edge cases, and tags.
  - Built-in modal to quickly record newly solved questions.

- **📊 Live External Competitive Sync**:
  - **LeetCode API**: Total solved count, Easy / Medium / Hard breakdown, and global ranking.
  - **Codeforces API**: Live rating, max rating, and rank title.
  - **GitHub**: Public repositories, followers, and active project showcase.

- **🚀 Engineering Projects Showcase**:
  - Rich project cards with live demo links, source code, architecture highlights, and tech stack tags.
  - Add and showcase your distributed systems, full-stack apps, or hackathon projects.

- **💼 Company Interview Archive & Mocks**:
  - Real campus placement and mock interview archives (Google, Amazon, Atlassian, Microsoft, etc.).
  - Questions asked by interviewers, difficulty levels, candidate approaches, and key interview takeaways.

- **📓 Chronological Devlogs & Timeline**:
  - Transparent daily journal tracking your study hours, problems tackled, and daily AI score badges.

- **⚡ Fast Daily Logging**:
  - Log your day in seconds using the UI modal or directly through the terminal with `npm run log:today`.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Modern Developer Dark Theme, React Context API.
- **Backend**: Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt password hashing.
- **Database**: MongoDB with Mongoose (includes automatic fallback in-memory store so it runs instantly even before MongoDB is booted).
- **AI Scoring**: Heuristic multi-dimensional evaluator + optional Google Gemini 1.5 Flash integration.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment (Optional)
Edit `server/.env` if you'd like to connect to MongoDB Atlas or provide your public handles:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/freddyai
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
LEETCODE_USERNAME=your_leetcode_handle
CODEFORCES_USERNAME=your_codeforces_handle
GITHUB_USERNAME=your_github_username
```
*(Note: If MongoDB is not running locally, FreddyAI automatically enables its in-memory store so you can test and use the UI immediately).*

### 3. Start the Project

In separate terminal windows (or concurrently):

**Start the Backend Server (Port 5001):**
```bash
npm run dev:server
```

**Start the React Client (Port 5173):**
```bash
npm run dev:client
```

Open your browser at **`http://localhost:5173`** to access FreddyAI!

---

## ⚡ Fast Terminal Logging CLI

Want to log today's coding progress without opening a browser?
```bash
npm run log:today
```
Enter your problems, study hours, and notes—FreddyAI will immediately evaluate your daily performance and print your score and tomorrow's targets in your terminal!

---

## 📁 Project Structure

```text
Notebook-system-antigravity/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation, User profile chip & Auth triggers
│   │   │   ├── Dashboard.jsx   # AI Placement Scorecard & Profile Sync
│   │   │   ├── DsaTracker.jsx  # Question Vault & Add Problem Modal
│   │   │   ├── ProjectsShowcase.jsx # Project Cards & Add Project Modal
│   │   │   ├── InterviewArchive.jsx # Interview Records & Log Modal
│   │   │   ├── Timeline.jsx    # Dev Journey & Log History
│   │   │   ├── LogModal.jsx    # Daily activity logger
│   │   │   └── AuthModal.jsx   # Sign In / Create Account modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT state & persistent auth sessions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Express REST API & AI Engine
│   ├── config/db.js            # MongoDB connection with offline fallback
│   ├── middleware/auth.js      # JWT verification middleware
│   ├── models/                 # Mongoose schemas (User, DsaProblem, DailyLog, Interview, Project)
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Me, Profile update routes
│   │   └── api.js              # User-scoped resources & scoring endpoints
│   ├── services/
│   │   ├── aiScorer.js         # Daily scoring algorithm & Gemini integration
│   │   ├── statsFetcher.js     # LeetCode, Codeforces, GitHub sync
│   │   └── mockStore.js        # Seed store
│   ├── scripts/
│   │   ├── seedData.js         # Database seeder
│   │   └── logDayCli.js        # Terminal daily logger
│   ├── server.js
│   └── package.json
│
└── legacy-noteflow/            # Archived previous notebook files
```
