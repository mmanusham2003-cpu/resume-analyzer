# 📄 Resume Analyzer — AI-Powered Resume Review

A full-stack web application that analyzes resumes using Google Gemini AI. Upload your PDF or DOCX resume, get an instant score, section-by-section feedback, keyword analysis, and actionable improvement suggestions.

---

## 🏗️ Project Structure

```
Resume-Analyzer/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js      # Auth (register/login/me)
│   │   ├── resumeController.js    # Resume CRUD & analysis
│   │   └── aiController.js        # AI suggestions & job matching
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification
│   │   └── uploadMiddleware.js    # Multer file upload config
│   │
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Resume.js              # Resume schema with analysis
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── resumeRoutes.js        # /api/resumes/*
│   │   └── aiRoutes.js            # /api/ai/*
│   │
│   ├── services/
│   │   ├── parserService.js       # PDF/DOCX text extraction
│   │   └── aiService.js           # Gemini AI integration
│   │
│   ├── utils/
│   │   └── scoreCalculator.js     # Weighted score computation
│   │
│   ├── uploads/                   # Uploaded resumes (gitignored)
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Top navigation bar
│   │   │   ├── Navbar.css
│   │   │   ├── ResumeUpload.js    # Drag & drop upload
│   │   │   ├── ResumeUpload.css
│   │   │   ├── AnalysisResult.js  # Score & feedback display
│   │   │   ├── AnalysisResult.css
│   │   │   └── ProtectedRoute.js  # Auth guard wrapper
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Auth.css           # Shared auth styles
│   │   │   ├── Dashboard.js       # Resume history & stats
│   │   │   ├── Dashboard.css
│   │   │   ├── Analyzer.js        # Main analysis page
│   │   │   └── Analyzer.css
│   │   │
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance with interceptors
│   │   │   ├── authService.js     # Auth API calls
│   │   │   └── resumeService.js   # Resume & AI API calls
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js     # Auth state management
│   │   │
│   │   ├── App.js                 # Root component with routing
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Global design system
│   │
│   └── package.json
│
└── README.md
```

---

## ✨ Features

- **Resume Upload** — Drag & drop PDF/DOCX files (max 5MB)
- **AI Analysis** — Powered by Google Gemini 1.5 Flash
- **Section Scores** — Contact Info, Experience, Education, Skills, Formatting
- **Overall Score** — Weighted 0-100 score with visual progress indicators
- **Job Matching** — Paste a job description to get a match score
- **Keyword Detection** — Identifies relevant resume keywords
- **Improvement Suggestions** — AI-generated actionable recommendations
- **User Auth** — JWT-based registration & login
- **Resume History** — Dashboard with all past analyses
- **Responsive UI** — Works on desktop & mobile

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Google Gemini API Key** — Get one at [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=30d
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm start
```

The frontend runs on `http://localhost:3000` and proxies API calls to `http://localhost:5000`.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login` | Login & get JWT token |
| GET    | `/api/auth/me` | Get current user profile |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/resumes/upload` | Upload a resume (multipart) |
| POST   | `/api/resumes/:id/analyze` | Parse + AI analyze a resume |
| GET    | `/api/resumes` | List all user resumes |
| GET    | `/api/resumes/:id` | Get single resume details |
| DELETE | `/api/resumes/:id` | Delete a resume |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/ai/suggestions/:id` | Get AI improvement suggestions |
| POST   | `/api/ai/match/:id` | Re-analyze with job description |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios, Framer Motion, react-dropzone |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| AI | Google Gemini 1.5 Flash |
| Auth | JWT + bcryptjs |
| File Parsing | pdf-parse, mammoth |
| Upload | multer |

---

## 📝 License

MIT
