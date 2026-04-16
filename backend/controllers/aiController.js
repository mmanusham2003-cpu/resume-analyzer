const Resume = require('../models/Resume');
const { generateSuggestions, analyzeResumeWithAI } = require('../services/aiService');

// @desc    Get AI-powered suggestions for a resume
// @route   POST /api/ai/suggestions/:id
// @access  Private
const getSuggestions = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!resume.extractedText) {
      return res
        .status(400)
        .json({ message: 'Resume has not been parsed yet. Analyze it first.' });
    }

    const targetRole = req.body.targetRole || '';
    const suggestions = await generateSuggestions(resume.extractedText, targetRole);

    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error.message);
    res.status(500).json({ message: 'Failed to generate AI suggestions' });
  }
};

// @desc    Match resume against a job description
// @route   POST /api/ai/match/:id
// @access  Private
const getJobMatch = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!resume.extractedText) {
      return res
        .status(400)
        .json({ message: 'Resume has not been parsed yet. Analyze it first.' });
    }

    const analysis = await analyzeResumeWithAI(resume.extractedText, jobDescription);

    // Update resume with new analysis
    resume.jobDescription = jobDescription;
    resume.matchScore = analysis.matchScore || 0;
    resume.analysis = analysis;
    resume.status = 'completed';
    await resume.save();

    res.json({
      matchScore: resume.matchScore,
      analysis: resume.analysis,
    });
  } catch (error) {
    console.error('Job match error:', error.message);
    res.status(500).json({ message: 'Failed to compute job match' });
  }
};

module.exports = { getSuggestions, getJobMatch };
