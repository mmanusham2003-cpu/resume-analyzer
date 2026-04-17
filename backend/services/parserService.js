const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from a PDF buffer
 */
const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parse error:', error.message);
    throw new Error('Failed to parse PDF file');
  }
};

/**
 * Extract text from a DOCX buffer
 */
const parseDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parse error:', error.message);
    throw new Error('Failed to parse DOCX file');
  }
};

/**
 * Parse resume from buffer based on file type
 */
const parseResume = async (buffer, fileType) => {
  switch (fileType) {
    case 'pdf':
      return await parsePDF(buffer);
    case 'docx':
      return await parseDOCX(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};

module.exports = { parseResume, parsePDF, parseDOCX };
