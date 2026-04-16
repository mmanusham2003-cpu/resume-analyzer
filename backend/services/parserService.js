const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from a PDF file
 */
const parsePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF parse error:', error.message);
    throw new Error('Failed to parse PDF file');
  }
};

/**
 * Extract text from a DOCX file
 */
const parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX parse error:', error.message);
    throw new Error('Failed to parse DOCX file');
  }
};

/**
 * Parse resume based on file type
 */
const parseResume = async (filePath, fileType) => {
  const ext = fileType || path.extname(filePath).replace('.', '').toLowerCase();

  switch (ext) {
    case 'pdf':
      return await parsePDF(filePath);
    case 'docx':
      return await parseDOCX(filePath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
};

module.exports = { parseResume, parsePDF, parseDOCX };
