/**
 * Calculate overall resume score from section scores
 */
const calculateOverallScore = (sections) => {
  const weights = {
    contactInfo: 0.1,
    experience: 0.3,
    education: 0.2,
    skills: 0.25,
    formatting: 0.15,
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const [section, weight] of Object.entries(weights)) {
    if (sections[section] && typeof sections[section].score === 'number') {
      totalScore += sections[section].score * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
};

/**
 * Calculate keyword match score between resume and job description
 */
const calculateMatchScore = (resumeKeywords = [], jobKeywords = []) => {
  if (jobKeywords.length === 0) return 0;

  const resumeSet = new Set(resumeKeywords.map((k) => k.toLowerCase()));
  let matchCount = 0;

  for (const keyword of jobKeywords) {
    if (resumeSet.has(keyword.toLowerCase())) {
      matchCount++;
    }
  }

  return Math.round((matchCount / jobKeywords.length) * 100);
};

/**
 * Get score label based on numeric score
 */
const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  if (score >= 40) return 'Needs Improvement';
  return 'Poor';
};

/**
 * Get score color hex based on numeric score
 */
const getScoreColor = (score) => {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#3b82f6';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

module.exports = {
  calculateOverallScore,
  calculateMatchScore,
  getScoreLabel,
  getScoreColor,
};
