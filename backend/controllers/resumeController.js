const Resume = require("../models/Resume");
const { parseResume } = require("../services/parserService");
const { analyzeResumeWithAI } = require("../services/aiService");

// @desc    Upload a resume file
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileType = req.file.mimetype.includes("pdf") ? "pdf" : "docx";

    // Create resume record in DB
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType,
      jobDescription: req.body.jobDescription || "",
      status: "uploaded",
    });

    // Parse text in background
    try {
      const extractedText = await parseResume(req.file.path, fileType);
      resume.extractedText = extractedText;
      resume.status = "parsed";
      await resume.save();
    } catch (parseErr) {
      console.error("Parse error:", parseErr.message);
      resume.status = "failed";
      await resume.save();
    }

    res.status(201).json(resume);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message || "Upload failed" });
  }
};

// @desc    Analyze a resume with AI
// @route   POST /api/resumes/:id/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!resume.extractedText) {
      return res.status(400).json({ message: "Resume text not extracted yet" });
    }

    resume.status = "analyzing";
    await resume.save();

    try {
      const analysis = await analyzeResumeWithAI(
        resume.extractedText,
        resume.jobDescription
      );

      resume.analysis = analysis;
      resume.matchScore = analysis.matchScore || 0;
      resume.status = "completed";
      await resume.save();

      res.json(resume);
    } catch (aiErr) {
      console.error("AI analysis error:", aiErr.message);
      resume.status = "failed";
      await resume.save();
      res.status(500).json({ message: "AI analysis failed" });
    }
  } catch (error) {
    console.error("Analyze error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resumes for current user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-extractedText"); // Don't send large text field in list

    res.json(resumes);
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

// @desc    Get a single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete file from disk
    const fs = require("fs");
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: "Resume deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

module.exports = {
  uploadResume,
  analyzeResume,
  getResumes,
  getResumeById,
  deleteResume,
};