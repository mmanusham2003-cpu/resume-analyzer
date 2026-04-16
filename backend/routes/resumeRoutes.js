const express = require("express");
const router = express.Router();

const {
  uploadResume,
  analyzeResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All resume routes are protected
router.use(protect);

router.get("/", getResumes);
router.get("/:id", getResumeById);
router.post("/upload", upload.single("resume"), uploadResume);
router.post("/:id/analyze", analyzeResume);
router.delete("/:id", deleteResume);

module.exports = router;