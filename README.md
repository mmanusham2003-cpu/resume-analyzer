# 📄 Resume Analyzer — AI-Powered Resume Review

An intelligent, full-stack web application that analyzes resumes using **Google Gemini AI**. Upload your resume (PDF/DOCX), get an instant AI-powered score, actionable suggestions, and job-match insights.

## ✨ Features

- 🔐 **User Authentication** — Secure register/login with JWT tokens
- 📤 **Resume Upload** — Drag & drop PDF or DOCX files
- 🤖 **AI Analysis** — Powered by Google Gemini for deep resume insights
- 📊 **Match Score** — See how well your resume matches a job description
- 💡 **Smart Suggestions** — Get AI-powered improvement recommendations
- 📋 **Dashboard** — Manage and review all your analyzed resumes
- 🎨 **Modern UI** — Sleek, responsive React frontend

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router, Axios       |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (Mongoose)            |
| AI Engine  | Google Gemini AI                    |
| Auth       | JWT + bcrypt                        |
| Hosting    | Vercel (frontend) + Render (backend)|

## 🚀 Live Demo

**🔗 [Open Resume Analyzer](https://resume-analyzer-mmanusham.vercel.app)**

> Anyone can click the link above to use the app — just register and start analyzing!

## 📁 Project Structure

```
Resume-Analyzer/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (auth, resume, AI)
│   ├── middleware/       # JWT auth & file upload middleware
│   ├── models/          # Mongoose schemas (User, Resume)
│   ├── routes/          # Express routes
│   ├── services/        # AI & parser services
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── context/     # Auth context provider
│   │   ├── pages/       # Page components
│   │   └── services/    # API service layer
│   └── package.json
├── vercel.json          # Vercel deployment config
└── README.md
```

## 🏗 Local Development

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier)
- Google Gemini API key

### Setup

```bash
# Clone the repo
git clone https://github.com/mmanusham2003-cpu/resume-analyzer.git
cd resume-analyzer

# Install backend dependencies
cd backend
npm install

# Create backend/.env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRE=30d
# GEMINI_API_KEY=your_gemini_api_key

# Start backend
npm run dev

# In a new terminal — install & start frontend
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`

## 🌐 Deployment

### Backend → Render (Free)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo → set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables (MONGO_URI, JWT_SECRET, GEMINI_API_KEY, etc.)

### Frontend → Vercel (Free)
1. Go to [vercel.com](https://vercel.com) → Import GitHub repo
2. Vercel auto-detects `vercel.json` config
3. API calls are proxied to Render via rewrites
4. You get one single link: `https://your-app.vercel.app`

## 📝 License

MIT License — feel free to use, modify, and share!

---

Built with ❤️ by [mmanusham2003-cpu](https://github.com/mmanusham2003-cpu)
