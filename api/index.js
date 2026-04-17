// Vercel Serverless Function — wraps the Express backend
// In production on Vercel, env vars are injected automatically.
// In local dev, load from backend/.env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: require("path").join(__dirname, "..", "backend", ".env"),
  });
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ===== Routes =====
const authRoutes = require("../backend/routes/authRoutes");
const resumeRoutes = require("../backend/routes/resumeRoutes");
const aiRoutes = require("../backend/routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "Resume Analyzer API is running on Vercel 🚀" });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

// ===== MongoDB Connection Caching for Serverless =====
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((m) => {
        console.log("✅ MongoDB Connected (serverless)");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        cached.promise = null; // Reset so next request can retry
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Export handler — Vercel invokes this for each request
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database connection failed. Please try again." });
  }
  return app(req, res);
};
