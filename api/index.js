// Vercel Serverless Function — wraps the Express backend
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config({
      path: require("path").join(__dirname, "..", "backend", ".env"),
    });
  } catch (e) {
    console.log("No local .env found, skipping...");
  }
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Debug route to check env vars (masking values)
app.get("/api/debug-env", (req, res) => {
  res.json({
    hasMongoUri: !!process.env.MONGO_URI,
    nodeEnv: process.env.NODE_ENV,
    mongoUriPrefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : "none"
  });
});

// ===== Routes =====
try {
  const authRoutes = require("../backend/routes/authRoutes");
  const resumeRoutes = require("../backend/routes/resumeRoutes");
  const aiRoutes = require("../backend/routes/aiRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/resumes", resumeRoutes);
  app.use("/api/ai", aiRoutes);
} catch (err) {
  console.error("Require error:", err.message);
  app.get("/api/*", (req, res) => {
    res.status(500).json({ error: "Backend initialization failed", details: err.message });
  });
}

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "Resume Analyzer API is running on Vercel 🚀" });
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
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is missing!");
  }

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
        cached.promise = null; 
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Export handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Handler error:", err.message);
    return res.status(500).json({ 
      error: "Connection failed", 
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};
