const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    analysis: {
      overallScore: { type: Number, default: 0 },
      sections: {
        contactInfo: { score: Number, feedback: String },
        experience: { score: Number, feedback: String },
        education: { score: Number, feedback: String },
        skills: { score: Number, feedback: String },
        formatting: { score: Number, feedback: String },
      },
      keywords: [String],
      suggestions: [String],
      summary: { type: String, default: '' },
    },
    jobDescription: {
      type: String,
      default: '',
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['uploaded', 'parsing', 'parsed', 'analyzing', 'completed', 'failed'],
      default: 'uploaded',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
