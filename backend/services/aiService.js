const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze resume text using Google Gemini AI
 * Returns structured analysis with scores, sections, keywords, suggestions
 */
const analyzeResumeWithAI = async (resumeText, jobDescription = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const jobContext = jobDescription
      ? `\n\nThe candidate is applying for a role with this job description:\n"${jobDescription}"\n\nAlso provide a matchScore (0-100) indicating how well the resume matches this job.`
      : "\n\nNo specific job description provided, so set matchScore to 0.";

    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume text and return a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):

{
  "overallScore": <number 0-100>,
  "sections": {
    "contactInfo": { "score": <number 0-100>, "feedback": "<brief feedback>" },
    "experience": { "score": <number 0-100>, "feedback": "<brief feedback>" },
    "education": { "score": <number 0-100>, "feedback": "<brief feedback>" },
    "skills": { "score": <number 0-100>, "feedback": "<brief feedback>" },
    "formatting": { "score": <number 0-100>, "feedback": "<brief feedback>" }
  },
  "keywords": ["<relevant keyword>", ...],
  "suggestions": ["<actionable improvement suggestion>", ...],
  "summary": "<2-3 sentence overall summary of the resume quality>",
  "matchScore": <number 0-100>
}

Scoring guidelines:
- contactInfo: Does it have name, email, phone, LinkedIn, location?
- experience: Quality, relevance, use of action verbs, quantified achievements?
- education: Relevant degrees, certifications, GPA if noteworthy?
- skills: Relevant technical and soft skills listed?
- formatting: Clean layout, proper sections, professional language, no typos?
- overallScore: Weighted average of all sections
- keywords: Extract 8-15 relevant industry/technical keywords found
- suggestions: Provide 4-6 specific, actionable improvements
- summary: Brief professional assessment
${jobContext}

RESUME TEXT:
${resumeText.substring(0, 8000)}

Return ONLY valid JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    const analysis = JSON.parse(text);

    // Validate and ensure required fields exist
    return {
      overallScore: analysis.overallScore || 50,
      sections: {
        contactInfo: analysis.sections?.contactInfo || { score: 50, feedback: "Not enough data to evaluate." },
        experience: analysis.sections?.experience || { score: 50, feedback: "Not enough data to evaluate." },
        education: analysis.sections?.education || { score: 50, feedback: "Not enough data to evaluate." },
        skills: analysis.sections?.skills || { score: 50, feedback: "Not enough data to evaluate." },
        formatting: analysis.sections?.formatting || { score: 50, feedback: "Not enough data to evaluate." },
      },
      keywords: analysis.keywords || [],
      suggestions: analysis.suggestions || [],
      summary: analysis.summary || "Analysis completed.",
      matchScore: analysis.matchScore || 0,
    };
  } catch (error) {
    console.error("Gemini AI error:", error.message);

    // Fallback to basic rule-based analysis
    return fallbackAnalysis(resumeText);
  }
};

/**
 * Fallback rule-based analysis when AI API fails
 */
const fallbackAnalysis = (resumeText) => {
  const text = resumeText.toLowerCase();
  const len = resumeText.length;

  // Contact info check
  const hasEmail = /\S+@\S+\.\S+/.test(resumeText);
  const hasPhone = /[\d\-\(\)]{7,}/.test(resumeText);
  const hasLinkedIn = text.includes("linkedin");
  const contactScore = (hasEmail ? 35 : 0) + (hasPhone ? 35 : 0) + (hasLinkedIn ? 30 : 0);

  // Experience check
  const hasExperience = text.includes("experience") || text.includes("work history");
  const hasAchievements = /\d+%|\d+ year|\$\d/.test(resumeText);
  const expScore = (hasExperience ? 50 : 20) + (hasAchievements ? 30 : 0) + (len > 1500 ? 20 : 10);

  // Education check
  const hasEducation = text.includes("education") || text.includes("degree") || text.includes("university");
  const eduScore = hasEducation ? 75 : 30;

  // Skills check
  const hasSkills = text.includes("skill") || text.includes("technologies") || text.includes("proficient");
  const techKeywords = ["javascript", "python", "react", "node", "sql", "java", "html", "css", "git", "aws"];
  const foundTech = techKeywords.filter((k) => text.includes(k));
  const skillScore = (hasSkills ? 40 : 15) + Math.min(foundTech.length * 8, 60);

  // Formatting check
  const formatScore = Math.min(40 + (len > 500 ? 20 : 0) + (len < 5000 ? 20 : 0) + (hasEmail ? 20 : 0), 100);

  const overallScore = Math.round(
    contactScore * 0.1 + expScore * 0.3 + eduScore * 0.2 + skillScore * 0.25 + formatScore * 0.15
  );

  const keywords = [...foundTech];
  if (hasEmail) keywords.push("Email");
  if (hasLinkedIn) keywords.push("LinkedIn");

  const suggestions = [];
  if (!hasEmail) suggestions.push("Add your email address for contact.");
  if (!hasPhone) suggestions.push("Include a phone number.");
  if (!hasLinkedIn) suggestions.push("Add your LinkedIn profile URL.");
  if (!hasExperience) suggestions.push("Add a dedicated Work Experience section.");
  if (!hasAchievements) suggestions.push("Quantify achievements with numbers and percentages.");
  if (foundTech.length < 3) suggestions.push("List more relevant technical skills.");

  return {
    overallScore,
    sections: {
      contactInfo: { score: contactScore, feedback: hasEmail ? "Email found." : "Missing contact details." },
      experience: { score: Math.min(expScore, 100), feedback: hasExperience ? "Experience section present." : "No experience section found." },
      education: { score: eduScore, feedback: hasEducation ? "Education details found." : "No education section detected." },
      skills: { score: Math.min(skillScore, 100), feedback: `${foundTech.length} technical skills detected.` },
      formatting: { score: formatScore, feedback: "Basic formatting evaluated." },
    },
    keywords,
    suggestions,
    summary: `Resume received with an overall score of ${overallScore}/100. ${suggestions.length > 0 ? "See suggestions for improvements." : "Looks solid overall."}`,
    matchScore: 0,
  };
};

/**
 * Generate AI-powered suggestions for improving a resume
 */
const generateSuggestions = async (resumeText, targetRole = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const roleContext = targetRole
      ? `The candidate wants to target this role: "${targetRole}".`
      : "No specific target role provided.";

    const prompt = `You are an expert career coach. Given the following resume text, provide 5-8 specific, actionable suggestions to improve the resume.
${roleContext}

Return a JSON array of strings, each being one suggestion. Return ONLY valid JSON, no other text.

RESUME TEXT:
${resumeText.substring(0, 6000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    return JSON.parse(text);
  } catch (error) {
    console.error("Generate suggestions error:", error.message);
    return [
      "Add more quantified achievements to your experience section.",
      "Include relevant keywords from job descriptions you're targeting.",
      "Ensure your contact information is complete and professional.",
      "Use action verbs to start each bullet point.",
      "Tailor your resume to each specific job application.",
    ];
  }
};

module.exports = { analyzeResumeWithAI, generateSuggestions };